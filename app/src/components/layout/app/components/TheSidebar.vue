<template>
    <aside class="w-24 flex flex-col justify-center" aria-label="Sidebar">
        <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
            <ul class="space-y-4">
                <li v-for="link in sideBarLinks">
                    <RouterLink
                        :to="link.to"
                        :class="[
                            'flex flex-col justify-center items-center gap-1 p-2 text-base font-normal',
                            'text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
                        ]"
                    >
                        <Icon
                            :name="link.icon"
                            :class="[
                                'w-6 h-6 transition duration-75',
                                'text-gray-500  dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
                            ]"
                        />
                        <span class="text-xs uppercase">{{ link.text }}</span>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup lang="ts">
const sideBarLinks = [
    {
        to: "/",
        text: "Home",
        icon: "home",
        display: true,
    },
    {
        to: "/api-list",
        text: "Api",
        icon: "terminal",
        display: import.meta.env.DEV,
    },
].filter(link => link.display);
</script>

