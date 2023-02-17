import { describe, it, expect, vi } from "vitest";
import { createApp } from "vue";
import { createTestingPinia } from "@pinia/testing";
import { setActivePinia, defineStore } from "pinia";

import { useEnterRoom } from "@composable/room/useEnterRoom";

const useAuth = defineStore("useAuth", {
    state: () => ({
        session: {
            access_token: "TOKEN!",
        },
    }),
});

function mockLoadComposableInApp(composable: Function = () => {}): [any, any] {
    let result;
    const app = createApp({
        setup() {
            result = composable();
            useAuth();
            return () => {};
        },
    });

    const pinia = createTestingPinia();
    app.use(pinia);
    setActivePinia(pinia);

    app.mount(document.createElement("div"));

    return [result, app];
}

// TODO create mock api response

describe("useEnterRoom", () => {
    // TODO 輸入錯誤房間 - 空值 -> 顯示錯誤訊息
    describe("type empty string as room id", () => {
        it("currentStep state should be false.", async () => {
            const [{ form, onSubmit, currentStep }] = mockLoadComposableInApp(useEnterRoom);
            form.uuid = "11111111-1111-1111-1111-111111111111";

            await onSubmit();
            console.log("currentStep.value.status", currentStep.value.status);
            console.log("currentStep.value.status", currentStep.value);

            expect(currentStep.value.status.state).toBe(false);
        });

        // it("should not request anything.", async () => {
        //     const { form, onSubmit, currentStep } = useEnterRoom();
        //     form.password = "";

        //     await onSubmit();

        //     expect(currentStep.value.status.state).toBe(false);
        // });
        // it("test mock api.", async () => {
        //     const [_, app] = mockLoadComposableInApp(() => {})
        //     app?.onMounted(() => {

        //     })
        //     const res = await getPublicRooms({});
        //     // const res = await fetch("http://localhost:5173/functions/room").then(res => res.json());
        //     console.log(res);

        //     expect(1).toBe(1);
        // });
    });
    // TODO 輸入錯誤房間 - 隨意字串 -> 顯示錯誤訊息

    // TODO 輸入正確格式 - 如果 getRoomAccess api 404 -> 不進入下一步，並顯示錯誤訊息

    // TODO 輸入正確房間 - 如果 getRoomAccess api 200 使用者已經註冊該房間 -> router push
    // TODO 輸入正確房間 - 如果 getRoomAccess api 200 但是房間已滿 -> 不進入下一步，並顯示錯誤訊息

    // TODO 輸入正確房間 - 如果 getRoomAccess api 200、房間未滿、不需密碼，打註冊 registerNewPlayer api -> 回傳 409 -> router push
    // TODO 輸入正確房間 - 如果 getRoomAccess api 200、房間未滿、不需密碼，打註冊 registerNewPlayer api -> 回傳不為 200 -> 回到 uuid 階段，並顯示錯誤訊息
    // TODO 輸入正確房間 - 如果 getRoomAccess api 200、房間未滿、不需密碼，打註冊 registerNewPlayer api -> 回傳 200 -> router push

    // TODO 輸入正確房間 - 如果 getRoomAccess api 200 房間未滿，需要密碼 -> 進入下一步 ->

    // 輸入密碼階段 (需要先在 roomAccessInfo 設定好可註冊的權限)
    // TODO 輸入錯誤密碼 - 空值 -> 顯示錯誤訊息

    // TODO 輸入正確格式密碼 - -> 打註冊 registerNewPlayer api -> 回傳不為 200 -> 回到 uuid 階段，並顯示錯誤訊息
    // TODO 輸入正確格式密碼 - -> 打註冊 registerNewPlayer api -> 回傳 200 -> router push
    it("try", () => {
        const { form } = useEnterRoom();
        expect(1).toBe(1);
    });
});

