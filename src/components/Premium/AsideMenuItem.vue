<script setup>
import AsideMenuList from "@/components/Premium/AsideMenuList.vue";
import UpdateMark from "@/components/Premium/UpdateMark.vue";
import { mdiMinus, mdiPlus, mdiChevronRight } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { getButtonColor } from "@/colors.js";
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";

import { styleStore } from "@/main";

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

	if (hasDropdown.value) {
		isDropdownActive.value = !isDropdownActive.value;
	}
};

const updateMarkPosition = computed(() => {
	const base = "top-0.5 right-4";

	return props.isCompact ? `${base} lg:right-6` : base;
});
</script>

<template>
	<li>
		<component :is="item.to ? RouterLink : 'a'" v-slot="vSlot" :to="item.to ?? null" :href="item.href ?? null" :target="item.target ?? null" :exact-active-class="activeSecondaryMenuKey ? null : asideMenuItemActiveBgStyle" class="flex cursor-pointer" :class="componentClass" @click="menuClick">
			<BaseIcon v-if="item.icon" :path="item.icon" class="flex-none transition-size" :class="[vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle, { relative: item.updateMark }]" :w="isCompact ? 'w-16 lg:w-20' : 'w-16'" :size="18">
				<UpdateMark v-if="item.updateMark" :color="item.updateMark" :position="updateMarkPosition" />
			</BaseIcon>
			<span class="line-clamp-1 grow animate-fade-in text-ellipsis" :class="[{ 'lg:hidden': isCompact, 'pr-12': !hasSub }, vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle]">{{ item.label }}</span>
			<BaseIcon v-if="hasSub" :path="subIcon" class="flex-none animate-fade-in-fast" :class="[{ 'lg:hidden': isCompact }, vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle]" w="w-12" />
		</component>
		<AsideMenuList v-if="hasDropdown" :menu="item.menu" :class="[styleStore.asideMenuDropdownStyle, isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden']" is-dropdown-list />
	</li>
</template>
