import { supabase } from "./supabase";

const redirectUrl = "/"; // TODO - add query for messages

export type signInWithEmailArgs = {
    email: string;
    password: string;
};

async function signInWithEmail({ email = "", password = "" }: signInWithEmailArgs) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

export type providers = "google" | "facebook" | "discord";

async function signInWithProvider(provider: providers) {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                // TODO add query for messages
                redirectTo: redirectUrl,
            },
        });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        return { error };
    } catch (error) {
        return { error };
    }
}

export interface updateProfileArgs {
    name?: string;
    email?: string;
    avatar_url?: string;
}

async function useUpdateProfile(user_id: string, dataForUpdate: updateProfileArgs = {}) {
    const { name, email, avatar_url } = dataForUpdate;
    try {
        const { data, error: updateUserError } = await supabase.auth.updateUser({
            data: {
                name,
                avatar_url,
            },
            email,
        });

        const { error: updateProfilesError } = await supabase
            .from("profiles")
            .update({
                name,
                avatar_url,
                email,
            })
            .eq("id", user_id);

        const error =
            updateProfilesError && updateUserError
                ? {
                      updateUserError,
                      updateProfilesError,
                  }
                : updateProfilesError || updateUserError;

        return { error, data };
    } catch (error) {
        return { error, data: null };
    }
}

async function resetEmailPassword(email: string) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            // TODO add query for messages
            redirectTo: redirectUrl,
        });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

export { signInWithProvider, signOut, useUpdateProfile, signInWithEmail, resetEmailPassword };

