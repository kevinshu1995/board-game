import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

import { supabaseAdmin, validUser } from "../_share/supabase.ts";

import {
    corsHeaders,
    HttpError,
    handleUrlPattern,
    parseUrlQuery,
    generateResponse,
    validateBody,
} from "../_share/utils.ts";

import Get from "./get.ts";
import Post from "./post.ts";

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
        if (method) {
            if (method === "GET") {
                // [get] /room (取得公開房間)
                const testGetRoomList = handleUrlPattern(url, "/room");
                if (testGetRoomList !== null) {
                    return Get.getRoomList(supabaseAdmin, parseUrlQuery(url) ?? {});
                }

                // [get] /room/:room_id/players (取得指定房間全部玩家)
                const testGetRoomPlayers = handleUrlPattern(url, "/room/:room_id/players");
                if (testGetRoomPlayers !== null) {
                    const room_id: string | null =
                        testGetRoomPlayers?.pathname.groups.room_id || null;
                    return Get.getRoomPlayers(supabaseAdmin, Number(room_id));
                }
            }

            if (method === "POST") {
                // every post request must be sent from a valid user
                const user = await validUser(req);

                // [post] /room/:room_id/player (註冊玩家到房間)
                const testRegisterRoomPlayer = handleUrlPattern(url, "/room/:room_id/player");
                if (testRegisterRoomPlayer !== null) {
                    const room_id: string = testRegisterRoomPlayer?.pathname.groups.room_id || "";
                    if (room_id === "") {
                        throw new HttpError("room_id is required", 400);
                    }
                    return Post.registerUserToRoom(supabaseAdmin, Number(room_id), user, false);
                }

                // need body section below ---
                if (body === null) {
                    throw new HttpError("body is required", 400);
                }

                // [post] /room (建立房間)
                if (handleUrlPattern(url, "/room") !== null) {
                    return Post.createNewRoom(supabaseAdmin, body, user);
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

