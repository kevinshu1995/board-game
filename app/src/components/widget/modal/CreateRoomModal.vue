<template>
    <ConfirmModal
        @modal="catchModal"
        size="max-w-lg"
        @click-ok="onModalClickOk"
        close-btn-gap="m-3"
        toggle-btn-text="建立房間"
        is-need-toggle-btn
        @hide="onModalHide"
    >
        <template #headerText>
            <p class="text-center">Create A New Room</p>
        </template>
        <template #body>
            <div class="p-5 text-center">
                <!-- <BaseFormGroup
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
                </BaseFormGroup> -->
            </div>
        </template>
    </ConfirmModal>
</template>

<script setup lang="ts">
import ConfirmModal from "@core/modal/ConfirmModal.vue";
import { ModalInstance } from "@core/modal/types";
import { useStepsCreateRoom } from "@/lib/composable/room/useCreateRoom";
import { BaseFormGroup, BaseInput } from "@core/form";

const modal = ref<ModalInstance | null>(null);
const {} = useStepsCreateRoom();

function onModalHide() {
    console.log("hide");
}

function onModalClickOk() {
    console.log("hide");
}

onBeforeRouteLeave(() => {
    modal.value?.hide();
});

function catchModal(modalInstance: ModalInstance) {
    modal.value = modalInstance;
}
</script>

