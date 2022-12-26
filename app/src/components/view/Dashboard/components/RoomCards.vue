<template>
    <ul :class="[props.rooms.length > 0 && 'grid grid-cols-2 gap-4']">
        <template v-if="props.rooms.length > 0">
            <li v-for="room in props.rooms" :key="room.id">
                <BaseCard
                    tag="routerLink"
                    padding="p-2"
                    :to="{ name: 'WaitingRoom', params: { room_id: room.uuid } }"
                >
                    <div>
                        <p>Game Name: {{ getGameDetail(room.game_id)?.name_zh_tw }}</p>
                        <p>Room Full: {{ room.is_full }}</p>
                        <p>Room Name: {{ room.room_name }}</p>
                        <p>
                            Player: {{ room.room_players.length }} /
                            {{ room.room_player_count_limit }}
                        </p>
                        <p>Room Status: {{ room.status }}</p>
                    </div>
                </BaseCard>
            </li>
        </template>

        <!-- TODO loading state -->
        <li v-else>沒有資料</li>
    </ul>
</template>

<script setup lang="ts">
import { GameResponse } from "@/api/types";
import BaseCard from "@widget/card/BaseCard.vue";

const props = defineProps<{
    // TODO room type
    rooms: { [k: string]: any }[];
    games: GameResponse[];
    isLoading: boolean;
    isReady: boolean;
}>();

function getGameDetail(game_id: number): GameResponse | null {
    return props.games.find((game: GameResponse) => game.game_id === game_id) ?? null;
}
</script>

