<script setup>

import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui_store";

import { computed } from "vue";

import menuAsideGuest from "@/menus/menuAsideGuest";

import BaseIcon from "@/components/Base/BaseIcon.vue";

import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import AsideMenu from "@/components/AsideMenu/AsideMenu.vue";
import NavBar from "@/components/Navbar/NavBar.vue";

import menuNavBarGuest from "@/menus/menuNavBarGuest";
import FooterBar from "@/components/FooterBar.vue";


const uiStore = useUiStore();

const layoutAsidePadding = computed(() => (uiStore.isAsideLgActive ? "lg:pl-22" : "xl:pl-22"));
const router = useRouter();

router.beforeEach(() => {
	uiStore.isAsideMobileExpanded = false;
});

const menuClick = (event, item) => {
	if (item.isToggleLightDark) {
		uiStore.setDarkMode();
	}

	if (item.label == "Prijava") {
		router.push("/prijava");
	}
};
</script>
<template name="fade">
	<div
		:class="{
			dark: uiStore.darkMode,
			'overflow-hidden lg:overflow-visible': uiStore.isAsideMobileExpanded,
		}">
		<div :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': uiStore.isAsideMobileExpanded }]" class="flex min-h-screen w-screen flex-col bg-gray-50 pt-14 transition-position dark:bg-slate-800 dark:text-slate-100 lg:w-auto">
			<NavBar :menu="menuNavBarGuest" :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': uiStore.isAsideMobileExpanded }]" @menu-click="menuClick">
				<NavBarItemPlain display="flex lg:hidden" @click.prevent="uiStore.asideMobileToggle()">
					<BaseIcon :path="uiStore.isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
				</NavBarItemPlain>
				<NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="uiStore.asideLgToggle()">
					<BaseIcon :path="uiStore.isAsideLgActive ? mdiBackburger : mdiMenu" size="24" />
				</NavBarItemPlain>
			</NavBar>

			<AsideMenu :menu="menuAsideGuest" @menu-click="menuClick" />
			<slot></slot>
			<div class="mt-6">
				<FooterBar />
			</div>
		</div>
	</div>
</template>
