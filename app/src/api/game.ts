import { axiosSupabaseFunction } from "./lib/axios";

export async function getGames() {
    try {
        const response = await axiosSupabaseFunction(`/game`);

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getGame({ id }: { id: string }) {
    try {
        const response = await axiosSupabaseFunction(`/game/${id}`);

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

