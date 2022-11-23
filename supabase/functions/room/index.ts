import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import type { User } from "https://esm.sh/@supabase/supabase-js@2";

import { supabaseAdmin, validUser } from "../_share/supabase.ts";

import { corsHeaders, HttpError, handleUrlPattern, generateResponse } from "../_share/utils.ts";

import {
    validate,
    required,
    isNumber,
    nullable,
    isString,
    isBool,
    firstMessages,
} from "https://deno.land/x/validasaur/mod.ts";

enum RoomStatus {
    None, // 被放棄的房間
    processing = 0,
    complete = 1,
    waiting = 2,
}

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

async function createNewRoom(supabaseClient: any, body: CreateRoom | null, user: User) {
    if (body === null) {
        return generateResponse(null, 400, "Bad Request - body is required");
    }
    const [passes, errors] = await validate(body, {
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
    if (passes === false) {
        const errorMsg = Object.values(firstMessages(errors)).join(", ");
        return generateResponse(null, 400, `Bad Request - ${errorMsg}`);
    }

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

    return generateResponse(data, 200, "Create Room success");
}

serve(async req => {
    const { url, method } = req;

    console.log("request \n", req);

    if (method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    let body = null;
    if (method === "POST" || method === "PUT") {
        body = await req.json();
    }

    try {
        // every request must have a valid user
        const user = await validUser(req);

        if (method) {
            if (method === "GET") {
            }

            if (method === "POST") {
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

