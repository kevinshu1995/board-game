<template>
    <div class="w-full">
        <!-- <div class="text-xl">dashboard</div>
        <div>state: {{ !!publicRoomListState }}</div>
        <div>isReady: {{ isReadyPublicRoomList }}</div>
        <div>isLoading: {{ isLoadingPublicRoomList }}</div> -->

        <div class="space-y-4">
            <!-- Query form -->
            <div class="space-y-2">
                <div class="flex gap-4 flex-wrap">
                    <BaseSearchInput
                        placeholder="Search room title"
                        class="grow"
                        :debounce="1000"
                        v-model:value-model="publicRoomQuery.keyword"
                    />

                    <!-- <CollapsedForm :games="games" v-model:form="publicRoomQuery" /> -->
                    <BaseDropdown custom-style="round" theme="light-n-border">
                        <template #trigger>
                            <div class="p-2">
                                <Icon name="filter" class="w-6 h-6" />
                            </div>
                        </template>
                        <template #dropdown>
                            <div class="flex flex-col p-4 gap-4 w-60">
                                <CollapsedForm :games="games" v-model:form="publicRoomQuery" />
                            </div>
                        </template>
                    </BaseDropdown>
                </div>
                <p>Current query -></p>
            </div>
            <div>room cards</div>
            <div>pagination</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, toRaw, watch } from "vue";
import { watchThrottled } from "@vueuse/core";

import { getGames, getPublicRooms } from "@/api";
import { useAsyncLocalState } from "@composable";
import { RoomListBody } from "@/api/types";
import BaseDropdown from "@widget/dropdown/BaseDropdown.vue";
import BaseSearchInput from "@widget/form/searchInput/BaseSearchInput.vue";
import CollapsedForm from "./components/CollapsedForm.vue";

type PublicRoomQuery = Required<RoomListBody>;

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

const games = ref([]);

const publicRoomQuery: PublicRoomQuery = reactive({
    game_id: null,
    status: null, // RoomStatus.processing | RoomStatus.waiting | RoomStatus.complete,
    get_mine_rooms: false,
    is_full: null,
    has_password: null,
    per_page: 8,
    page: 1,
    keyword: null,
});

async function handleGetGames() {
    const { data, error } = await getGames();
    console.log("games", data, error);
    if (error !== null) {
        return [];
    }
    games.value = data;
    // use this for now until we have multiple games
    publicRoomQuery.game_id = data[0].game_id;
    return data;
}

// 調整要送出去的 query
function formatPublicRoomQuery(): PublicRoomQuery {
    const rawPublicRoomQuery: PublicRoomQuery = toRaw(publicRoomQuery);
    return Object.keys(rawPublicRoomQuery).reduce((acc: any, key) => {
        const queryKey = key as keyof PublicRoomQuery;
        let queryValue = rawPublicRoomQuery[queryKey];
        if (queryKey === "game_id") {
            // game_id 只接受 number
            queryValue = queryValue !== null ? Number(queryValue) : null;
        } else {
            // 空字串改成 null
            queryValue = queryValue === "" ? null : queryValue;
        }
        return {
            ...acc,
            [key]: queryValue,
        };
    }, {});
}

async function handleGetPublicRooms() {
    const { data, error } = await getPublicRooms(formatPublicRoomQuery());
    console.log("rooms", data, error);
    if (error !== null) {
        return [];
    }
    return data;
}

onMounted(async () => {
    handleGetGames();
    executePublicRoomListState();
});

watchThrottled(
    publicRoomQuery,
    () => {
        executePublicRoomListState();
    },
    {
        throttle: 1000,
        immediate: false,
    }
);
</script>

