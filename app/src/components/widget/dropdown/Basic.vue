<template>
    <div class="relative">
        <button
            type="button"
            class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            ref="dropdownTriggerEl"
        >
            <slot name="trigger" />
        </button>
        <div
            class="z-50 hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-xl dark:bg-gray-700 dark:divide-gray-600"
            ref="dropdownTargetEl"
        >
            <slot name="dropdown" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Flowbite from "@flowbite";

type DropdownOption = {
    placement?:
        | "left"
        | "right"
        | "top"
        | "bottom"
        | "left-start"
        | "right-start"
        | "top-start"
        | "bottom-start"
        | "left-end"
        | "right-end"
        | "top-end"
        | "bottom-end";
    onHide?: () => void;
    onShow?: () => void;
};

const props = defineProps<DropdownOption>();
const emits = defineEmits(["dropdown"]);

const dropdownTargetEl = ref(null);
const dropdownTriggerEl = ref(null);
const dropdownOptions: DropdownOption = Object.entries(props).reduce((acc, [key, value]) => {
    if (!value) return acc;
    return {
        [key]: value,
        ...acc,
    };
}, {});

const dropdownInstance = ref(null);

onMounted(() => {
    if (dropdownTriggerEl.value && dropdownTargetEl.value) {
        dropdownInstance.value = new Flowbite.Dropdown(
            dropdownTargetEl.value,
            dropdownTriggerEl.value,
            dropdownOptions
        );
        emits("dropdown", dropdownInstance.value);
    }
});
</script>

