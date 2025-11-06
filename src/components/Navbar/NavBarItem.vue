<script setup>
import UserAvatarCurrentUser from "@/components/User/UserAvatarCurrentUser.vue";
import NavBarMenuList from "@/components/Navbar/NavBarMenuList.vue";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { mainStore, styleStore, layoutStore } from "@/main.js";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { RouterLink, useRoute } from "vue-router";

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["menu-click"]);

const route = useRoute();

const is = computed(() => {
	if (props.item.href) {
		return "a";
	}

	if (props.item.to) {
		return RouterLink;
	}

	return "div";
});

const componentClass = computed(() => {
	// Check if this item should be highlighted (dropdown active OR user name on profile page)
	const isActive = isDropdownActive.value || (props.item.isCurrentUser && route.path === "/profil");

	const base = [
		isActive ? `${styleStore.navBarItemLabelActiveColorStyle} dark:text-slate-400` : `${styleStore.navBarItemLabelStyle} dark:text-white dark:hover:text-slate-400 ${styleStore.navBarItemLabelHoverStyle}`,
		props.item.menu ? "lg:py-2 lg:px-3" : "py-2 px-3",
	];

	if (props.item.isDesktopNoLabel) {
		base.push("lg:w-16", "lg:justify-center");
	}

	return base;
});

const itemLabel = computed(() => (props.item.isCurrentUser ? mainStore.currentUser.username || `${mainStore.currentUser.ime} ${mainStore.currentUser.prezime}` : props.item.label));

const isDropdownActive = ref(false);

const menuClick = (event) => {
	emit("menu-click", event, props.item);

	layoutStore.tooltip.content = "";
	if (props.item.externalURL) {
		window.open(props.item.externalURL, "_blank");
		return;
	}

	if (props.item.menu) {
		isDropdownActive.value = !isDropdownActive.value;
	}
};

const menuClickDropdown = (event, item) => {
	emit("menu-click", event, item);
};

const root = ref(null);

const forceClose = (event) => {
	if (root.value && !root.value.contains(event.target)) {
		isDropdownActive.value = false;
	}
};

onMounted(() => {
	if (props.item.menu) {
		window.addEventListener("click", forceClose);
	}
});

onBeforeUnmount(() => {
	if (props.item.menu) {
		window.removeEventListener("click", forceClose);
	}
});
</script>

<template>
	<BaseDivider v-if="item.isDivider" nav-bar />

	<component :is="is" v-else ref="root" class="relative block cursor-pointer items-center lg:flex" :class="componentClass" :to="item.to ?? null" :href="item.href ?? null" :target="item.target ?? null" @click="menuClick">
		<div class="flex items-center" :class="{ 'bg-gray-100 p-3 dark:bg-slate-800 lg:bg-transparent lg:p-0 lg:dark:bg-transparent': item.menu }">
			<UserAvatarCurrentUser v-if="item.isCurrentUser" class="mr-3 inline-flex h-6 w-6" />
			<BaseIcon
				v-if="item.icon"
				:size="item.size ? item.size : 19"
				:path="item.icon"
				class="text-fipu_gray transition-colors hover:text-fipu_blue dark:text-white dark:hover:text-fipu_blue"
				@mouseover="item.isDesktopNoLabel ? (layoutStore.tooltip = { content: itemLabel, offsetx: 0, offsety: 40, justify: 'justify-center items-center' }) : ''"
				@mouseleave="layoutStore.tooltip = { content: '', offsetx: 0, offsety: 0 }" />

			<span class="px-2 text-base transition-colors" :class="{ 'lg:hidden': item.isDesktopNoLabel && item.icon }">
				{{ itemLabel }}
			</span>
			<BaseIcon v-if="item.menu != undefined" :path="isDropdownActive ? mdiChevronUp : mdiChevronDown" class="hidden transition-colors lg:inline-flex" />
		</div>

		<div
			v-if="item.menu"
			:style="isDropdownActive ? 'height: ' + item.menu.length * 42 + 'px;' : 'height: 0px;'"
			class="overflow-hidden bg-gray-100 text-sm transition-size duration-300 dark:bg-slate-800 lg:absolute lg:left-0 lg:top-full lg:z-20 lg:min-w-full lg:rounded-lg lg:shadow-lg">
			<NavBarMenuList :is-submenu="true" :menu="item.menu" @menu-click="menuClickDropdown" />
		</div>
	</component>
</template>
