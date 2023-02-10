<template>
    <BaseSelect label="遊戲" :options="gamesOption" v-model:modelValue="formObj.game_id" />
    <BaseSelect label="房間狀態" :options="roomStatusOptions" v-model:modelValue="formObj.status" />
    <BaseSelect label="密碼" :options="passwordOptions" v-model:modelValue="formObj.has_password" />
    <BaseSelect label="房間人數" :options="isFullOptions" v-model:modelValue="formObj.is_full" />
</template>

<script setup lang="ts">
import { RoomListBody, RoomStatus, RoomStatusZhTw } from "@/api/types";
import { convertEnum } from "@utils";

import BaseSelect from "@widget/form/select/BaseSelect.vue";

const props = defineProps<{
    form: Pick<RoomListBody, "game_id" | "status" | "has_password" | "is_full">;
    games: object[];
}>();

const emit = defineEmits(["update:form"]);

const formObj = computed({
    get() {
        return props.form;
    },
    set(val) {
        emit("update:form", val);
    },
});

// room status
const formatRoomStatus = (obj: { key: string; value: any }[]) =>
    obj.filter(({ key }) => key !== "None");
const roomStatusZhTw = formatRoomStatus(convertEnum(RoomStatusZhTw));
const roomStatusOptions = formatRoomStatus(convertEnum(RoomStatus))
    .map(item => {
        return {
            value: item.value,
            text: roomStatusZhTw.find(zhTwItem => zhTwItem.key === item.key)?.value || "",
        };
    })
    .concat([
        {
            value: "",
            text: "全部",
        },
    ]);

// game
const gamesOption = computed(() => {
    return props.games.map((item: any) => ({
        text: item.name_zh_tw,
        value: item.game_id,
    }));
    // not needed for now
    // .concat([
    //     {
    //         text: "全部",
    //         value: "",
    //     },
    // ]);
});

// has_password
const passwordOptions = [
    {
        text: "不需密碼",
        value: false,
    },
    {
        text: "需要密碼",
        value: true,
    },
    {
        text: "全部",
        value: "",
    },
];

// is_full
const isFullOptions = [
    {
        text: "人數已滿",
        value: true,
    },
    {
        text: "人數未滿",
        value: false,
    },
    {
        text: "全部",
        value: "",
    },
];
</script>

