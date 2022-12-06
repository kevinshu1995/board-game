import { axiosSupabaseFunction } from "../lib/axios";
import type { CreateRoom } from "../types";

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

