<template>
    <component
        v-bind="extraBindOnRootElement"
        :is="props.tag"
        :class="[
            props.padding,
            'block bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700',
        ]"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
const props = defineProps({
    tag: {
        type: String,
        default: "div",
    },
    padding: {
        type: String,
        default: "p-6",
        validator(val: string) {
            return /-?p[x|y]?-./.test(val);
        },
    },
});

const extraBindOnRootElement = computed(() => {
    const attrs: { [attr: string]: any } = {};
    if (props.tag === "a") {
        attrs.href = "#";
    }
    return attrs;
});
</script>

