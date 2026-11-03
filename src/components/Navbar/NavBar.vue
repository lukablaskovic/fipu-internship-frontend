<script setup>
import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import NavBarMenuList from "@/components/Navbar/NavBarMenuList.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import ThemeToggle from "@/components/Navbar/ThemeToggle.vue";
import { mdiClose, mdiDotsVertical } from "@mdi/js";
import { containerMaxW } from "@/config.js";
import { ref } from "vue";

import { useUiStore } from "@/stores/ui_store";

const uiStore = useUiStore();


defineProps({
	menu: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits(["menu-click"]);

const menuClick = (event, item) => {
	emit("menu-click", event, item);
};

const isMenuNavBarActive = ref(false);
</script>

<template>
	<nav class="fixed inset-x-0 top-0 z-30 h-14 w-screen bg-gray-50 transition-position dark:bg-slate-800 lg:w-[calc(100%-var(--scrollbar-width,0px))]">
		<div class="flex lg:items-stretch" :class="containerMaxW">
			<div class="flex h-14 min-w-0 flex-1 items-stretch"><slot /></div>
			<div v-if="uiStore.isLg && !menu[0].some((item) => item.isCurrentUser)" class="flex h-14 items-center px-1"><ThemeToggle /></div>
			<div class="flex h-14 flex-none items-stretch lg:hidden">
				<button type="button" aria-label="Navigacijski izbornik" :aria-expanded="isMenuNavBarActive" @click="isMenuNavBarActive = !isMenuNavBarActive">
					<NavBarItemPlain>
					<BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
				</NavBarItemPlain>
				</button>
			</div>
			<div :inert="!isMenuNavBarActive && !uiStore.isLg ? '' : undefined" class="fipu_vertical_scrollbar absolute left-0 top-14 max-h-screen-menu w-screen overflow-y-auto bg-gray-50 shadow-lg transition-size duration-300 dark:bg-slate-800 lg:static lg:flex lg:w-auto lg:overflow-visible lg:shadow-none" :class="[isMenuNavBarActive ? 'h-auto' : 'h-0 lg:h-auto']">
				<NavBarMenuList :menu="menu" @menu-click="menuClick" />
			</div>
		</div>
	</nav>
</template>
