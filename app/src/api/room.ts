import { axiosSupabaseFunction } from "./lib/axios";

// TODO refactor api 有重複使用
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

export async function setupNewRoom(body: CreateRoom) {
    try {
        const response = await axiosSupabaseFunction(`/room`, {
            data: body,
            method: "post",
        });

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

export async function registerNewPlayer(room_id: number) {
    try {
        const response = await axiosSupabaseFunction(`/room/${room_id}/player`, {
            method: "post",
        });

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

