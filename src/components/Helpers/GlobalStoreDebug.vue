<script setup>
import DebugSelectButton from "@/components/Helpers/DebugSelectButton.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { mdiHelpCircle } from "@mdi/js";
import Slider from "@vueform/slider";
import { computed } from "vue";

import { mainStore, studentStore, adminStore, styleStore, layoutStore, snackBarStore } from "@/main.js";

const storeNames = ["mainStore", "studentStore", "adminStore", "styleStore", "layoutStore", "snackBarStore"];

const newValueFormatted = computed(() => {
	switch (mainStore.storeSelected) {
		case "mainStore":
			return mainStore.$state;
		case "studentStore":
			return studentStore.$state;
		case "adminStore":
			return adminStore.$state;
		case "styleStore":
			return styleStore.$state;
		case "layoutStore":
			return layoutStore.$state;
		case "snackBarStore":
			return snackBarStore.$state;
	}
});
</script>

<template>
	<div v-if="mainStore.debug" class="fixed z-[1000] flex h-screen w-screen items-center justify-center px-[8%] py-16 backdrop-blur-sm">
		<div class="flex h-full w-full flex-col rounded-xl bg-black bg-opacity-90 p-4 text-slate-400 shadow-xl">
			<div class="text-center text-2xl font-bold">DEBUG INFO</div>
			<Slider class="slider my-4 h-[8px] min-h-[8px] w-64 self-center" v-model="mainStore.depth" :min="1" :max="8" showTooltip="focus" :merge="1" :lazy="false" />
			<div class="fipu_vertical_scrollbar flex w-full items-center justify-start overflow-x-auto overflow-y-hidden py-1 pb-4">
				<DebugSelectButton v-for="name in storeNames" :name="name" />
			</div>
			<hr />
			<div class="fipu_vertical_scrollbar overflow-auto">
				<vue-json-pretty showIcon :deep="mainStore.depth" :data="newValueFormatted" />
			</div>
		</div>
	</div>
	<div class="fixed bottom-2 right-2 z-[2000]" @click="mainStore.debug = !mainStore.debug">
		<BaseIcon :path="mdiHelpCircle" h="40" w="40" :size="40" class="text-main_lighttext hover:text-main_cyan mr-2 text-4xl opacity-50 hover:cursor-pointer" />
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
