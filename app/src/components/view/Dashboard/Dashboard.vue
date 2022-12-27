<template>
    <div class="w-full">
        <!-- <div class="text-xl">dashboard</div>
        <div>state: {{ !!publicRoomListState }}</div>
        <div>isReady: {{ isReadyPublicRoomList }}</div>
        <div>isLoading: {{ isLoadingPublicRoomList }}</div> -->

        <div>
            <div>
                <!-- TODO open modal (button) -->
                輸入房間號碼
            </div>
            <div>
                <!-- TODO open modal (button) -->
                建立新遊戲
            </div>
        </div>

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
            </div>
            <div>
                <RoomCards
                    :rooms="publicRoomListState.rooms ?? []"
                    :games="games"
                    :isLoading="isLoadingPublicRoomList"
                    :isReady="isReadyPublicRoomList"
                />
            </div>

            <BasePagination
                :total="publicRoomListState?.meta?.total ?? 0"
                :page="publicRoomQuery?.page"
                :page-size="publicRoomQuery.per_page ?? 0"
                :on-page-change="onPaginationPageChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, toRaw } from "vue";
import type { Ref } from "vue";
import { watchThrottled } from "@vueuse/core";

import { getGames, getPublicRooms } from "@/api";
import { useAsyncLocalState } from "@composable";
import { RoomListBody, GameResponse } from "@/api/types";
import BaseDropdown from "@widget/dropdown/BaseDropdown.vue";
import BaseSearchInput from "@widget/form/searchInput/BaseSearchInput.vue";
import BasePagination from "@widget/pagination/BasePagination.vue";
import { CollapsedForm, RoomCards } from "./components";

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

const games: Ref<GameResponse[]> = ref([]);

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

function onPaginationPageChange(page: number) {
    publicRoomQuery.page = page;
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

