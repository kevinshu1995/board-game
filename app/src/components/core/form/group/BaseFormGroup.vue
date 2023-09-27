<template>
    <div class="space-y-2">
        <label :for="props.name" v-if="props.labelText" :class="[labelClasses[statusClassKey]]">
            {{ props.labelText }}
        </label>
        <div>
            <slot />
        </div>
        <p v-if="infoText" :class="['text-sm', feedbackTextClasses[statusClassKey]]">
            {{ infoText }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { feedbackText as feedbackTextClasses, label as labelClasses } from "./../statusClasses";

const props = withDefaults(
    defineProps<{
        status?: boolean | null;
        name: string;
        labelText?: string;
        successText?: string;
        errorText?: string;
        normalText?: string;
    }>(),
    {
        status: null,
    }
);

const infoText = computed(() => {
    if (props.status === true) return props.successText;
    if (props.status === false) return props.errorText;
    return props.normalText;
});

const statusClassKey = computed(() => {
    if (props.status === true) return "success";
    if (props.status === false) return "error";
    return "normal";
});
</script>

