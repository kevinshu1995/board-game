import { axiosSupabaseFunction } from "../lib/axios";
import type { RoomListBody } from "../types";

export async function getPublicRooms(body: RoomListBody) {
    try {
        const response = await axiosSupabaseFunction(`/room`, {
            method: "get",
            params: body,
        });

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getRoomPlayers(room_id: number) {
    try {
        const response = await axiosSupabaseFunction(`/room/${room_id}/players`, {
            method: "get",
        });

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getRoomData(room_id: number) {
    try {
        const response = await axiosSupabaseFunction(`/room/${room_id}`, {
            method: "get",
        });

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getRoomAccess(uuid: string) {
    try {
        const response = await axiosSupabaseFunction(`/room/access/${uuid}`, {
            method: "get",
        });

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

