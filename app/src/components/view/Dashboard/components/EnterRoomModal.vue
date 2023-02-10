<template>
    <!-- TODO form submit (press Enter to submit) -->
    <ConfirmModal
        @modal="catchModal"
        size="max-w-lg"
        @click-ok="onSubmit"
        close-btn-gap="m-3"
        toggle-btn-text="輸入房間號碼"
        is-need-toggle-btn
        @hide="resetEveryThing"
    >
        <template #headerText>
            <p class="text-center">Enter Room Id</p>
        </template>
        <template #body>
            <div class="p-5 text-center">
                <BaseFormGroup
                    :name="currentStep.formId"
                    :success-text="currentStep.status.successText"
                    :error-text="currentStep.status.errorText"
                    :normal-text="currentStep.status.infoText"
                    :status="currentStep.status.state"
                >
                    <BaseInput
                        v-model:value="form[currentStep.name]"
                        :id="currentStep.formId"
                        :status="currentStep.status.state"
                        :placeholder="currentStep.placeholder"
                    />
                </BaseFormGroup>
                <!-- TODO 上一步 btn (only display at password phrase) -->
            </div>
        </template>
    </ConfirmModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

import ConfirmModal from "@widget/modal/ConfirmModal.vue";
import { ModalInstance } from "@widget/modal/types";
import { useEnterRoom } from "@/lib/composable/room/useEnterRoom";
import { BaseFormGroup, BaseInput } from "@widget/form";

const { currentStep, form, onSubmit, resetEveryThing } = useEnterRoom();

const modal = ref<ModalInstance | null>(null);

onBeforeRouteLeave(() => {
    modal.value?.hide();
});

function catchModal(modalInstance: ModalInstance) {
    modal.value = modalInstance;
}
</script>

