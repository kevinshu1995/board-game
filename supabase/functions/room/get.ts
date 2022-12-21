import type { User } from "https://esm.sh/@supabase/supabase-js@2";

import { RoomStatus, RoomListBody } from "./../_share/types.ts";
import {
    required,
    isString,
    isBool,
    isIn,
    minNumber,
    isInt,
    nullable,
} from "https://deno.land/x/validasaur/mod.ts";

import { generateResponse, validateBody } from "../_share/utils.ts";

// 取得指定房間的全部玩家
export async function getRoomPlayers(supabaseClient: any, room_id: number | null = null) {
    if (room_id === null) {
        return generateResponse(null, 400, "Bad Request - room_id is required");
    }

    const { isPass, response } = await validateBody(
        { room_id },
        {
            // options
            room_id: [required, isInt],
        }
    );
    if (!isPass) return response;

    const { count, error: gameRoomError } = await supabaseClient
        .from("game_rooms")
        .select("*", { count: "exact", head: true })
        .eq("id", room_id);

    if (gameRoomError) throw gameRoomError;
    if (count === 0) {
        return generateResponse(null, 404, "Room is not found");
    }

    const { data: playerData, error } = await supabaseClient
        .from("players")
        .select()
        .eq("room_id", room_id);

    interface playerData {
        room_id: number;
    }

    const formatFunction = <T extends playerData>(item: T): Omit<T, "room_id"> => {
        const { room_id, ...rest } = item;
        return rest;
    };

    const formatPlayerData = playerData.map(formatFunction);

    return generateResponse(
        {
            players: formatPlayerData,
            room_id,
        },
        200,
        "success"
    );
}

// 取得全部房間 (僅能取得公開房間)
export async function getRoomList(supabaseClient: any, body: RoomListBody, user: User | null) {
    if (body === null) {
        return generateResponse(null, 400, "Bad Request - body is required");
    }
    if (body.keyword !== undefined) {
        body.keyword = body.keyword === null ? null : String(body.keyword);
    }
    const { isPass, response } = await validateBody(body, {
        game_id: [isInt, nullable],
        status: isIn([RoomStatus.processing, RoomStatus.waiting, RoomStatus.complete, null]),
        is_full: [isBool, nullable],
        has_password: [isBool, nullable],
        per_page: [isInt, minNumber(1), nullable],
        page: [isInt, minNumber(1), nullable],
        keyword: [isString, nullable],
        get_mine_rooms: [isBool],
    });
    if (!isPass) return response;

    let query = supabaseClient.from("game_rooms");
    let count = supabaseClient.from("game_rooms");

    const countSelectOption = {
        count: "exact",
        head: true,
    };

    // every column exclude password
    const queryColumns = [
        "id",
        "game_id",
        "room_name",
        "created_at",
        "round_time",
        "does_guest_can_chat",
        "status",
        "game_start_at",
        "game_end_at",
        "room_player_count_limit",
        "is_private",
        "is_optional_game_role",
        "uuid",
        "team_count",
        "room_players:players",
        "is_full",
    ];

    // 判斷是否要排除非使用者所在的房間
    if (!!body.get_mine_rooms !== true || user === null) {
        const joinedQuery = queryColumns.join(", ");
        query = query.select(joinedQuery).eq("is_private", false);
        count = count.select(joinedQuery, countSelectOption).eq("is_private", false);
    } else {
        const joinedQuery = queryColumns.concat(["players!inner(*)"]).join(", ");
        query = query.select(joinedQuery).eq("players.user_id", user.id);
        count = count.select(joinedQuery, countSelectOption).eq("players.user_id", user.id);
    }

    if (body.game_id !== undefined && body.game_id !== null) {
        query = query.eq("game_id", body.game_id);
        count = count.eq("game_id", body.game_id);
    }

    if (body.status !== undefined && body.status !== null) {
        query = query.eq("status", body.status);
        count = count.eq("status", body.status);
    }

    if (!!body.is_full !== undefined && body.is_full !== null) {
        query = query.eq("is_full", !!body.is_full);
        count = count.eq("is_full", !!body.is_full);
    }

    if (body.has_password !== undefined && body.has_password !== null) {
        if (!!body.has_password) {
            query = query.not("password", "is", null);
            count = count.not("password", "is", null);
        } else {
            query = query.is("password", null);
            count = count.is("password", null);
        }
    }

    if (body.keyword !== undefined && body.keyword !== null) {
        query = query.textSearch("room_name", body.keyword);
        count = count.textSearch("room_name", body.keyword);
    }

    // page
    const page: number = Number(body.page) || 1;
    const per_page: number = Number(body.per_page) || 10;
    const from: number = (page - 1) * per_page;
    const to: number = page * per_page - 1;

    const { data: queryData, error: queryError } = await query.range(from, to);

    console.log("query data", queryData);

    if (queryError) throw queryError;

    const { count: countData, error: countError } = await count;

    if (countError) throw countError;

    return generateResponse(
        {
            rooms: queryData,
            query: body,
            meta: {
                total: countData,
                per_page,
                page,
                total_page: Math.ceil(countData / per_page),
            },
        },
        200,
        "success"
    );
}

// 取得特定房間資料
export async function getRoom(supabaseClient: any, room_id: number) {
    const { isPass, response } = await validateBody(
        { room_id },
        {
            // options
            room_id: [required, isInt],
        }
    );
    if (!isPass) return response;

    const { data: gameRoomData, error: gameRoomError } = await supabaseClient
        .from("game_rooms")
        .select(
            // 排除 password
            `
            id, 
            game_id,
            room_name,
            created_at,
            round_time, 
            does_guest_can_chat, 
            status, 
            game_start_at, 
            game_end_at, 
            room_player_count_limit, 
            is_private, 
            is_optional_game_role, 
            uuid, 
            team_count, 
            players, 
            is_full, 
            players!inner(*)
            `
        )
        .eq("id", room_id);

    if (gameRoomError) throw gameRoomError;

    if (gameRoomData.length === 0) {
        return generateResponse(null, 404, "Room is not found");
    }

    const theRoom = gameRoomData[0];

    const { data: gameRoleData, error: gameRoleError } = await supabaseClient
        .from("game_roles")
        .select()
        .eq("game_id", theRoom.game_id);

    if (gameRoleError) throw gameRoleError;

    const { data: roomRoleData, error: roomRoleError } = await supabaseClient
        .from("room_roles")
        .select();

    if (roomRoleError) throw roomRoleError;

    return generateResponse(
        {
            room: {
                info: {
                    id: theRoom.id,
                    game_id: theRoom.game_id,
                    uuid: theRoom.uuid,
                    room_name: theRoom.room_name,
                    is_full: theRoom.is_full,
                    status: theRoom.status,
                },
                room_settings: {
                    team_count: theRoom.team_count,
                    round_time: theRoom.round_time,
                    does_guest_can_chat: theRoom.does_guest_can_chat,
                    room_player_count_limit: theRoom.room_player_count_limit,
                    is_private: theRoom.is_private,
                    is_optional_game_role: theRoom.is_optional_game_role,
                },
                time: {
                    created_at: theRoom.created_at,
                    game_start_at: theRoom.game_start_at,
                    game_end_at: theRoom.game_end_at,
                },
            },
            players: theRoom.players,
            game_roles: gameRoleData,
            room_roles: roomRoleData,
        },
        200,
        "success"
    );
}

export async function getRoomAccess(supabaseClient: any, room_uuid: string | null) {
    const { isPass, response } = await validateBody(
        { room_uuid },
        {
            // options
            room_uuid: [required, isString],
        }
    );
    if (!isPass) return response;

    const { data: gameRoomData, error: gameRoomError } = await supabaseClient
        .from("game_rooms")
        .select()
        .eq("uuid", room_uuid);

    if (gameRoomError) throw gameRoomError;

    if (gameRoomData.length === 0) {
        return generateResponse(null, 404, "Room is not found");
    }

    const theRoom = gameRoomData[0];

    if (theRoom.password === null) {
        return generateResponse(
            {
                needPassword: false,
            },
            200,
            "This room is available"
        );
    }

    return generateResponse(
        {
            needPassword: true,
        },
        200,
        "This room need password to access"
    );
}

export default {
    getRoomPlayers,
    getRoomList,
    getRoom,
    getRoomAccess,
};

