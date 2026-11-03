<script setup>
import { RovingFocusGroup, RovingFocusItem } from "reka-ui";
import ThemeToggle from "@/components/Navbar/ThemeToggle.vue";
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
		<template v-for="(item, index) in isSubmenu ? menu : menu[uiStore.isLg ? 0 : 1]" :key="index">
			<RovingFocusItem v-if="item.isThemeToggle" as-child>
				<ThemeToggle />
			</RovingFocusItem>
			<NavBarItem v-else :is-submenu="isSubmenu" :item="item" @menu-click="menuClick" />
		</template>
	</RovingFocusGroup>
</template>
