import { axiosSupabaseAnon } from "./lib/axios";

const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTION_URL;

export async function getGames() {
    try {
        const response = await axiosSupabaseAnon(`${functionsUrl}/game`);

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
        const response = await axiosSupabaseAnon(`${functionsUrl}/game/${id}`);

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

