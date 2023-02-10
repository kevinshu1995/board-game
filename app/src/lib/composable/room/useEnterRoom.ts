import { validate as uuidValidate } from "uuid";
import { useStepper } from "@vueuse/core";

import { getRoomAccess, registerNewPlayer } from "@/api";
import { RoomAccessResponse, RegisterNewPlayerParams } from "@/api/types";

// types
enum ErrorCode {
    uuidEmpty,
    invalidUuid,
    roomNotFound,
    serverError,
    passwordEmpty,
    passwordWrong,
    roomIsNotWaiting,
    roomIsFull,
}

interface Status extends Record<string, any> {
    state: boolean | null;
    successText: string;
    errorText: string;
    infoText: string;
    errorCode: ErrorCode | null;
}

type FormStepName = "uuid" | "password";
type FormSteps = {
    [key in FormStepName]: {
        name: FormStepName;
        formId: string;
        status: Status;
        placeholder: string;
    };
};

enum UserAccessibleOfRoom {
    HasRegisteredUser = 0,
    NeedRegisterWithPW = 1,
    NeedRegisterWithoutPW = 2,
}

const defaultStatuses: { [k: string]: Status } = {
    uuid: {
        state: null,
        errorCode: null,
        successText: "",
        errorText: "",
        infoText: "",
    },
    password: {
        state: null,
        errorCode: null,
        successText: "",
        errorText: "",
        infoText: "此房間需要密碼才能進入",
    },
};

export function useEnterRoom() {
    const router = useRouter();

    const UuidMethods = uuidMethods();
    const PwMethods = pwMethods();

    const roomAccessInfo = ref<RoomAccessResponse | null>(null);
    const form = reactive<{
        uuid: string;
        password: string;
    }>({
        uuid: "",
        password: "",
    });

    const formSteps = ref<FormSteps>({
        uuid: {
            name: "uuid",
            formId: "room-uuid-input",
            status: { ...defaultStatuses.uuid },
            placeholder: "請填寫房間識別碼",
        },
        password: {
            name: "password",
            formId: "room-password-input",
            status: { ...defaultStatuses.password },
            placeholder: "請填寫房間密碼",
        },
    });

    const {
        current: currentStep,
        goToNext: stepGoToNext,
        isCurrent: stepIsCurrent,
        goBackTo: stepGoBackTo,
    } = useStepper(formSteps);

    async function onSubmit() {
        if (stepIsCurrent("uuid")) {
            const isSuccess = await submitUuid();
            return isSuccess;
        }

        if (stepIsCurrent("password")) {
            const isSuccess = await submitPassword();
            return isSuccess;
        }

        return null;
    }

    async function submitUuid() {
        resetStatus("uuid");
        // 檢查格式 (基本檢查)
        const isPassedBasicValidation = UuidMethods.uuidBasicCheck();
        if (isPassedBasicValidation) {
            const isAbleToEnterRoom = await UuidMethods.getRoomAccessibleStateWithUuid();
            if (isAbleToEnterRoom === UserAccessibleOfRoom.NeedRegisterWithPW) {
                // 進入密碼階段
                stepGoToNext();
                return false;
            }
            if (isAbleToEnterRoom === UserAccessibleOfRoom.HasRegisteredUser) {
                // this user has registered
                routerPushToRoom(form.uuid);
                return true;
            }
            if (isAbleToEnterRoom === UserAccessibleOfRoom.NeedRegisterWithoutPW) {
                // 進入房間
                const isSuccess = await tryEnteringRoom({ password: null });
                if (isSuccess === true) {
                    return true;
                }
            }
        }

        errorFeedback();
        return false;
    }

    async function submitPassword() {
        resetStatus("password");
        // 檢查格式 (基本檢查)
        if (PwMethods.pwBasicCheck()) {
            const isSuccess = await tryEnteringRoom({ password: form.password });
            if (isSuccess === true) {
                return true;
            }
        }

        errorFeedback();
        return false;
    }

    async function handleRegisterPlayer({ password }: RegisterNewPlayerParams): Promise<boolean> {
        const status = formSteps.value[currentStep.value.name].status; // alias
        if (roomAccessInfo.value === null) {
            // display default error
            stepGoBackTo("uuid");
            return false;
        }
        const { data, error } = await registerNewPlayer(roomAccessInfo.value.room_id, { password });

        if (error) {
            if (error?.status) {
                if (error.status === 409) {
                    // 已經註冊過，送進去
                    return true;
                }

                if (error.status === 403) {
                    status.errorCode = ErrorCode.passwordWrong;
                    return false;
                }

                if (error.status === 404) {
                    status.errorCode = ErrorCode.roomNotFound;
                }

                if (error.status === 422) {
                    status.errorCode = ErrorCode.roomIsNotWaiting;
                }

                if (error.status === 423) {
                    status.errorCode = ErrorCode.roomIsFull;
                }
            }

            // display default Error code
            stepGoBackTo("uuid");
            return false;
        }

        return true;
    }

    // uuid
    function uuidMethods() {
        function uuidBasicCheck(): boolean {
            const uuidStatus = formSteps.value.uuid.status; // alias
            if (form.uuid === "") {
                uuidStatus.errorCode = ErrorCode.uuidEmpty;
                return false;
            }

            const isPassUuidValidation = uuidValidate(form.uuid);
            if (isPassUuidValidation === false) {
                uuidStatus.errorCode = ErrorCode.invalidUuid;
            }
            return isPassUuidValidation;
        }

        // fetch the room access info(roomAccessInfo) by passing room uuid
        async function handleGetRoomAccess(uuid: string): Promise<null | RoomAccessResponse> {
            const uuidStatus = formSteps.value.uuid.status; // alias

            const { data, error } = await getRoomAccess(uuid);

            if (error) {
                if (error.status === 404) {
                    uuidStatus.errorCode = ErrorCode.roomNotFound;
                } else {
                    uuidStatus.errorCode = ErrorCode.serverError;
                }

                return null;
            }

            roomAccessInfo.value = data;
            return data;
        }

        // return boolean, determine the fetched room (roomAccessInfo) is able to access directly or not
        function isRoomAvailable(): UserAccessibleOfRoom | null {
            const data = roomAccessInfo.value;
            if (data === null) {
                return null;
            }
            // 如果這個使用者本來就登記在這個房間的話則直接進入
            if (data.user_registered) return UserAccessibleOfRoom.HasRegisteredUser;

            return data.needPassword
                ? UserAccessibleOfRoom.NeedRegisterWithPW
                : UserAccessibleOfRoom.NeedRegisterWithoutPW;
        }

        // null -> 有錯誤，不能進入
        async function getRoomAccessibleStateWithUuid(): Promise<UserAccessibleOfRoom | null> {
            // 檢查密碼
            await handleGetRoomAccess(form.uuid);
            return isRoomAvailable();
        }

        return { uuidBasicCheck, getRoomAccessibleStateWithUuid };
    }

    // password
    function pwMethods() {
        function pwBasicCheck(): boolean {
            if (form.password.length <= 0) {
                return false;
            }
            return true;
        }

        return { pwBasicCheck };
    }

    function errorFeedback() {
        const status = formSteps.value[currentStep.value.name].status; // alias
        status.state = false;

        switch (status.errorCode) {
            case ErrorCode.uuidEmpty:
                status.errorText = "房號不可為空";
                break;
            case ErrorCode.passwordEmpty:
                status.errorText = "密碼不可為空";
                break;
            case ErrorCode.passwordWrong:
                status.errorText = "密碼錯誤，請確認是否輸入正確密碼";
                break;
            case ErrorCode.roomIsNotWaiting:
                status.errorText = "遊戲已經開始，無法加入成為玩家";
                break;
            case ErrorCode.roomIsFull:
                status.errorText = "房間人數已滿";
                break;
            case ErrorCode.roomNotFound:
                status.errorText = "找不到該房間，請檢查房號是否正確";
                break;
            case ErrorCode.invalidUuid:
                status.errorText = "房號格式錯誤，請檢查房號是否正確";
                break;
            case ErrorCode.serverError:
                status.errorText = "伺服器發生未知的錯誤，請重新整理或聯絡工程師";
                break;
            default:
                status.errorText = "發生未知的錯誤，請重新整理或聯絡工程師";
                break;
        }
    }

    function resetStatus(targetStep: keyof typeof formSteps.value) {
        Object.keys(defaultStatuses[targetStep]).forEach(key => {
            formSteps.value[targetStep].status[key] = defaultStatuses[targetStep][key];
        });
    }

    async function tryEnteringRoom({ password }: RegisterNewPlayerParams) {
        // register
        const isRegisterSuccess = await handleRegisterPlayer({ password });
        if (isRegisterSuccess === false) {
            // reset password text field
            form.password = "";
            return false;
        }

        const roomUuid = form.uuid;
        // TODO toast
        routerPushToRoom(roomUuid);

        return true;
    }

    function routerPushToRoom(roomUuid: string) {
        resetEveryThing();
        router.push({
            name: "WaitingRoom",
            params: {
                room_id: roomUuid,
            },
        });
    }

    function resetEveryThing() {
        Object.keys(formSteps.value).forEach(key => {
            resetStatus(key as FormStepName);
        });
        form.uuid = "";
        form.password = "";
    }

    return {
        currentStep,
        form,
        onSubmit,
        resetEveryThing,
    };
}

