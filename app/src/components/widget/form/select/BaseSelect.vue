<template>
    <label
        v-if="props.label"
        :for="id"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
        {{ props.label }}
    </label>
    <select
        :id="id"
        :value="props.modelValue"
        @input="emitValue"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
        <option
            v-for="option in props.options"
            :value="option.value"
            :disabled="option.disabled || false"
        >
            {{ option.text }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { generateUuid } from "@utils";

const id = ref(generateUuid("select-"));

type Option = {
    text: string;
    value: any;
    disabled?: boolean;
};

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
    label?: string;
    options: Option[];
    modelValue: any;
}>();

function emitValue(event: Event) {
    const target = event.target as HTMLSelectElement;
    emit("update:modelValue", target.value);
}
</script>

