<template>
	<aside id="aside" :class="[zIndex, 'fixed top-0 flex h-screen overflow-hidden transition-position lg:py-2 lg:pl-2', isCompact ? 'sm:w-20' : 'sm:w-64']">
		<div :class="styleStore.asideStyle" class="flex flex-1 flex-col overflow-hidden dark:bg-slate-900 lg:rounded-2xl">
			<div :class="styleStore.asideBrandStyle" class="flex w-full shrink-0 flex-row items-center dark:bg-slate-900">
				<slot />
			</div>
			<div class="fipu_vertical_scrollbar flex-1 overflow-y-auto overflow-x-hidden">
				<AsideMenuList :menu="menu" :is-compact="isCompact" :active-secondary-menu-key="activeSecondaryMenuKey" @menu-click="menuClick" />
			</div>
			<slot name="footer" />
		</div>
	</aside>
</template>

<script setup>
import AsideMenuList from "@/components/AsideMenu/AsideMenuList.vue";
import { mainStore, styleStore } from "@/main.js";
import { useRouter } from "vue-router";
import { ref } from "vue"; // Import ref for reactive properties

const router = useRouter();
defineProps({
	menu: {
		type: Array,
		default: () => [],
	},
	activeSecondaryMenuKey: {
		type: String,
		default: null,
	},
	zIndex: {
		type: String,
		default: "z-50",
	},
	isCompact: {
		type: Boolean,
		default: false, // Add default for isCompact
	},
});

const emit = defineEmits(["menu-click"]);

const menuClick = (event, item) => {
	if (item.logoutModalActive) {
		mainStore.activateLogoutModal(true);
		return;
	}
	if (item.label == "Prijava") {
		router.push("/prijava");
		return;
	}

	emit("menu-click", event, item);
};
</script>

<style scoped></style>
