import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import type { User } from "https://esm.sh/@supabase/supabase-js@2";

import { supabaseAdmin, validUser } from "../_share/supabase.ts";

import {
    corsHeaders,
    HttpError,
    handleUrlPattern,
    generateResponse,
    validateBody,
} from "../_share/utils.ts";

import {
    required,
    isNumber,
    nullable,
    isString,
    isBool,
} from "https://deno.land/x/validasaur/mod.ts";

enum RoomStatus {
    None, // 被放棄的房間
    processing = 0,
    complete = 1,
    waiting = 2,
}

enum RoomPlayerRole {
    chief = 1,
    player,
    audience,
}

type Player = {
    room_id: number;
    user_id: number | null;
    team_turns: number;
    final_score: number;
    room_role: number;
    game_role: number | null;
    is_winner: boolean | null;
    is_leaving: boolean;
    enter_time: number; // timestamp
};

type CreateRoom = {
    game_id: number;
    team_count: number;
    player_count_max: number | null;
    round_seconds?: number | null;
    room_name?: string;
    does_guest_can_chat?: boolean;
    password?: string | null;
    is_private?: boolean;
    is_optional_game_role?: boolean;
};

// 建立房間的同時會直接註冊該玩家
async function createNewRoom(supabaseClient: any, body: CreateRoom | null, user: User) {
    if (body === null) {
        return generateResponse(null, 400, "Bad Request - body is required");
    }
    const [passes, errors, errorCb] = await validateBody(body, {
        // required
        game_id: [required, isNumber],
        team_count: [required, isNumber],
        player_count_max: [required, isNumber],
        // options
        round_seconds: [nullable, isNumber],
        room_name: [isString],
        does_guest_can_chat: [isBool],
        password: [nullable, isString],
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

    return registerUserToRoom(supabaseAdmin, theRoom.id, user, true);
}

// 註冊加入等待房間成為玩家
async function registerUserToRoom(
    supabaseClient: any,
    room_id: number | null,
    user: User,
    isCreator: boolean
) {
    // 檢查 room_id
    const [passes, errors, errorCb] = await validateBody(
        { room_id },
        {
            room_id: [required, isNumber],
        }
    );

    errorCb();

    // 取得該房間資訊
    const { data: gameRoomsData, error: gameRoomsError } = await supabaseClient
        .from("game_rooms")
        .select()
        .eq("id", room_id);

    if (gameRoomsError) throw gameRoomsError;

    if (gameRoomsData.length === 0) {
        return generateResponse(null, 404, "Room is not found");
    }

    const status = gameRoomsData[0].status;

    // 如果房間是等待狀態才可以加入
    // 如果不是等待狀態則 回傳 422 代表不能註冊成為該房間的玩家
    if (status !== RoomStatus.waiting) {
        return generateResponse(null, 422, "this room is not in waiting");
    }

    // 取得該房間 players
    const { data: playersData, error: playersError } = await supabaseClient
        .from("players")
        .select()
        .eq("room_id", room_id);

    if (playersError) throw playersError;

    const playerCounts = playersData.length;
    const maxPlayers = gameRoomsData[0].room_player_count_limit;

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
    const team_count = gameRoomsData[0].team_count;
    // team_turns - 2 依照 players.team_turns 的值當作 index 建立一個陣列，代表隊伍人數
    const player_team_turns: number[] = playersData.reduce((acc: number[], cur: Player) => {
        acc[cur.team_turns] += 1;
        return acc;
    }, Array(team_count).fill(0));

    // team_turns - 3 找到第一隊最少人數的隊伍 (有相同人數的隊伍，則先選排前面的隊伍的意思)
    const currentUserTeam = player_team_turns.indexOf(Math.min(...player_team_turns));

    const { data: currentPlayerData, error: currentPlayerError } = await supabaseClient
        .from("players")
        .insert({
            user_id: user.id,
            room_id,
            team_turns: currentUserTeam,
            // 如果加入時 is_creator = true 會以房主的身份加入
            room_role: isCreator ? RoomPlayerRole.chief : RoomPlayerRole.player,
        })
        .select();

    if (currentPlayerError) throw currentPlayerError;

    return generateResponse(
        {
            currentPlayer: currentPlayerData[0],
            players: playersData,
            room: gameRoomsData[0],
        },
        200,
        "success"
    );
}

serve(async req => {
    const { url, method } = req;

    console.log("request \n", req);

    if (method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    let body = null;
    if (method === "POST" || method === "PUT") {
        try {
            body = await req.json();
        } catch (err) {}
    }

    try {
        // every request must have a valid user
        const user = await validUser(req);

        if (method) {
            if (method === "GET") {
            }

            if (method === "POST") {
                const testRegisterRoomPlayer = handleUrlPattern(url, "/room/:room_id/player");
                if (testRegisterRoomPlayer !== null) {
                    const room_id: string = testRegisterRoomPlayer?.pathname.groups.room_id || "";
                    if (room_id === "") {
                        throw new HttpError("room_id is required", 400);
                    }
                    return registerUserToRoom(supabaseAdmin, Number(room_id), user, false);
                }

                // need body section below ---
                if (body === null) {
                    throw new HttpError("body is required", 400);
                }

                if (handleUrlPattern(url, "/room") !== null) {
                    return createNewRoom(supabaseAdmin, body, user);
                }
            }
            throw new HttpError("api url is not found", 404);
        }

        throw new HttpError("method is required", 400);
    } catch (error) {
        console.error(error);

        return generateResponse(null, error.status || 400, error.message);
    }
});

// To invoke:
// curl -i --location --request POST 'http://{api url}/room' \
//   --header 'Authorization: Bearer {token} \
//   --header 'Content-Type: application/json' \
//   --data '{"game_id": 1, "team_count": 2, "player_count_max": 8, "round_seconds": 60 }'

