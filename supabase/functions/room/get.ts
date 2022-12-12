import type { User } from "https://esm.sh/@supabase/supabase-js@2";

import { RoomStatus, RoomListBody } from "./../_share/types.ts";
import {
    required,
    isString,
    isBool,
    isIn,
    minNumber,
    isInt,
} from "https://deno.land/x/validasaur/mod.ts";

import { generateResponse, validateBody } from "../_share/utils.ts";

// 取得指定房間的全部玩家
export async function getRoomPlayers(supabaseClient: any, room_id: number | null = null) {
    if (room_id === null) {
        return generateResponse(null, 400, "Bad Request - room_id is required");
    }

    const [passes, errors, errorCb] = await validateBody(
        { room_id },
        {
            // options
            room_id: [required, isInt],
        }
    );
    errorCb();

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
    const [passes, errors, errorCb] = await validateBody(body, {
        // options
        status: isIn([RoomStatus.processing, RoomStatus.waiting, RoomStatus.complete]),
        is_full: [isBool],
        has_password: [isBool],
        per_page: [isInt, minNumber(1)],
        page: [isInt, minNumber(1)],
        keyword: [isString],
        get_mine_rooms: [isBool],
    });
    errorCb();

    const baseQuery = supabaseClient.from("game_rooms");

    let query, count;
    const countSelectOption = {
        count: "exact",
        head: true,
    };

    // 判斷是否要排除非使用者所在的房間
    if (!!body.get_mine_rooms !== true || user === null) {
        query = baseQuery.select().eq("is_private", false);
        count = baseQuery.select("*", countSelectOption).eq("is_private", false);
    } else {
        query = baseQuery.select("*, players!inner(*)").eq("players.user_id", user.id);
        count = baseQuery
            .select("*, players!inner(*)", countSelectOption)
            .eq("players.user_id", user.id);
    }

    if (body.status !== undefined) {
        query = query.eq("status", body.status);
        count = count.eq("status", body.status);
    }
    if (!!body.is_full !== undefined) {
        query = query.eq("is_full", !!body.is_full);
        count = count.eq("is_full", !!body.is_full);
    }

    // TODO password 要篩選掉，不能回傳，只用來篩選
    if (body.has_password !== undefined) {
        if (!!body.has_password) {
            query = query.not("password", "is", null);
            count = count.not("password", "is", null);
        } else {
            query = query.is("password", null);
            count = count.is("password", null);
        }
    }
    if (body.keyword !== undefined) {
        query = query.textSearch("room_name", body.keyword);
        count = count.textSearch("room_name", body.keyword);
    }

    // page
    const page: number = Number(body.page) || 1;
    const per_page: number = Number(body.per_page) || 10;
    const from: number = (page - 1) * per_page;
    const to: number = page * per_page - 1;

    const { data: queryData, error: queryError } = await query.range(from, to);

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
            },
        },
        200,
        "success"
    );
}

// 取得特定房間資料
export async function getRoom(supabaseClient: any, room_id: number) {
    const [_, __, errorCb] = await validateBody(
        { room_id },
        {
            // options
            room_id: [required, isInt],
        }
    );
    errorCb();

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
    const [_, __, errorCb] = await validateBody(
        { room_uuid },
        {
            // options
            room_uuid: [required, isString],
        }
    );
    errorCb();

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

