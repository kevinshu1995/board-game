<script setup lang="ts">
import AppLayout from "./components/layout/app/AppLayout.vue";
import { useAuth } from "@/store";

// all stores needed everywhere
const auth = useAuth();
</script>

<template>
    <AppLayout />
</template>

