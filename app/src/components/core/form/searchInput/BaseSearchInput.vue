<template>
    <div>
        <label :for="id" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            {{ props.label || "Search" }}
        </label>
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon name="search" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
                type="search"
                :id="id"
                v-model="searchValue"
                class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :placeholder="props.placeholder || ''"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { generateUuid } from "@utils";
import { useDebounceFn } from "@vueuse/core";

const id = generateUuid("search-input-");

const props = defineProps<{
    label?: string;
    placeholder?: string;
    debounce?: number;
    valueModel: string | null;
}>();

const debouncedEmit = useDebounceFn((val: string | null) => {
    emit("update:valueModel", !val ? null : val);
}, props.debounce ?? 0);

const emit = defineEmits(["update:valueModel"]);

const searchValue = computed({
    get() {
        return props.valueModel;
    },
    set(val: string | null) {
        debouncedEmit(val);
    },
});
</script>

