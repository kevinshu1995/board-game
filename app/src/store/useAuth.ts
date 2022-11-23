import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";

import type { Session } from "@supabase/supabase-js";
import {
    signInWithProvider as handleSignInWithProvider,
    signOut,
    useUpdateProfile,
    signInWithEmail as handleSignInWithEmail,
    resetEmailPassword as handleResetEmailPassword,
} from "@/api";
import type { providers, signInWithEmailArgs, updateProfileArgs } from "@/api";
import { supabase } from "@/api/lib/supabase";

export const useAuth = defineStore("useAuth", () => {
    const sessionState = ref<Session | null>(null);

    const session = computed(() => {
        return sessionState.value;
    });

    onMounted(() => {
        // 首次讀取/ 登入後導回來
        supabase.auth.getSession().then(({ data }) => {
            // TODO - toast message
            sessionState.value = data.session;
            console.log(data);
        });

        // 登入 SIGNED_IN /登出 SIGNED_OUT/ 修改資料 USER_UPDATED
        supabase.auth.onAuthStateChange((event, _session) => {
            sessionState.value = _session;
            // TODO - toast message
            console.log(event);
        });
    });

    async function signInWithProvider(provider: providers) {
        const { data, error } = await handleSignInWithProvider(provider);
        // TODO - toast message

        return { data, error };
    }

    async function signInWithEmail({ email = "", password = "" }: signInWithEmailArgs) {
        const { data, error } = await handleSignInWithEmail({ email, password });
        // TODO - toast message

        return { data, error };
    }

    async function handleSignOut() {
        const { error } = await signOut();
        // TODO - toast message

        return { error };
    }

    async function handleUpdateUser({ email = "", name = "", avatar_url = "" }: updateProfileArgs) {
        if (session.value === null) {
            //TODO toast message 沒有登入
            return;
        }

        const user_id = session.value.user.id;
        const oldEmail = session.value.user.new_email || session.value.user.email;
        const oldAvatar_url = session.value.user.user_metadata?.avatar_url;
        const oldName = session.value.user.user_metadata?.name;

        const { data, error } = await useUpdateProfile(user_id, {
            email: email || oldEmail,
            name: name || oldName,
            avatar_url: avatar_url || oldAvatar_url,
        });
        // TODO - toast message

        return { data, error };
    }

    async function resetEmailPassword(email: string) {
        const { data, error } = await handleResetEmailPassword(email);
        // TODO - toast message

        return { data, error };
    }

    return {
        session,
        signInWithProvider,
        signInWithEmail,
        handleSignOut,
        handleUpdateUser,
        resetEmailPassword,
    };
});

