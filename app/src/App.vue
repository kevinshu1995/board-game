<script setup lang="ts">
import { useAuth } from "@/store";
import { getGames, getGame, setupNewRoom, registerNewPlayer } from "@/api";
import HelloWorld from "./components/HelloWorld.vue";

const auth = useAuth();

function updateData() {
    auth.handleUpdateUser({ email: "kevin-test2@sample.com", name: "hello!------" });
}

async function handleGetGames() {
    const { data, error } = await getGames();
    if (data !== null) {
        console.log("games", data);
    }
}

async function handleGetGame() {
    const { data, error } = await getGame({ id: "1" });
    if (data !== null) {
        console.log("game id 1", data);
    }
}

async function handleSetupNewRoom() {
    const options = {
        game_id: 1,
        team_count: 2,
        player_count_max: 4,
        // round_seconds?: number | null;
        // room_name?: string;
        // does_guest_can_chat?: boolean;
        // password?: string | null;
        // is_private?: boolean;
        // is_optional_game_role
    };
    const { data, error } = await setupNewRoom(options);

    console.log(data, error);
}

async function handleRegisterNewPlayer(room_id = 9) {
    const { data, error } = await registerNewPlayer(room_id);

    console.log(data, error);
}
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
    <button @click="auth.signInWithProvider('google')">google</button>
    <button @click="auth.signInWithProvider('facebook')">facebook</button>
    <button @click="auth.signInWithProvider('discord')">Discord</button>
    <button @click="auth.handleSignOut">signOut</button>
    <button @click="updateData">update</button>
    <hr />
    <button @click="handleGetGames">getGames</button>
    <button @click="handleGetGame">getGame</button>
    <hr />
    <button @click="handleSetupNewRoom">setupNewRoom</button>
    <button @click="handleRegisterNewPlayer(9)">registerNewPlayer</button>
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

