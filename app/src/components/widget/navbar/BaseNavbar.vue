<template>
    <nav
        class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-600 relative"
    >
        <div class="container flex flex-wrap items-center justify-between mx-auto">
            <slot name="logo" />
            <div class="flex items-center md:order-2">
                <slot name="right" />
                <!-- trigger -->
                <button
                    type="button"
                    class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    ref="triggerCollapseNav"
                >
                    <span class="sr-only">Open main menu</span>
                    <Icon name="menu" class="w-6 h-6" />
                </button>
            </div>
            <!-- target links -->
            <div
                :class="[
                    'px-4 items-center justify-between hidden w-full md:flex md:w-auto md:order-1',
                    'absolute md:!relative left-0 bottom-0 translate-y-full md:translate-y-0',
                ]"
                ref="targetCollapseNav"
            >
                <ul
                    v-if="props.link"
                    class="flex flex-col p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
                >
                    <li v-for="link in props.link">
                        <template v-if="link.to">
                            <RouterLink
                                :to="link.to"
                                v-slot="{ isActive, navigate }"
                                active-class=""
                            >
                                <span
                                    @click="
                                        () => {
                                            collapseNavbar();
                                            navigate();
                                        }
                                    "
                                    :class="[
                                        'block py-2 pl-3 pr-4 rounded md:p-0',
                                        isActive
                                            ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white'
                                            : 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700',
                                    ]"
                                >
                                    {{ link.text }}
                                </span>
                            </RouterLink>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useLink } from "vue-router";
import FlowBite from "@flowbite";
import { onClickOutside } from "@vueuse/core";
import { CollapseMethods, CollapseOptions } from "./types";

type Link = {
    to: string | null;
    text: string;
};

interface Props extends CollapseOptions {
    link: Link[];
}

const props = defineProps<Props>();
const emit = defineEmits(["navbarInstance"]);

// template refs
const targetCollapseNav = ref(null);
const triggerCollapseNav = ref(null);

// collapsing navbar settings
const collapseNav = reactive<{
    options: CollapseOptions | null;
    instance: CollapseMethods | null;
}>({
    options: null,
    instance: null,
});

function collapseNavbar() {
    if (collapseNav.instance) {
        collapseNav.instance.collapse();
    }
}

onMounted(() => {
    if (triggerCollapseNav.value === null || targetCollapseNav.value === null) {
        console.error(
            "Navbar Basic: triggerCollapseNav.value === null || targetCollapseNav.value === null"
        );
        return;
    }

    onClickOutside(targetCollapseNav, collapseNavbar);

    // setup collapsing navbar options
    collapseNav.options = Object.entries({
        onCollapse: props.onCollapse,
        onExpand: props.onExpand,
        onToggle: props.onToggle,
    }).reduce(
        (acc, [key, value]) => {
            if (!value) return acc;
            return {
                [key]: value,
                ...acc,
            };
        },
        { triggerEl: triggerCollapseNav.value }
    );

    // setup js for collapsing navbar
    collapseNav.instance = new FlowBite.Collapse(targetCollapseNav.value, collapseNav.options);
    emit("navbarInstance", collapseNav.instance);
});
</script>

