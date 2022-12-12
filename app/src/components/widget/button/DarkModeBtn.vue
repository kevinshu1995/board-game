<template>
    <Button
        theme="transparent"
        shape="rounded"
        class="focus:!ring-transparent"
        @click="toggleDark()"
    >
        <Icon name="moon" class="h-4 w-4" />
    </Button>
</template>

<script setup lang="ts">
import Button from "./Button.vue";
import { useDark } from "@/store";

const { toggleDark } = useDark();
</script>

