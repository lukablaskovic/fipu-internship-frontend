<script setup>
import { RovingFocusGroup } from "reka-ui";
import NavBarItem from "@/components/Navbar/NavBarItem.vue";
import { useUiStore } from "@/stores/ui_store";

const uiStore = useUiStore();


defineProps({
	menu: {
		type: Array,
		default: () => [],
	},
	isSubmenu: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["menu-click"]);

const menuClick = (event, item) => {
	emit("menu-click", event, item);
};
</script>

<template>
	<RovingFocusGroup :orientation="isSubmenu || !uiStore.isLg ? 'vertical' : 'horizontal'" loop :class="isSubmenu ? '' : 'lg:flex lg:items-stretch'">
		<NavBarItem v-for="(item, index) in isSubmenu ? menu : menu[uiStore.isLg ? 0 : 1]" :key="index" :is-submenu="isSubmenu" :item="item" @menu-click="menuClick" />
	</RovingFocusGroup>
</template>
