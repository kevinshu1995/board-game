import type { Component } from "vue";
import Icon from "./BaseIcon.vue";

type GlobalComponents = {
    [key: string]: Component;
};

export default <GlobalComponents>{
    Icon,
};

