<template>
    <div class="flex items-center gap-4">
        <input
            :id="id"
            type="checkbox"
            :value="props.modelValue"
            v-model="checkboxValue"
            :true-value="props.trueValue || true"
            :false-value="props.falseValue || false"
            class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label :for="id" class="text-sm font-medium text-gray-900 dark:text-gray-300">
            {{ props.label }}
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { generateUuid } from "@utils";

const id = ref(generateUuid("checkbox-"));

const props = defineProps<{
    label: string;
    modelValue: any;
    trueValue?: any;
    falseValue?: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const checkboxValue = computed({
    get() {
        return props.modelValue;
    },
    set(val: any) {
        emit("update:modelValue", val);
    },
});
</script>

