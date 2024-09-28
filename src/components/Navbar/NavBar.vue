<script setup>
import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import NavBarMenuList from "@/components/Navbar/NavBarMenuList.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiClose, mdiDotsVertical } from "@mdi/js";
import { containerMaxW } from "@/config.js";
import { ref } from "vue";

import { layoutStore } from "@/main";

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
	<nav class="fixed inset-x-0 top-0 z-30 h-14 w-screen bg-gray-50 transition-position dark:bg-slate-800 lg:w-auto">
		<div class="flex lg:items-stretch" :class="containerMaxW">
			<div class="flex h-14 flex-1 items-stretch"><slot /></div>
			<div class="flex h-14 flex-none items-stretch lg:hidden">
				<NavBarItemPlain @click.prevent="isMenuNavBarActive = !isMenuNavBarActive">
					<BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
				</NavBarItemPlain>
			</div>
			<div class="fipu_vertical_scrollbar absolute -left-2 top-14 max-h-screen-menu w-screen overflow-y-auto bg-gray-50 shadow-lg transition-size duration-300 dark:bg-slate-800 lg:static lg:flex lg:w-auto lg:overflow-visible lg:shadow-none" :style="isMenuNavBarActive && !layoutStore.isLg ? 'height: ' + menu[1].length * 42 + 'px;' : ''" :class="[isMenuNavBarActive ? 'h-64 lg:h-auto' : 'h-0 lg:h-auto']">
				<NavBarMenuList :menu="menu" @menu-click="menuClick" />
			</div>
		</div>
	</nav>
</template>
