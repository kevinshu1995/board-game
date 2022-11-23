<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/store/useAuth";
import { getGames, getGame } from "@/api/game";
import HelloWorld from "./components/HelloWorld.vue";

const auth = useAuthStore();

function updateData() {
    auth.handleUpdateUser({ email: "kevin-test2@sample.com", name: "hello!------" });
}

onMounted(async () => {
    const { data, error } = await getGames();
    if (data !== null) {
        console.log("games", data);
    }
});

onMounted(async () => {
    const { data, error } = await getGame({ id: "1" });
    if (data !== null) {
        console.log("game id 1", data);
    }
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
    <button @click="auth.signInWithProvider('google')">google</button>
    <button @click="auth.signInWithProvider('facebook')">facebook</button>
    <button @click="auth.signInWithProvider('discord')">Discord</button>
    <button @click="auth.handleSignOut">signOut</button>
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

