<script setup>
import { RovingFocusItem } from "reka-ui";
import UserAvatarCurrentUser from "@/components/User/UserAvatarCurrentUser.vue";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/Navbar/ThemeToggle.vue";
import { computed, ref } from "vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import Tooltip from "@/components/Base/Tooltip.vue";
import { RouterLink, useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui_store";
import { useMainStore } from "@/stores/main_store";

const uiStore = useUiStore();
const mainStore = useMainStore();

const props = defineProps({
	isSubmenu: Boolean,
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

	return "button";
});

const componentClass = computed(() => {
	// Check if this item should be highlighted (dropdown active OR user name on profile page)
	const isActive = isDropdownActive.value || (props.item.isCurrentUser && route.path === "/profil");

	if (props.item.isLogout) {
		return "px-3 py-2 lg:ml-3 lg:w-11 lg:justify-center text-red-700 dark:text-red-400";
	}

	const base = [
		isActive ? `${uiStore.navBarItemLabelActiveColorStyle} dark:text-slate-400` : `${uiStore.navBarItemLabelStyle} dark:text-white`,
		props.item.menu ? "lg:py-2 lg:px-3" : "py-2 px-3",
	];

	if (props.item.isDesktopNoLabel) {
		base.push("lg:w-11", "lg:justify-center");
	}

	return base;
});

const itemLabel = computed(() => (props.item.isCurrentUser ? mainStore.currentUser.username || `${mainStore.currentUser.ime} ${mainStore.currentUser.prezime}` : props.item.label));

const isDropdownActive = ref(false);

const menuClick = (event) => {
	emit("menu-click", event, props.item);

	if (props.item.externalURL) {
		window.open(props.item.externalURL, "_blank");
		return;
	}
};

const menuClickDropdown = (event, item) => {
	isDropdownActive.value = false;
	emit("menu-click", event, item);
};

</script>

<template>
	<BaseDivider v-if="item.isDivider" nav-bar />

	<DropdownMenu v-else-if="item.menu" v-model:open="isDropdownActive">
		<RovingFocusItem as-child>
			<DropdownMenuTrigger :aria-label="itemLabel" :class="componentClass" class="navbar-control flex items-center">
				<UserAvatarCurrentUser v-if="item.isCurrentUser" class="h-6 w-6" />
				<BaseIcon v-if="item.icon" :path="item.icon" />
				<span class="px-2">{{ itemLabel }}</span>
				<BaseIcon :path="isDropdownActive ? mdiChevronUp : mdiChevronDown" />
			</DropdownMenuTrigger>
		</RovingFocusItem>
		<DropdownMenuContent class="z-10000 min-w-48">
			<template v-for="(child, index) in item.menu" :key="index">
				<DropdownMenuSeparator v-if="child.isDivider" />
				<DropdownMenuItem v-else :disabled="child.disabled" as-child @select="menuClickDropdown($event, child)">
					<component :is="child.to ? RouterLink : child.href || child.externalURL ? 'a' : 'button'" :to="child.to" :href="child.href || child.externalURL" :target="child.target || (child.externalURL ? '_blank' : undefined)" :type="!child.to && !child.href && !child.externalURL ? 'button' : undefined">
						<BaseIcon v-if="child.icon" :path="child.icon" />
						{{ child.label }}
					</component>
				</DropdownMenuItem>
			</template>
		</DropdownMenuContent>
	</DropdownMenu>
	<Tooltip v-else :content="itemLabel" :disabled="!item.isDesktopNoLabel">
		<RovingFocusItem as-child>
			<component
				:is="is"
				:type="is === 'button' ? 'button' : undefined"
				:aria-label="itemLabel"
				class="navbar-control relative block cursor-pointer items-center lg:flex"
				:class="[componentClass, { 'max-lg:mt-1 max-lg:w-full max-lg:border-t max-lg:border-gray-300 dark:max-lg:border-slate-600': item.isLogin || item.isLogout, 'lg:mx-1 lg:h-11 lg:self-center': !isSubmenu }]"
				:to="item.to ?? null"
				v-bind="item.to ? {} : { href: item.href }"
				:target="item.target ?? null"
				@click.stop="menuClick">
				<div class="flex items-center">
					<UserAvatarCurrentUser v-if="item.isCurrentUser" class="inline-flex h-6 w-6 shrink-0" />
					<BaseIcon v-if="item.icon" :size="item.size ? item.size : 19" :path="item.icon" :class="{ 'text-fipu_gray dark:text-white': !item.isLogout }" />

					<span class="px-2 text-base transition-colors" :class="{ 'whitespace-nowrap leading-none dark:text-white': item.isCurrentUser, 'lg:hidden': item.isDesktopNoLabel && item.icon }">
						{{ itemLabel }}
					</span>
				</div>

			</component>
		</RovingFocusItem>
	</Tooltip>
	<RovingFocusItem v-if="item.isCurrentUser && uiStore.isLg" as-child>
		<ThemeToggle class="mx-1 self-center" />
	</RovingFocusItem>
</template>
