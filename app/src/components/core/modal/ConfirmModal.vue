<template>
    <BaseModalTemplate v-bind="props" @modal="emit('modal', $event)">
        <template #body="{ hide }">
            <!-- Modal header -->
            <template v-if="props.isHideHeader === false">
                <slot name="header">
                    <div class="p-4">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            <slot name="headerText" />
                        </h3>
                    </div>
                </slot>
            </template>
            <!-- Modal body -->
            <div :class="[props.isUsingBodyClass && 'text-base leading-relaxed text-gray-500 dark:text-gray-400']">
                <slot name="body" :hide="hide" />
            </div>
            <!-- Modal footer -->
            <div v-if="props.isHideFooter === false" class="flex items-center justify-end p-4 space-x-2">
                <BaseButton :theme="props.cancelTheme" @click="handleClickCancel(hide)" v-if="isHideCancel === false">
                    <slot name="cancelBtnText"> Cancel </slot>
                </BaseButton>
                <BaseButton :theme="props.okTheme" @click="handleClickOk(hide)" v-if="isHideOk === false">
                    <slot name="confirmBtnText"> Ok </slot>
                </BaseButton>
            </div>
        </template>
    </BaseModalTemplate>
</template>

<script setup lang="ts">
import BaseButton from "@core/button/BaseButton.vue";
import BaseModalTemplate from "./BaseModalTemplate.vue";
import type { BaseModalTemplateProps } from "./types";
import type { BaseButtonTheme } from "@core/button/types";
import { BaseModalTemplateDefaultProps as pd, baseModalTemplatePropValidator } from "./handleProps";

interface confirmModalProp extends BaseModalTemplateProps {
    isHideHeader?: boolean;
    isUsingBodyClass?: boolean;
    isHideFooter?: boolean;
    isHideCancel?: boolean;
    isHideOk?: boolean;
    okTheme?: BaseButtonTheme;
    cancelTheme?: BaseButtonTheme;
    onClickOk?: () => void;
    onClickCancel?: () => void;
}

const props = withDefaults(defineProps<confirmModalProp>(), {
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
    //
    isHideHeader: false,
    isUsingBodyClass: true,
    isHideFooter: false,
    isHideCancel: false,
    isHideOk: false,
    okTheme: "primary",
    cancelTheme: "light-n-border",
});

const emit = defineEmits(["modal", "ok", "cancel"]);

function handleClickOk(hideFn: () => void) {
    if (props.onClickOk) {
        props.onClickOk();
        return;
    }
    hideFn();
    emit("ok");
}

function handleClickCancel(hideFn: () => void) {
    if (props.onClickCancel) {
        props.onClickCancel();
    }
    hideFn();
    emit("cancel");
}

baseModalTemplatePropValidator(props);
</script>

