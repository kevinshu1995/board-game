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
export async function getRoomList(supabaseClient: any, body: RoomListBody) {
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
    });
    errorCb();

    let query = supabaseClient.from("game_rooms").select();
    let count = supabaseClient.from("game_rooms").select("*", {
        count: "exact",
        head: true,
    });

    query = query.eq("is_private", false);
    count = count.eq("is_private", false);

    if (body.status !== undefined) {
        query = query.eq("status", body.status);
        count = count.eq("status", body.status);
    }
    if (body.is_full !== undefined) {
        query = query.eq("is_full", body.is_full);
        count = count.eq("is_full", body.is_full);
    }
    if (body.has_password !== undefined) {
        if (body.has_password) {
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

export default {
    getRoomPlayers,
    getRoomList,
};

