<template>
    <div>
        <slot
            name="toggle-btn"
            :toggle="() => modalInstance?.toggle && modalInstance.toggle()"
            :show="() => modalInstance?.show && modalInstance.show()"
            :hide="() => modalInstance?.hide && modalInstance.hide()"
            :isHidden="() => modalInstance?.isHidden && modalInstance.isHidden()"
        >
            <BaseButton
                :theme="props.toggleBtnTheme"
                :shape="props.toggleBtnShape"
                v-if="props.isNeedToggleBtn"
                @click.prevent="() => modalInstance?.show && modalInstance.show()"
            >
                {{ props.toggleBtnText }}
            </BaseButton>
        </slot>

        <!-- Main modal -->
        <Teleport to="body">
            <div
                ref="modalEl"
                tabindex="-1"
                aria-hidden="true"
                class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full backdrop"
            >
                <div :class="[props.size, 'relative w-full']">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <slot
                            name="closeBtn"
                            :hide="() => modalInstance?.hide && modalInstance.hide()"
                        >
                            <button
                                v-if="props.isShowCloseBtn"
                                type="button"
                                @click="() => modalInstance?.hide && modalInstance.hide()"
                                :class="[
                                    closeBtnPlacementClass,
                                    closeBtnGapClass,
                                    'absolute top-0',
                                    'text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white',
                                ]"
                            >
                                <Icon name="x" class="w-5 h-5" />
                                <span class="sr-only">Close modal</span>
                            </button>
                        </slot>
                        <slot
                            name="body"
                            :toggle="() => modalInstance?.toggle && modalInstance.toggle()"
                            :show="() => modalInstance?.show && modalInstance.show()"
                            :hide="() => modalInstance?.hide && modalInstance.hide()"
                            :isHidden="() => modalInstance?.isHidden && modalInstance.isHidden()"
                        />
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Flowbite from "@flowbite";
import BaseButton from "@widget/button/BaseButton.vue";
import type { BaseModalTemplateProps, ModalInstance } from "./types";
import {
    BaseModalTemplateDefaultProps as pd,
    baseModalTemplatePropValidator,
    availableCloseBtnGapClass,
} from "./handleProps";

const props = withDefaults(defineProps<BaseModalTemplateProps>(), {
    // this is the only way for now
    size: pd.size,
    isClickBackdropClose: pd.isClickBackdropClose,
    isShowCloseBtn: pd.isShowCloseBtn,
    placement: pd.placement,
    isNeedToggleBtn: pd.isNeedToggleBtn,
    closeBtnPlacement: pd.closeBtnPlacement,
    closeBtnGap: pd.closeBtnGap,
    toggleBtnTheme: pd.toggleBtnTheme,
    toggleBtnShape: pd.toggleBtnShape,
    toggleBtnText: pd.toggleBtnText,
    onHide: pd.onHide,
    onShow: pd.onShow,
    onToggle: pd.onToggle,
});

const emit = defineEmits(["modal"]);

baseModalTemplatePropValidator(props);

// set the modal menu element
const modalEl = ref(null);
const modalInstance = ref<ModalInstance | null>(null);

// options with default values
const options = {
    placement: props.placement,
    backdrop: props.isClickBackdropClose === false ? "static" : "dynamic",
    backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
    onHide: () => {
        props.onHide();
    },
    onShow: () => {
        props.onShow();
    },
    onToggle: () => {
        props.onToggle();
    },
};

const closeBtnGapClass = computed(() => {
    return availableCloseBtnGapClass.find(item => {
        return item.slice(2) === props.closeBtnGap;
    });
});

const closeBtnPlacementClass = computed(() => {
    switch (props.closeBtnPlacement) {
        case "left":
            return "left-0";
        case "right":
        default:
            return "right-0";
    }
});

onMounted(() => {
    modalInstance.value = new Flowbite.Modal(modalEl.value, options);
    if (modalInstance.value !== null) {
        emit("modal", modalInstance.value);
    }
});
</script>

<style scoped>
.h-modal {
    @apply h-full;
}
</style>

