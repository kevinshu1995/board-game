import { defineStore } from "pinia";
import { useDark as vueUseDark, useToggle } from "@vueuse/core";

export const useDark = defineStore("useAuth", () => {
    const isDark = vueUseDark();
    const toggleDark = useToggle(isDark);

    return {
        isDark,
        toggleDark,
    };
});

