<template>
    <component :is="iconComponent" />
</template>

<script setup lang="ts">
const props = defineProps<{
    name: string;
}>();

// https://heroicons.dev/
const iconComponent = defineAsyncComponent(() => import(`../../../assets/icon/${props.name}.svg`));
</script>

