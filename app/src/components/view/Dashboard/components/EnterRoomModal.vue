<template>
    <ConfirmModal @modal="catchModal" size="max-w-lg" @click-ok="submit" close-btn-gap="m-3">
        <template #headerText>
            <p class="text-center">Enter Room Id</p>
        </template>
        <template #body>
            <div class="p-5">
                <BaseFormGroup
                    :name="formId"
                    :success-text="status.successText"
                    :error-text="status.errorText"
                    :info-text="status.infoText"
                    :status="status.state"
                >
                    <BaseInput
                        class="text-center"
                        v-model:value="form.uuid"
                        :id="formId"
                        :status="status.state"
                        placeholder="請填寫房間識別碼"
                    />
                </BaseFormGroup>
            </div>
        </template>
    </ConfirmModal>
</template>

<script lang="ts">
// types
enum ErrorCode {
    empty,
    invalidUuid,
}

interface Status extends Record<string, any> {
    state: boolean | null;
    successText: string;
    errorText: string;
    infoText: string;
    errorCode: ErrorCode | null;
}
</script>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { validate as uuidValidate } from "uuid";
import ConfirmModal from "@widget/modal/ConfirmModal.vue";
import { ModalInstance } from "@widget/modal/types";
import { BaseFormGroup, BaseInput } from "@widget/form";

const router = useRouter();

const formId = "room-uuid-input";
const modal = ref<ModalInstance | null>(null);
const form = reactive({
    uuid: "",
});

const defaultStatus: Status = {
    state: null,
    errorCode: null,
    successText: "",
    errorText: "",
    infoText: "",
};

const status: Status = reactive(defaultStatus);

function submit() {
    resetStatus();
    // 檢查格式 (基本檢查)
    const isPassed = formCheck();
    if (isPassed) {
        successFeedback();
        return;
    }

    errorFeedback();
}

function formCheck(): boolean {
    status.state = null;
    if (form.uuid === "") {
        status.errorCode = ErrorCode.empty;
        return false;
    }

    const isPassUuidValidation = uuidValidate(form.uuid);
    if (isPassUuidValidation === false) {
        status.errorCode = ErrorCode.invalidUuid;
    }
    return isPassUuidValidation;
}

function resetStatus() {
    Object.keys(defaultStatus).forEach(
        key => (status[key as keyof typeof status] = defaultStatus[key])
    );
}

function successFeedback() {
    status.state = true;
    modal.value?.hide();
    router.push({
        name: "WaitingRoom",
        params: {
            room_id: form.uuid,
        },
    });
}

function errorFeedback() {
    status.state = false;

    switch (status.errorCode) {
        case ErrorCode.empty:
            status.errorText = "房號不可為空";
            break;
        case ErrorCode.invalidUuid:
            status.errorText = "房號格式錯誤，請重新檢查房號是否正確";
            break;
        default:
            status.errorText = "發生未知的錯誤，請重新整理或聯絡工程師";
            break;
    }
}

function catchModal(modalInstance: ModalInstance) {
    modal.value = modalInstance;
    modal.value.show();
}
</script>

