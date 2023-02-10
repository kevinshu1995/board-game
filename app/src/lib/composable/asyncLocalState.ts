import { useStorage, useAsyncState, UseAsyncStateReturn } from "@vueuse/core";
import type { Ref } from "vue";

type useAsyncLocalStateOptions<Data> = {
    storageKey: string;
    defaultValue: Data;
    apiPromise: Promise<Data> | ((...args: any[]) => Promise<Data>);
};

type useAsyncLocalStateReturn<Data> = {
    state: Ref<Data>;
    isReady: Ref<boolean>;
    isLoading: Ref<boolean>;
    error: Ref<unknown>;
    execute: (delay?: number, ...args: any[]) => Promise<Data>;
};

export function useAsyncLocalState<Data extends null>({
    storageKey,
    defaultValue,
    apiPromise,
}: useAsyncLocalStateOptions<Data>): useAsyncLocalStateReturn<Data> {
    if (defaultValue === undefined) {
        throw new Error("[useAsyncLocalState] defaultValue is required");
    }

    const localState = useStorage(storageKey, { data: defaultValue }, localStorage);

    const { state, isReady, isLoading, error, execute } = useAsyncState(
        apiPromise,
        localState.value.data || defaultValue,
        {
            immediate: false,
        }
    );

    watch(isReady, () => {
        if (isReady.value === true) {
            localState.value = { data: state.value } || {};
        }
    });

    return {
        state,
        isReady,
        isLoading,
        error,
        execute,
    };
}

