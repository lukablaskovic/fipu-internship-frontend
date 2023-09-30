<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiPlus  } from '@mdi/js';
</script>
<template>
    <div class="h-full overflow-hidden relative pt-2">
        <div class="absolute bottom-0 right-0 mr-2">
            <button class="flex items-center justify-center shadow-sm h-10 w-10 bg-rose-500 text-white rounded-full">
            <BaseIcon :path="mdiPlus " :size="20"></BaseIcon>
            </button>
        </div>
    </div>
</template>