import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

import { supabaseAdmin, validUser } from "../_share/supabase.ts";

import {
    corsHeaders,
    HttpError,
    handleUrlPattern,
    parseUrlQuery,
    generateResponse,
} from "../_share/utils.ts";

import Get from "./get.ts";
import Post from "./post.ts";
import Delete from "./delete.ts";

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
                    const query = parseUrlQuery(url);
                    const get_mine_rooms = !!query?.get_mine_rooms || false;
                    const user = get_mine_rooms ? await validUser(req) : null;
                    return Get.getRoomList(supabaseAdmin, parseUrlQuery(url) ?? {}, user);
                }

                // [get] /room/:room_id (取得指定房間資料)
                const testGetRoom = handleUrlPattern(url, "/room/:room_id");
                if (testGetRoom !== null) {
                    const room_id: string | null = testGetRoom?.pathname.groups.room_id || null;
                    return Get.getRoom(supabaseAdmin, Number(room_id));
                }

                // [get] /room/:room_id/players (取得指定房間全部玩家)
                const testGetRoomPlayers = handleUrlPattern(url, "/room/:room_id/players");
                if (testGetRoomPlayers !== null) {
                    const room_id: string | null =
                        testGetRoomPlayers?.pathname.groups.room_id || null;
                    return Get.getRoomPlayers(supabaseAdmin, Number(room_id));
                }

                // [get] /room/access/:uuid 取得指定房間是否需要密碼
                const testGetRoomAccess = handleUrlPattern(url, "/room/access/:uuid");
                if (testGetRoomAccess !== null) {
                    const uuid: string | null = testGetRoomAccess?.pathname.groups.uuid || null;
                    return Get.getRoomAccess(supabaseAdmin, uuid);
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
                    return Post.registerUserToRoom(
                        supabaseAdmin,
                        {
                            room_id: Number(room_id),
                            password: body?.password || null,
                        },
                        user,
                        false
                    );
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

            if (method === "DELETE") {
                const user = await validUser(req);

                const testDeletePlayerInGameRoom = handleUrlPattern(
                    url,
                    "/room/:room_id/player/:player_id"
                );
                if (testDeletePlayerInGameRoom !== null) {
                    const room_id: string | null =
                        testDeletePlayerInGameRoom?.pathname.groups.room_id || null;
                    const player_id: string | null =
                        testDeletePlayerInGameRoom?.pathname.groups.player_id || null;
                    return Delete.deletePlayerInGameRoom(
                        supabaseAdmin,
                        {
                            room_id: Number(room_id),
                            player_id,
                        },
                        user
                    );
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

