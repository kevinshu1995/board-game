<template>
    <div class="relative">
        <button
            type="button"
            :class="[
                theme(),
                'focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 dark:text-white',
                'flex mr-3 text-sm md:mr-0',
                dropdownStyle.trigger,
            ]"
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
import { themeTypes, getTheme } from "@utils";
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

interface Props extends DropdownOption {
    customStyle?: "normal" | "round";
    theme?: themeTypes.theme;
}

const props = defineProps<Props>();
const emits = defineEmits(["dropdown"]);

const theme = () => {
    return getTheme(props.theme || "light");
};

const dropdownStyle = computed(() => {
    const getTriggerStyle = () => {
        switch (props.customStyle) {
            case "round":
                return ["rounded-full"];
            case "normal":
            default:
                return [];
        }
    };
    return {
        trigger: [...getTriggerStyle()],
    };
});

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

