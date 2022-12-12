import { defineStore } from "pinia";
import { useDark as vueUseDark, useToggle } from "@vueuse/core";

export const useDark = defineStore("useDark", () => {
    const isDark = vueUseDark();
    const toggleDark = useToggle(isDark);

    return {
        isDark,
        toggleDark,
    };
});

