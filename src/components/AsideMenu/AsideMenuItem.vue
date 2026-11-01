<script setup>
import { RovingFocusItem } from "reka-ui";
import AsideMenuList from "@/components/AsideMenu/AsideMenuList.vue";
import Tooltip from "@/components/Base/Tooltip.vue";

import { mdiMinus, mdiPlus, mdiChevronRight } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { getButtonColor } from "@/colors.js";
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import { useUiStore } from "@/stores/ui_store";

const uiStore = useUiStore();


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

const asideMenuItemInactiveStyle = computed(() => (hasColor.value ? "" : `${uiStore.asideMenuItemInactiveStyle} dark:text-gray-300`));

const asideMenuItemActiveBgStyle = computed(() => `${uiStore.asideMenuItemActiveBgStyle} dark:bg-slate-700/25`);

const asideMenuItemActiveStyle = computed(() => (hasColor.value ? "" : uiStore.asideMenuItemActiveStyle));

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
	const base = [props.isDropdownList ? "py-3 px-6 text-sm" : "py-3", hasColor.value ? getButtonColor(props.item.color, false, true) : `${uiStore.asideMenuItemStyle} dark:hover:bg-gray-700/75`];

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
		<Tooltip :content="item.label" :disabled="!isCompact" side="right">
			<RovingFocusItem as-child>
				<component
					:is="item.to ? RouterLink : item.href ? 'a' : 'button'"
					v-slot="vSlot"
					:type="!item.to && !item.href ? 'button' : undefined"
					:aria-label="item.label"
					:to="item.to ?? null"
					v-bind="item.to ? {} : { href: item.href }"
					:target="item.target ?? null"
					:active-class="asideMenuItemActiveBgStyle"
					class="group flex w-full cursor-pointer text-left transition-all duration-150"
					:class="[componentClass, isCompact ? 'justify-center' : 'justify-start', 'group hover:bg-fipu_blue']"
					@click="menuClick">
					<BaseIcon
						v-if="item.icon"
						:path="item.icon"
						class="flex-none transition-all duration-300 group-hover:text-white"
						:w="isCompact ? 'w-8 lg:w-16' : 'w-8'"
						:size="item.size ? item.size : 18"
						:class="[vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle, { relative: item.updateMark }, item.color == 'info' ? 'text-slate-800' : '']">
					</BaseIcon>

					<span
						class="line-clamp-1 text-clip transition-all duration-300"
						:class="[
							{ '': isCompact, '': !hasSub },
							vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle,
							isCompact ? (item.menu == undefined ? 'w-52 lg:w-0' : 'w-40 lg:w-0') : 'w-40',
							item.color == 'info' ? 'font-medium text-slate-900 hover:underline' : '',
						]">
						{{ item.label }}
					</span>

					<BaseIcon v-if="hasSub" :path="subIcon" class="flex-none animate-fade-in-fast" w="w-12" :class="[{ 'lg:hidden': isCompact }, vSlot && vSlot.isExactActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle]" />
				</component>
			</RovingFocusItem>
		</Tooltip>
		<AsideMenuList v-if="hasDropdown" :menu="item.menu" is-dropdown-list :class="[uiStore.asideMenuDropdownStyle, isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden']" />
	</li>
</template>
