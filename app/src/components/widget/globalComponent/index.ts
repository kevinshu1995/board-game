import type { Component } from "vue";
import Icon from "./Icon.vue";

type GlobalComponents = {
    [key: string]: Component;
};

export default <GlobalComponents>{
    Icon,
};

