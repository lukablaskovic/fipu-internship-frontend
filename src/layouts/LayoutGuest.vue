<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { styleStore } from "@/main.js";

import menuAsideGuest from "@/menus/menuAsideGuest.js";

import BaseIcon from "@/components/Base/BaseIcon.vue";

import NavBar from "@/components/Navbar/NavBar.vue";
import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import AsideMenu from "@/components/AsideMenu/AsideMenu.vue";

import FooterBar from "@/components/FooterBar.vue";
import menuNavBarGuest from "@/menus/menuNavBarGuest";

import { layoutStore, mainStore } from "@/main.js";
import SnackBar from "@/components/Premium/SnackBar.vue";

const layoutAsidePadding = computed(() => (layoutStore.isAsideLgActive ? "lg:pl-22" : "xl:pl-22"));
const router = useRouter();

router.beforeEach(() => {
	layoutStore.isAsideMobileExpanded = false;
});

const menuClick = (event, item) => {
	if (item.isToggleLightDark) {
		styleStore.setDarkMode();
	}

	if (item.label == "Prijava") {
		router.push("/login");
	}
};
</script>
<template name="fade">
	<div
		:class="{
			dark: styleStore.darkMode,
			'overflow-hidden lg:overflow-visible': layoutStore.isAsideMobileExpanded,
		}">
		<div :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': layoutStore.isAsideMobileExpanded }]" class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100 flex flex-col">
			<NavBar :menu="menuNavBarGuest" :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': layoutStore.isAsideMobileExpanded }]" @menu-click="menuClick">
				<NavBarItemPlain display="flex lg:hidden" @click.prevent="layoutStore.asideMobileToggle()">
					<BaseIcon :path="layoutStore.isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
				</NavBarItemPlain>
				<NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="layoutStore.asideLgToggle()">
					<BaseIcon :path="layoutStore.isAsideLgActive ? mdiBackburger : mdiMenu" size="24" />
				</NavBarItemPlain>
			</NavBar>

			<AsideMenu :menu="menuAsideGuest" :is-aside-mobile-expanded="isAsideMobileExpanded" :is-aside-lg-active="isAsideLgActive" @menu-click="menuClick" @aside-lg-close-click="isAsideLgActive = false" />
			<slot></slot>
			<div class="mt-6">
				<FooterBar
					><br />
					Made with <span style="color: #e25555">&#9829;</span> at <a :href="mainStore.fipulab_web" target="_blank" class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue">FIPU.lab</a></FooterBar
				>
			</div>
			<SnackBar />
		</div>
	</div>
</template>
