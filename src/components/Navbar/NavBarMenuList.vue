<script setup>
import NavBarItem from "@/components/Navbar/NavBarItem.vue";
import { layoutStore } from "@/main";

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
	<NavBarItem v-for="(item, index) in isSubmenu ? menu : menu[layoutStore.isLg ? 0 : 1]" :key="index" :item="item" @menu-click="menuClick" />
</template>
