import { useStepper } from "@vueuse/core";
interface CreateNewRoomFormData {
    game_id: number;
    team_count: number;
    player_count_max: number;
    round_seconds?: number | null;
    room_name?: string;
    does_guest_can_chat?: boolean;
    password?: string | null;
    is_private?: boolean;
    is_optional_game_role?: boolean;
}

type FormGroupSteps = {
    roomBasicSettings: {
        name: string;
        formId: keyof CreateNewRoomFormData;
        status: Status;
        placeholder: string;
    }[];
};

// 錯誤代碼
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

const defaultStatuses: { [k: string]: Status } = {
    roomName: {
        state: null,
        errorCode: null,
        successText: "",
        errorText: "",
        infoText: "",
    },
    gameId: {
        state: null,
        errorCode: null,
        successText: "",
        errorText: "",
        infoText: "",
    },
};

export function useStepsCreateRoom() {
    const createRoomForm = {
        game_id: null, // int
        team_count: null, // int
        player_count_max: null, // int
        // options
        round_seconds: null, // int | null
        room_name: null, // string
        does_guest_can_chat: null, // bool
        password: null, // string & min length 4 | null
        is_private: null, // bool
        is_optional_game_role: null, // bool
    };

    const formSteps = ref<FormGroupSteps>({
        roomBasicSettings: [
            {
                name: "gameId",
                formId: "game_id",
                status: { ...defaultStatuses.roomName },
                placeholder: "請選擇遊戲",
            },
            {
                name: "roomName",
                formId: "room_name",
                status: { ...defaultStatuses.roomName },
                placeholder: "請填寫遊戲房間名稱",
            },
            {
                name: "teamCount",
                formId: "team_count",
                status: { ...defaultStatuses.roomName },
                placeholder: "請選擇隊伍數量",
            },
        ],
    });

    return {};
}

