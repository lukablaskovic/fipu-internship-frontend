<script setup>
import { computed } from "vue";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import Slider from '@vueform/slider'
import BaseIcon from "@/components/Base/BaseIcon.vue";
import DebugSelectButton from "@/components/Helpers/DebugSelectButton.vue";
import { mdiHelpCircle } from '@mdi/js';

import {   
mainStore,
studentStore,
adminStore,
guestStore,
styleStore,
layoutStore,
snackBarStore, 
chatStore, 
} from "@/main.js";

const storeNames = ["mainStore", "studentStore", "adminStore", "guestStore", "styleStore", "layoutStore", "snackBarStore", "chatStore"]

const newValueFormatted = computed(() => {
    switch (mainStore.storeSelected) {
        case "mainStore": return mainStore.$state
        case "studentStore": return studentStore.$state
        case "adminStore": return adminStore.$state
        case "guestStore": return guestStore.$state
        case "styleStore": return styleStore.$state
        case "layoutStore": return layoutStore.$state
        case "snackBarStore": return snackBarStore.$state
        case "chatStore": return chatStore.$state
    }
});

</script>

<template>
    <div v-if="!mainStore.debug" class="w-screen h-screen flex justify-center items-center absolute backdrop-blur-sm z-[1000] py-16 px-[8%]">
        <div class="p-4 flex flex-col bg-black bg-opacity-90 shadow-xl rounded-xl h-full w-full text-slate-400">
            <div class="text-center text-2xl font-bold"> DEBUG INFO </div>
            <Slider class="my-4 slider min-h-[8px] h-[8px] w-64 self-center" v-model="mainStore.depth" :min="1" :max="8" showTooltip="focus" :merge="1" :lazy="false" />
            <div class="w-full flex justify-start items-center py-1">
                <DebugSelectButton v-for="name in storeNames" :name="name"/>
            </div>  
            <hr/>
            <div class="overflow-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-400">
                <vue-json-pretty showIcon :deep="mainStore.depth" :data="newValueFormatted" />
            </div>
        </div>
    </div>
    <div class="absolute bottom-2 right-2 z-[2000]" @click="mainStore.debug = !mainStore.debug">
        <BaseIcon :path="mdiHelpCircle" :h="40" :w="40" :size="40" class="text-main_lighttext hover:text-main_cyan text-4xl hover:cursor-pointer mr-2 opacity-50"/>
    </div>
</template>

<style src="@vueform/slider/themes/default.css"></style>
<style>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    transition: all 0s 50000s;
}
.vjs-tree-node:hover {
    background: rgba(255, 255, 255, 0.1) !important;
}
.slider {
  --slider-bg: #f1f5f9;
  --slider-connect-bg: #3b82f6;
  --slider-tooltip-bg: #3b82f6;
}
</style>