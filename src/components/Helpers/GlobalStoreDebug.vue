<script setup>
import Tooltip from "@/components/Base/Tooltip.vue";
import DebugSelectButton from "@/components/Helpers/DebugSelectButton.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { mdiHelpCircle } from "@mdi/js";
import Slider from "@vueform/slider";
import { computed, ref } from "vue";

import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import { useAdminStore } from "@/stores/admin_store";
import { useUiStore } from "@/stores/ui_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const adminStore = useAdminStore();
const uiStore = useUiStore();
const snackBarStore = useSnackBarStore();


const debug = ref(false);
const depth = ref(5);
const storeSelected = ref("mainStore");

const storeNames = ["mainStore", "studentStore", "adminStore", "uiStore", "snackBarStore"];

const newValueFormatted = computed(() => {
	switch (storeSelected.value) {
		case "mainStore":
			return mainStore.$state;
		case "studentStore":
			return studentStore.$state;
		case "adminStore":
			return adminStore.$state;
		case "uiStore":
			return uiStore.$state;
		case "snackBarStore":
			return snackBarStore.$state;
		default:
			return {};
	}
});
</script>

<template>
	<div v-if="debug" class="fixed z-[1000] flex h-screen w-screen items-center justify-center px-[8%] py-16 backdrop-blur-sm">
		<div class="flex h-full w-full flex-col rounded-xl bg-black bg-opacity-90 p-4 text-slate-400 shadow-xl">
			<div class="text-center text-2xl font-bold">DEBUG INFO</div>
			<Tooltip :content="String(depth)"><div tabindex="0" class="self-center"><Slider v-model="depth" class="slider my-4 h-[8px] min-h-[8px] w-64 self-center" :min="1" :max="8" :show-tooltip="false" :merge="1" :lazy="false" /></div></Tooltip>
			<div class="fipu_vertical_scrollbar flex w-full items-center justify-start overflow-x-auto overflow-y-hidden py-1 pb-4">
				<DebugSelectButton v-for="name in storeNames" :key="name" :name="name" :selected="storeSelected === name" @select="storeSelected = name" />
			</div>
			<hr />
			<div class="fipu_vertical_scrollbar overflow-auto">
				<vue-json-pretty show-icon :deep="depth" :data="newValueFormatted" />
			</div>
		</div>
	</div>
	<div class="fixed bottom-2 right-2 z-[2000]" @click="debug = !debug">
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
	--slider-connect-bg: theme("colors.fipu_blue");
}
</style>
