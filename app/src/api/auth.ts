import { supabase } from "./supabase";

const redirectUrl = "/"; // TODO - add query for messages

type signInWithEmailArgs = {
    email: string;
    password: string;
};

async function signInWithEmail({ email = "", password = "" }: signInWithEmailArgs) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
}

type providers = "google" | "facebook" | "discord";

async function signInWithProvider(provider: providers) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            // TODO add query for messages
            redirectTo: redirectUrl,
        },
    });
    return { data, error };
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

interface updateData {
    name?: string;
    email?: string;
    avatar_url?: string;
}

async function useUpdateProfile(dataForUpdate: updateData = {}) {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (session === null) {
        return { error: "No session" };
    }

    const user_id: string | undefined = data?.session?.user?.id;

    dataForUpdate = {
        email: data?.session?.user?.new_email || data?.session?.user?.email,
        avatar_url: data?.session?.user?.user_metadata?.avatar_url,
        name: data?.session?.user?.user_metadata?.name,
        ...dataForUpdate,
    };

    const { name, email, avatar_url } = dataForUpdate;

    const { data: updateUserData, error: updateUserError } = await supabase.auth.updateUser({
        data: {
            name,
            avatar_url,
        },
        email,
    });

    const { error } = await supabase
        .from("profiles")
        .update({
            name,
            avatar_url,
            email,
        })
        .eq("id", user_id);
    return { error, updateUserData, updateUserError };
}

async function resetEmailPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        // TODO add query for messages
        redirectTo: redirectUrl,
    });
    return { data, error };
}

export { signInWithProvider, signOut, useUpdateProfile, signInWithEmail, resetEmailPassword };

