<script setup>
import { chatStore, mainStore } from "@/main.js";
const groups = [
    {
        name: "Svi razgovori",
        type: "normal"
    },
    {
        name: "Označeni",
        type: "starred"
    },
    {
        name: "Arhivirani",
        type: "archived"
    },
]
</script>
<template>
    <div v-if="mainStore.currentUser.account_type == 'admin'" class="flex items-center justify-between mt-5 relative">
        <a v-for="g in groups" class="flex items-center justify-center pb-3 text-xs relative cursor-default" @click="chatStore.grouping = g.type"
            :class="chatStore.grouping == g.type ? 'text-fipu_blue font-semibold' : 'text-gray-500 dark:text-gray-400 font-normal hover:underline'">
            <span>{{ g.name }}</span>
        </a>
        <span :class="{'left-0 right-0 w-6 bottom-0' : chatStore.grouping == 'normal'},
                        {'left-1/2 right-0 -translate-x-1/2 w-12 bottom-0 ml-2' : chatStore.grouping == 'starred'},
                        {'left-full w-6 bottom-0 -ml-6' : chatStore.grouping == 'archived'}" 
        class="absolute h-1 bg-fipu_blue rounded-full transition-all duration-300"></span>
    </div>
</template>