<template>
    <BaseButton
        theme="transparent"
        shape="rounded"
        class="focus:!ring-transparent"
        @click="toggleDark()"
    >
        <Icon name="moon" class="h-4 w-4" />
    </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import { useDark } from "@/store";

const { toggleDark } = useDark();
</script>

