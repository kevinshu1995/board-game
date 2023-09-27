<template>
    <div class="w-full h-full flex justify-center items-center">
        <ul class="flex flex-col gap-4">
            <li><EnterRoomModal /></li>
            <li><CreateRoomModal /></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { EnterRoomModal, CreateRoomModal } from "@widget/modal";
</script>

