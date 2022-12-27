<template>
    <button type="button" :class="buttonClass">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BaseButtonProps } from "./types";
import { getTheme } from "@utils";

const props = withDefaults(defineProps<BaseButtonProps>(), {
    theme: "primary",
    shape: "normal",
});

const buttonClass = computed(() => {
    const space = "text-sm px-5 py-2.5 mr-2";
    const base = "focus:outline-none focus:ring-4 font-medium rounded-lg";

    const shape = () => {
        switch (props.shape) {
            case "rounded":
                return "rounded-full !p-3";
            case "normal":
            default:
                return "";
        }
    };

    return [space, base, getTheme(props.theme), shape()];
});
</script>

