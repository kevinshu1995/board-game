<template>
    <Button @click="auth.signInWithProvider('google')">google</Button>
    <Button @click="auth.signInWithProvider('facebook')">facebook</Button>
    <Button @click="auth.signInWithProvider('discord')">Discord</Button>
    <Button @click="auth.handleSignOut">signOut</Button>
    <Button @click="updateData">update</Button>
    <hr />
    <Button @click="handleGetGames">getGames</Button>
    <Button @click="handleGetGame">getGame</Button>
    <hr />
    post room
    <Button @click="handleSetupNewRoom">setupNewRoom</Button>
    <Button @click="handleRegisterNewPlayer(9)">registerNewPlayer</Button>
    <hr />
    get room
    <Button @click="handleGetPublicRooms">getPublic rooms</Button>
    <Button @click="handleGetRoomPlayers">GetRoomPlayers</Button>
    <Button @click="handleGetRoomData">getRoomData</Button>
    <hr />
    delete room
    <Button @click="handleDeletePlayerInRoom">deletePlayerInRoom</Button>
</template>

<script setup lang="ts">
import Button from "@widget/button/Button.vue";

import { useAuth } from "@/store";
import {
    getGames,
    getGame,
    setupNewRoom,
    registerNewPlayer,
    getPublicRooms,
    getRoomPlayers,
    getRoomData,
    deletePlayerInRoom,
} from "@/api";

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
async function handleGetPublicRooms() {
    const { data, error } = await getPublicRooms({
        get_mine_rooms: true,
    });
    console.log(data, error);
}

async function handleGetRoomPlayers() {
    const room_id = 28;
    const { data, error } = await getRoomPlayers(room_id);

    console.log(data, error);
}

async function handleGetRoomData() {
    const room_id = 28;
    const { data, error } = await getRoomData(room_id);

    console.log(data, error);
}

async function handleDeletePlayerInRoom() {
    if (!auth.session) {
        return;
    }

    const room_id = 28;
    const user_id = auth.session.user.id;

    const { data, error } = await deletePlayerInRoom(room_id, user_id);

    console.log(data, error);
}
</script>

