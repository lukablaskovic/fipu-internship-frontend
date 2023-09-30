<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiMagnify   } from '@mdi/js';
</script>
<template>
    <div class="flex flex-row items-center -mx-2 lg:-mx-0">
        <div class="flex flex-row items-center">
            <div class="text-xl font-semibold text-fipu_gray dark:text-gray-300">Poruke</div>
        </div>
        <div class="ml-auto">
            <button class="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 hover:bg-white text-gray-500
                dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-500">
                <BaseIcon :path="mdiMagnify" :size="20"></BaseIcon>
            </button>
        </div>
    </div>
</template>