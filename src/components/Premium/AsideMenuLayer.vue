<script setup>
import AsideMenuList from "@/components/Premium/AsideMenuList.vue";
import { styleStore } from "@/main";
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
	isCompact: Boolean,
});

const emit = defineEmits(["menu-click"]);

const menuClick = (event, item) => {
	emit("menu-click", event, item);
};
</script>

<template>
	<aside id="aside" :class="zIndex" class="fixed top-0 flex h-screen w-60 overflow-hidden transition-position lg:py-2 lg:pl-2">
		<div :class="styleStore.asideStyle" class="flex flex-1 flex-col overflow-hidden dark:bg-slate-900 lg:rounded-2xl">
			<div :class="styleStore.asideBrandStyle" class="flex h-14 w-full shrink-0 flex-row items-center dark:bg-slate-900">
				<slot />
			</div>
			<div class="fipu_vertical_scrollbar flex-1 overflow-y-auto overflow-x-hidden">
				<AsideMenuList :menu="menu" :is-compact="isCompact" :active-secondary-menu-key="activeSecondaryMenuKey" @menu-click="menuClick" />
			</div>

			<slot name="footer" />
		</div>
	</aside>
</template>
