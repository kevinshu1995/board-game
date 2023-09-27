<template>
    <input
        type="text"
        :id="props.id"
        @input="debouncedFn"
        :value="props.value"
        :class="[
            classes.base,
            classes.size[props.size],
            inputStatusStyle,
            props.disabled && classes.disabled,
        ]"
        :placeholder="props.placeholder"
        :autofocus="props.autofocus"
        :disabled="props.disabled"
    />
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { generateUuid } from "@utils";

const props = withDefaults(
    defineProps<{
        value: string;
        placeholder?: string;
        status?: boolean | null; // null means not success nor error
        debounce?: number | null; // null means not using debounce
        autofocus?: boolean;
        size?: "lg" | "md" | "sm";
        disabled?: boolean;
        id?: string;
    }>(),
    {
        value: "",
        placeholder: "",
        status: null,
        debounce: null,
        autofocus: false,
        size: "md",
        disabled: false,
        id: generateUuid("base-input-"),
    }
);

const emit = defineEmits(["update:value"]);

const emitInputValue = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit("update:value", target.value);
};

const debouncedFn = useDebounceFn(emitInputValue, props.debounce ?? 0);

const classes = {
    base: "border rounded-lg block w-full",
    status: {
        normal: "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        success:
            "bg-green-50 border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500  focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-green-500",
        error: "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500",
    },
    size: {
        lg: "p-4 sm:text-md",
        md: "p-2.5 text-sm",
        sm: "p-2 sm:text-xs",
    },

    disabled: "cursor-not-allowed",
};

const inputStatusStyle = computed(() => {
    if (props.status === true) return classes.status.success;
    if (props.status === false) return classes.status.error;
    return classes.status.normal;
});
</script>

