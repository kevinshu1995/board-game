import { axiosSupabaseFunction } from "../lib/axios";

export async function deletePlayerInRoom(room_id: number, user_id: string) {
    try {
        const response = await axiosSupabaseFunction(`/room/${room_id}/player/${user_id}`, {
            method: "delete",
        });

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

