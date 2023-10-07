<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import { useStyleStore } from "@/stores/style_store.js";
import { useLayoutStore } from "@/stores/layout.js";
import { mdiMinus, mdiPlus, mdiChevronRight } from "@mdi/js";
import { getButtonColor } from "@/colors.js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import AsideMenuList from "@/components/AsideMenu/AsideMenuList.vue";
import UpdateMark from "@/components/Premium/UpdateMark.vue";
import { adminStore } from "@/main.js";

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	activeSecondaryMenuKey: {
		type: String,
		default: null,
	},
	isDropdownList: Boolean,
	isCompact: Boolean,
});

const emit = defineEmits(["menu-click"]);

const styleStore = useStyleStore();
const layoutStore = useLayoutStore();

const asideMenuItemInactiveStyle = computed(() => (hasColor.value ? "" : `${styleStore.asideMenuItemInactiveStyle} dark:text-gray-300`));

const asideMenuItemActiveBgStyle = computed(() => `${styleStore.asideMenuItemActiveBgStyle} dark:bg-slate-700/25`);

const asideMenuItemActiveStyle = computed(() => (hasColor.value ? "" : styleStore.asideMenuItemActiveStyle));

const isAsideCompact = computed(() => props.isCompact);

watch(isAsideCompact, (value) => {
	if (value) {
		isDropdownActive.value = false;
	}
});

const isDropdownActive = ref(false);

const isSecondaryMenuActive = computed(() => props.activeSecondaryMenuKey && props.item?.key && props.item?.key === props.activeSecondaryMenuKey);

const hasColor = computed(() => props.item && props.item.color);

const componentClass = computed(() => {
	const base = [props.isDropdownList ? "py-3 px-6 text-sm" : "py-3", hasColor.value ? getButtonColor(props.item.color, false, true) : `${styleStore.asideMenuItemStyle} dark:hover:bg-gray-700/50`];

	if (!hasColor.value && (isDropdownActive.value || isSecondaryMenuActive.value)) {
		base.push(asideMenuItemActiveBgStyle.value);
	}

	return base;
});

const hasDropdown = computed(() => !!props.item.menu);

const hasSecondary = computed(() => !!props.item.menuSecondary);

const hasSub = computed(() => hasDropdown.value || hasSecondary.value);

const subIcon = computed(() => {
	if (hasSecondary.value) {
		return mdiChevronRight;
	}

	return isDropdownActive.value ? mdiMinus : mdiPlus;
});

const menuClick = (event) => {
	emit("menu-click", event, props.item);
	layoutStore.tooltip.content = "";
	if (props.item.externalURL) {
		window.open(props.item.externalURL, "_blank");
		return;
	}

	if (hasDropdown.value) {
		isDropdownActive.value = !isDropdownActive.value;
	}
};
</script>

<template>
	<li>
		<component
			@mouseover="isCompact ? (layoutStore.tooltip = { content: item.label, offsetx: 16, offsety: -8, justify: '' }) : ''"
			@mouseleave="layoutStore.tooltip = { content: '', offsetx: 0, offsety: 0 }"
			v-slot="vSlot"
			:is="item.to ? RouterLink : 'a'"
			@click="menuClick"
			:to="item.to ?? null"
			:href="item.href ?? null"
			:target="item.target ?? null"
			:exact-active-class="activeSecondaryMenuKey ? null : asideMenuItemActiveBgStyle"
			class="flex cursor-pointer transition-all duration-150"
			:class="[componentClass, isCompact ? 'justify-center' : 'justify-start', item.color == 'info' ? 'hover:bg-fipu_dark_blue' : 'hover:bg-gray-900/75']">
			<BaseIcon v-if="item.icon" :path="item.icon" class="flex-none transition-all duration-300" :w="isCompact ? 'w-8 lg:w-16' : 'w-8'" :size="item.size ? item.size : 18" :class="[vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle, { relative: item.updateMark }, item.color == 'info' ? 'text-slate-800' : '']">
				<UpdateMark v-if="item.updateMark && adminStore.dashboard_data.waiting_for_allocation > 0" :color="item.updateMark" :position="isCompact ? 'top-0 left-9' : 'top-0 left-5'" />
			</BaseIcon>

			<span class="transition-all duration-300 text-clip line-clamp-1" :class="[{ '': isCompact, '': !hasSub }, vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle, isCompact ? (item.menu == undefined ? 'w-52 lg:w-0' : 'w-40 lg:w-0') : 'w-40', item.color == 'info' ? 'text-slate-900 font-medium hover:underline' : '']">
				{{ item.label }}
			</span>

			<BaseIcon v-if="hasSub" :path="subIcon" class="flex-none animate-fade-in-fast" w="w-12" :class="[{ 'lg:hidden': isCompact }, vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle]" />
		</component>
		<AsideMenuList v-if="hasDropdown" :menu="item.menu" is-dropdown-list :class="[styleStore.asideMenuDropdownStyle, isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden']" />
	</li>
</template>
