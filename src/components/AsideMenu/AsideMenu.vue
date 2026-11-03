<script setup>
import Tooltip from "@/components/Base/Tooltip.vue";
import { mdiClose, mdiChevronRight, mdiChevronLeft } from "@mdi/js";
import AsideMenuLayer from "@/components/AsideMenu/AsideMenuLayer.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui_store";

import { computed, ref } from "vue";

import FIPU_praksa_logo_transparent from "/FIPU_praksa_logo_transparent.svg";

const uiStore = useUiStore();

defineProps({
	menu: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits(["menu-click"]);

const manuallyExpanded = ref(false);
const hoverExpanded = ref(false);
const isPrimaryMenuCompact = computed(() => !manuallyExpanded.value && !hoverExpanded.value);

const collapsePrimaryMenu = () => {
	manuallyExpanded.value = false;
	hoverExpanded.value = false;
};

const expandOnHover = (event) => {
	if (event.pointerType === "mouse" && window.matchMedia("(min-width: 640px)").matches) {
		hoverExpanded.value = true;
	}
};
const secondaryMenuItem = ref(null);

const overlayLayerDisplayType = computed(() => {
	if (secondaryMenuItem.value) {
		return "flex";
	}

	if (manuallyExpanded.value) {
		return "hidden lg:flex";
	}

	return "pointer-events-none";
});

const closeSecondaryMenu = () => {
	secondaryMenuItem.value = null;
};

const menuClickPrimaryMenu = (event, item) => {
	emit("menu-click", event, item);

	if (item.menu) {
		manuallyExpanded.value = true;
	}

	if (item.menuSecondary) {
		if (hoverExpanded.value) manuallyExpanded.value = true;
		if (secondaryMenuItem.value && item.key === secondaryMenuItem.value.key) {
			closeSecondaryMenu();
		} else {
			secondaryMenuItem.value = item;
		}
	}
};

const menuClickSecondaryMenu = (event, item) => {
	emit("menu-click", event, item);
};

const overlayClick = () => {
	if (secondaryMenuItem.value) {
		closeSecondaryMenu();
	} else if (!isPrimaryMenuCompact.value) {
		collapsePrimaryMenu();
	}
};

window.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && (secondaryMenuItem.value || !isPrimaryMenuCompact.value)) {
		overlayClick();
	}
});

const router = useRouter();

router.afterEach(() => {
	collapsePrimaryMenu();
});

</script>

<template>
	<AsideMenuLayer
		:menu="menu"
		:class="[uiStore.isAsideMobileExpanded ? 'left-0' : '-left-60 lg:left-0', isPrimaryMenuCompact ? '' : '', { 'lg:hidden xl:flex': !uiStore.isAsideLgActive }]"
		:is-compact="isPrimaryMenuCompact"
		:z-index="secondaryMenuItem ? 'z-40 md:z-50' : 'z-50'"
		:active-secondary-menu-key="secondaryMenuItem?.key"
		@pointerenter="expandOnHover"
		@pointerleave="hoverExpanded = false"
		@menu-click="menuClickPrimaryMenu">
		<router-link to="/">
			<div class="flex flex-row items-center justify-center p-2 dark:bg-slate-900">
				<img :src="FIPU_praksa_logo_transparent" alt="FIPU Praksa Logo" class="max-h-14 object-contain" />
			</div>
		</router-link>

		<template #footer>
			<div class="hidden shrink-0 p-3 lg:block">
				<Tooltip :content="isPrimaryMenuCompact ? 'Proširi izbornik' : 'Smanji izbornik'">
					<BaseButton
						:icon="isPrimaryMenuCompact ? mdiChevronRight : mdiChevronLeft"
						:icon-size="22"
						:label="isPrimaryMenuCompact ? null : 'Smanji'"
						:aria-label="isPrimaryMenuCompact ? 'Proširi izbornik' : 'Smanji izbornik'"
						:aria-expanded="!isPrimaryMenuCompact"
						color="border-transparent bg-fipu_blue/10 text-fipu_blue hover:bg-fipu_blue/20 hover:text-fipu_light_blue"
						class="h-11 w-full !rounded-xl text-sm font-medium focus:ring-inset motion-reduce:transition-none"
						@click="isPrimaryMenuCompact ? (manuallyExpanded = true) : collapsePrimaryMenu()" />
				</Tooltip>
			</div>
		</template>
	</AsideMenuLayer>

	<AsideMenuLayer
		v-if="secondaryMenuItem"
		:menu="secondaryMenuItem.menuSecondary"
		:class="[isPrimaryMenuCompact ? 'lg:left-22' : 'md:left-60']"
		class="right-0 animate-fade-in-right-fast md:right-auto lg:animate-fade-in-left-fast"
		@menu-click="menuClickSecondaryMenu">
		<BaseIcon v-if="secondaryMenuItem.icon" :path="secondaryMenuItem.icon" w="w-16" />
		<div class="flex-1">
			{{ secondaryMenuItem.label }}
		</div>
		<BaseIcon :path="mdiClose" class="cursor-pointer" w="w-12" @click="closeSecondaryMenu" />
	</AsideMenuLayer>

	<OverlayLayer :type="overlayLayerDisplayType" z-index="z-40" @overlay-click="overlayClick" />
</template>
