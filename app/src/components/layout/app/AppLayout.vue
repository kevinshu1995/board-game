<template>
    <div class="min-h-full flex flex-col">
        <TheNavbar class="shadow-lg" />
        <div class="flex min-h-full grow">
            <TheSidebar class="shadow-2xl self-stretch" />
            <div class="overflow-auto self-stretch p-8 w-full">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TheSidebar, TheNavbar } from "./components";
</script>

