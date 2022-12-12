<template>
    <BasicNavbar :link="navLinks">
        <template #logo>
            <RouterLink to="/" class="flex items-center">
                <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    class="h-6 mr-3 sm:h-9"
                    alt="Flowbite Logo"
                />
                <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                    Flowbite
                </span>
            </RouterLink>
        </template>
        <template #right>
            <DarkModeBtn />
            <BasicDropdown custom-style="round">
                <template #trigger>
                    <span class="sr-only">Open user menu</span>
                    <img
                        class="w-8 h-8 rounded-full"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        alt="user photo"
                    />
                </template>
                <template #dropdown>
                    <div class="px-4 py-3">
                        <span class="block text-sm text-gray-900 dark:text-white"
                            >Bonnie Green</span
                        >
                        <span
                            class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
                            >name@flowbite.com</span
                        >
                    </div>
                    <ul class="py-1" aria-labelledby="user-menu-button">
                        <li>
                            <a
                                href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >Dashboard</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >Settings</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >Earnings</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >Sign out</a
                            >
                        </li>
                    </ul>
                </template>
            </BasicDropdown>
        </template>
    </BasicNavbar>
</template>

<script setup lang="ts">
import BasicDropdown from "@widget/dropdown/Basic.vue";
import BasicNavbar from "@widget/navbar/Basic.vue";
import DarkModeBtn from "@widget/button/DarkModeBtn.vue";

const navLinks = [
    {
        to: "/",
        text: "Home",
    },
    {
        to: "/api-list",
        text: "API",
    },
];
</script>

