import type { User } from "https://esm.sh/@supabase/supabase-js@2";
import { RoomStatus, RoomPlayerRole, CreateRoom, TablePlayer } from "./../_share/types.ts";
import {
    required,
    nullable,
    isString,
    isBool,
    isIn,
    minLength,
    isInt,
} from "https://deno.land/x/validasaur/mod.ts";

import { generateResponse, validateBody } from "../_share/utils.ts";

// 建立房間的同時會直接註冊該玩家
export async function createNewRoom(supabaseClient: any, body: CreateRoom | null, user: User) {
    if (body === null) {
        return generateResponse(null, 400, "Bad Request - body is required");
    }
    const [passes, errors, errorCb] = await validateBody(body, {
        // required
        game_id: [required, isInt],
        team_count: [required, isInt],
        player_count_max: [required, isInt],
        // options
        round_seconds: [nullable, isInt],
        room_name: [isString],
        does_guest_can_chat: [isBool],
        password: [nullable, isString, minLength(4)],
        is_private: [isBool],
        is_optional_game_role: [isBool],
    });
    errorCb();

    const insertBody = {
        game_id: body.game_id,
        room_name: body.room_name || `${user.user_metadata.name || "Mystery person"}'s room`,
        password: body.password || null,
        round_time: body.round_seconds || null,
        does_guest_can_chat: body.does_guest_can_chat || false,
        status: RoomStatus.waiting,
        // game_start_at
        // game_end_at
        room_player_count_limit: body.player_count_max,
        is_private: body.is_private || false,
        is_optional_game_role: body.is_optional_game_role || false,
        team_count: body.team_count,
    };

    const { data, error } = await supabaseClient.from("game_rooms").insert(insertBody).select();

    if (error) throw error;

    // 應該要只有一個
    const theRoom = data[0];

    return registerUserToRoom(
        supabaseClient,
        {
            room_id: theRoom.id,
        },
        user,
        true
    );
}

type RegisterUserToRoomBody = {
    room_id: number;
    password?: string;
};

// 註冊加入等待房間成為玩家
export async function registerUserToRoom(
    supabaseClient: any,
    body: RegisterUserToRoomBody,
    user: User,
    isCreator: boolean
) {
    // 檢查 room_id
    const [passes, errors, errorCb] = await validateBody(body, {
        room_id: [required, isInt],
        password: [isString, nullable],
    });

    errorCb();

    // 取得該房間資訊
    const { data: gameRoomsData, error: gameRoomsError } = await supabaseClient
        .from("game_rooms")
        .select()
        .eq("id", body.room_id);

    if (gameRoomsError) throw gameRoomsError;

    if (gameRoomsData.length === 0) {
        return generateResponse(null, 404, "Room is not found");
    }

    const theRoom = gameRoomsData[0];

    if (theRoom.password !== null && theRoom.password !== body.password) {
        return generateResponse(null, 403, "room's password is wrong");
    }

    const status = theRoom.status;

    // 如果房間是等待狀態才可以加入
    // 如果不是等待狀態則 回傳 422 代表不能註冊成為該房間的玩家
    if (status !== RoomStatus.waiting) {
        return generateResponse(null, 422, "this room is not in waiting");
    }

    // 取得該房間 players
    const { data: playersData, error: playersError } = await supabaseClient
        .from("players")
        .select()
        .eq("room_id", body.room_id);

    if (playersError) throw playersError;

    const playerCounts = playersData.length;
    const maxPlayers = theRoom.room_player_count_limit;

    // 如果人數未滿上限就可以加入
    // 如果已達上限 回傳 423 代表人數已滿
    if (playerCounts >= maxPlayers) {
        return generateResponse(null, 423, "this room is full");
    }

    // 如果已經加入房間則回傳 409 代表已經在裡面了
    if (
        Array.isArray(playersData) &&
        playersData.find(item => item.user_id === user.id) !== undefined
    ) {
        return generateResponse(null, 409, "this player has already registered to this room");
    }

    // team_turns - 1 (計算這位玩家的隊伍，依照 team_count 來分 假設有兩隊 0, 1, 0, 1)
    const team_count = theRoom.team_count;
    // team_turns - 2 依照 players.team_turns 的值當作 index 建立一個陣列，代表隊伍人數
    const player_team_turns: number[] = playersData.reduce((acc: number[], cur: TablePlayer) => {
        acc[cur.team_turns] += 1;
        return acc;
    }, Array(team_count).fill(0));

    // team_turns - 3 找到第一隊最少人數的隊伍 (有相同人數的隊伍，則先選排前面的隊伍的意思)
    const currentUserTeam = player_team_turns.indexOf(Math.min(...player_team_turns));

    const { data: currentPlayerData, error: currentPlayerError } = await supabaseClient
        .from("players")
        .insert({
            user_id: user.id,
            room_id: body.room_id,
            team_turns: currentUserTeam,
            // 如果加入時 is_creator = true 會以房主的身份加入
            room_role: isCreator ? RoomPlayerRole.chief : RoomPlayerRole.player,
        })
        .select();

    if (currentPlayerError) throw currentPlayerError;

    const gameRoomsPlayers: string[] = Array.isArray(theRoom.players)
        ? theRoom.players.concat([user.id])
        : [user.id];

    // TODO 改用 database trigger 更新 is_full
    const { data: updateGameRoomData, error: updateGameRoomsError } = await supabaseClient
        .from("game_rooms")
        .update({ is_full: maxPlayers <= playerCounts + 1, players: gameRoomsPlayers }) // +1 是因為 playerCounts 不包含這個新註冊的使用者
        .eq("id", body.room_id)
        .select();

    if (updateGameRoomsError) throw updateGameRoomsError;

    return generateResponse(
        {
            players: [...playersData, currentPlayerData[0]],
            room: updateGameRoomData,
        },
        200,
        "success"
    );
}

export default {
    createNewRoom,
    registerUserToRoom,
};

