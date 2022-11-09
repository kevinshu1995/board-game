<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { onMounted, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import { Session } from "@supabase/supabase-js";
import { signInWithProvider, signOut, useUpdateProfile } from "./api/auth";
import { supabase } from "./api/supabase";

async function signIn() {
    const { data, error } = await signInWithProvider("google");
    console.log(data, error);
}
async function signInFacebook() {
    const { data, error } = await signInWithProvider("facebook");
    console.log(data, error);
}

async function signInDiscord() {
    const { data, error } = await signInWithProvider("discord");
    console.log(data, error);
}

async function handleSignOut() {
    const { error } = await signOut();
    console.log(error);
}

const session = ref<null | Session>(null);

function updateData() {
    useUpdateProfile({ email: "kevin-test2@sample.com", name: "hello!------" });
}

onMounted(async () => {
    supabase.auth.getSession().then(({ data }) => {
        console.log(data);
    });

    supabase.auth.onAuthStateChange((_, _session) => {
        console.log("session", _session);
        session.value = _session;
    });
});
</script>

<template>
    <div>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <button @click="signIn">google</button>
    <button @click="signInFacebook">facebook</button>
    <button @click="signInDiscord">Discord</button>
    <button @click="handleSignOut">signOut</button>
    <button @click="updateData">update</button>
    <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

