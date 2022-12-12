<template>
    <div class="min-h-full flex flex-col">
        <Navbar class="shadow-lg" />
        <div class="flex min-h-full grow">
            <Sidebar class="shadow-2xl self-stretch" />
            <div class="overflow-auto self-stretch p-8">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Sidebar, Navbar } from "./components";
</script>

