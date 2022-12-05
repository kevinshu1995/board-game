import type { User } from "https://esm.sh/@supabase/supabase-js@2";
import { DeletePlayerBody, RoomPlayerRole } from "./../_share/types.ts";
import { required, isString, isInt } from "https://deno.land/x/validasaur/mod.ts";

import { generateResponse, validateBody } from "../_share/utils.ts";

export async function deletePlayerInGameRoom(
    supabaseClient: any,
    body: DeletePlayerBody,
    user: User
) {
    const [passes, errors, errorCb] = await validateBody(body, {
        room_id: [required, isInt],
        player_id: [required, isString],
    });
    errorCb();

    if (user.id !== body.player_id) {
        // 確認 user 是不是房長，不是的話就回傳 403 (只有房長可以刪除別人)

        const { data: currentUserData, error: currentUserError } = await supabaseClient
            .from("players")
            .select("room_role")
            .match({ room_id: body.room_id, user_id: user.id });

        if (currentUserError) throw currentUserError;

        if (currentUserData.length === 0) {
            return generateResponse(null, 404, "this user or the room is not found");
        }

        if (currentUserData[0].room_role !== RoomPlayerRole.chief) {
            return generateResponse(null, 403, "this user is unable to delete player in this room");
        }
    }

    const { count: targetPlayerCount, error: targetPlayerError } = await supabaseClient
        .from("players")
        .select("*, game_rooms!inner(*)", { count: "exact", head: true })
        .match({ room_id: body.room_id, user_id: body.player_id });

    if (targetPlayerCount === 0 || targetPlayerCount === null) {
        return generateResponse(null, 404, "this user or the room is not found");
    }

    if (targetPlayerError) throw targetPlayerError;

    const { error: deletePlayersError } = await supabaseClient
        .from("players")
        .delete()
        .match({ room_id: body.room_id, user_id: body.player_id });

    if (deletePlayersError) throw deletePlayersError;

    // 更新 game_rooms players
    const { data: gameRoomsData, error: gameRoomsDataError } = await supabaseClient
        .from("game_rooms")
        .select("players")
        .match({ id: body.room_id });

    if (gameRoomsDataError) throw gameRoomsDataError;

    const { players } = gameRoomsData[0];

    const newPlayers = players.filter((player: string) => player !== body.player_id);

    // 如果沒有其他玩家，移除房間
    if (newPlayers.length === 0) {
        const { error: deleteGameRoomsError } = await supabaseClient
            .from("game_rooms")
            .delete()
            .match({ id: body.room_id });

        if (deleteGameRoomsError) throw deleteGameRoomsError;

        return generateResponse(
            null,
            200,
            "success to delete the user, and removed the game room as well."
        );
    }

    const { error: updateGameRoomsError } = await supabaseClient
        .from("game_rooms")
        .update({ players: newPlayers, is_full: false })
        .match({ id: body.room_id });

    if (updateGameRoomsError) throw updateGameRoomsError;

    return generateResponse(null, 200, "success to delete the user");
}

export default {
    deletePlayerInGameRoom,
};

