<template>
    <div class="text-xl">dashboard</div>
    <div>state: {{ !!publicRoomListState }}</div>
    <div>isReady: {{ isReadyPublicRoomList }}</div>
    <div>isLoading: {{ isLoadingPublicRoomList }}</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRaw } from "vue";
import { getGames, getPublicRooms } from "@/api";
import { useAsyncLocalState } from "@/lib/composable";

const {
    state: publicRoomListState,
    isReady: isReadyPublicRoomList,
    isLoading: isLoadingPublicRoomList,
    execute: executePublicRoomListState,
} = useAsyncLocalState({
    storageKey: "public-game-room-list",
    defaultValue: [],
    apiPromise: handleGetPublicRooms,
});

const publicRoomQuery = reactive({
    status: null, // RoomStatus.processing | RoomStatus.waiting | RoomStatus.complete,
    get_mine_rooms: false,
    is_full: null,
    has_password: null,
    per_page: 8,
    page: 1,
    keyword: null,
});

onMounted(() => {
    handleGetGames();
    executePublicRoomListState();
});

async function handleGetGames() {
    const { data, error } = await getGames();
    console.log("games", data, error);
    if (error === null) {
        return [];
    }
    return data;
}

async function handleGetPublicRooms() {
    const { data, error } = await getPublicRooms(toRaw(publicRoomQuery));
    console.log("rooms", data, error);
    if (error !== null) {
        return [];
    }
    return data;
}
</script>

