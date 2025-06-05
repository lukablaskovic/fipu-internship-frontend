<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
import { useRouter } from "vue-router";
import { styleStore } from "@/main.js";
import { computed } from "vue";

import menuAsideGuest from "@/menus/menuAsideGuest";

import BaseIcon from "@/components/Base/BaseIcon.vue";

import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import AsideMenu from "@/components/AsideMenu/AsideMenu.vue";
import NavBar from "@/components/Navbar/NavBar.vue";

import menuNavBarGuest from "@/menus/menuNavBarGuest";
import FooterBar from "@/components/FooterBar.vue";

import SnackBar from "@/components/Premium/SnackBar.vue";
import { layoutStore, mainStore } from "@/main.js";

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
		router.push("/prijava");
	}
};
</script>
<template name="fade">
	<div
		:class="{
			dark: styleStore.darkMode,
			'overflow-hidden lg:overflow-visible': layoutStore.isAsideMobileExpanded,
		}">
		<div :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': layoutStore.isAsideMobileExpanded }]" class="flex min-h-screen w-screen flex-col bg-gray-50 pt-14 transition-position dark:bg-slate-800 dark:text-slate-100 lg:w-auto">
			<NavBar :menu="menuNavBarGuest" :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': layoutStore.isAsideMobileExpanded }]" @menu-click="menuClick">
				<NavBarItemPlain display="flex lg:hidden" @click.prevent="layoutStore.asideMobileToggle()">
					<BaseIcon :path="layoutStore.isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
				</NavBarItemPlain>
				<NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="layoutStore.asideLgToggle()">
					<BaseIcon :path="layoutStore.isAsideLgActive ? mdiBackburger : mdiMenu" size="24" />
				</NavBarItemPlain>
			</NavBar>

			<AsideMenu :menu="menuAsideGuest" :is-aside-mobile-expanded="layoutStore.isAsideMobileExpanded" :is-aside-lg-active="layoutStore.isAsideLgActive" @menu-click="menuClick" @aside-lg-close-click="layoutStore.isAsideLgActive = false" />
			<slot></slot>
			<div class="mt-6">
				<FooterBar
					><br />
					Made with <span style="color: #e25555">&#9829;</span> at <a :href="mainStore.fipulab_web" target="_blank" class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue">FIPUlab</a></FooterBar
				>
			</div>
			<SnackBar />
		</div>
	</div>
</template>

<style>
.hover-underline-animation {
	display: inline-block;
	z-index: 0;
	overflow: visible;
}

.hover-underline-animation:after {
	content: "";
	display: block;
	width: 100%;
	height: 2px;
	background-color: #9de0f7;
	transform: scaleX(0);
	transform-origin: bottom right;
	transition: transform 0.25s ease-out;
	z-index: -1;
}

.hover-underline-animation:hover:after {
	transform: scaleX(1);
	transform-origin: bottom left;
}
</style>
