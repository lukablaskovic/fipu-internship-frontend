<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu, mdiMagnify, mdiLaptop, mdiEmail } from "@mdi/js";
import { ref, onMounted, computed } from "vue";
import { mainStore, styleStore } from "@/main.js";
import SearchOptions from "@/components/SearchOptions.vue";

import menuAsideAdmin from "@/menus/menuAsideAdmin.js";
import AsideMenu from "@/components/AsideMenu/AsideMenu.vue";

import menuAsideStudent from "@/menus/menuAsideStudent.js";
import menuNavBar from "@/menus/menuNavBar.js";

import BaseIcon from "@/components/Base/BaseIcon.vue";
import FormControl from "@/components/Form/FormControl.vue";
import NavBar from "@/components/Navbar/NavBar.vue";
import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import FooterBar from "@/components/FooterBar.vue";

import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";

import { layoutStore } from "@/main.js";

import SnackBar from "@/components/Premium/SnackBar.vue";

const layoutAsidePadding = computed(() => (layoutStore.isAsideLgActive ? "lg:pl-22" : "xl:pl-22"));

import { useRouter } from "vue-router";
const router = useRouter();

const logoutModalActive = computed(() => mainStore.logoutModalActive);
const helpModalActive = computed(() => mainStore.helpModalActive);

const userAdmin = ref(false);

let menuAside = ref([]);
onMounted(() => {
	userAdmin.value = mainStore.userAdmin;
	if (userAdmin.value) {
		menuAside.value = menuAsideAdmin;
	}
	if (!userAdmin.value) {
		menuAside.value = menuAsideStudent;
	}
}),
	router.beforeEach(() => {
		layoutStore.isAsideMobileExpanded = false;
	});

const menuClick = (event, item) => {
	if (item.isToggleLightDark) {
		styleStore.setDarkMode();
	}

	if (item.isLogout) {
		mainStore.activateLogoutModal(true);
	}

	if (item.isHelp) {
		mainStore.activateHelpModal(true);
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
			<NavBar :menu="menuNavBar" :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': layoutStore.isAsideMobileExpanded }]" @menu-click="menuClick">
				<NavBarItemPlain display="flex lg:hidden" @click.prevent="layoutStore.asideMobileToggle()">
					<BaseIcon :path="layoutStore.isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
				</NavBarItemPlain>
				<NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="layoutStore.asideLgToggle()">
					<BaseIcon :path="layoutStore.isAsideLgActive ? mdiBackburger : mdiMenu" size="24" />
				</NavBarItemPlain>
				<NavBarItemPlain use-margin>
					<FormControl :icon="mdiMagnify" search-bar borderless />
				</NavBarItemPlain>
			</NavBar>

			<CardBoxModal v-model="logoutModalActive" has-cancel title="Jeste li sigurni da se želite odjaviti?" button-label="Odjava" class="z-100" @cancel="mainStore.activateLogoutModal(false)" @confirm="mainStore.logout()"> </CardBoxModal>

			<CardBoxModal v-model="helpModalActive" has-cancel :has-confirm="false" title="ℹ️ Upute za izvođenje prakse" button-label="Povratak" @cancel="mainStore.activateHelpModal(false)">
				<BaseDivider></BaseDivider>
				<div class="text-xl mb-2">O kolegiju</div>
				<div>Cilj kolegija <b>Stručna praksa</b> je omogućiti studentima praktični rad u IT poduzećima na projektima oblikovanja i implementacije programske podrške; usvajanja stručnih kompetencija iz područja djelovanja organizacije u kojoj se praksa provodi te razvijanje osjećaja odgovornosti i timskoga rada unutar zadanoga radnoga okruženja.</div>
				<BaseDivider></BaseDivider>
				<div class="text-xl mb-2">Prijava na praksu</div>

				<ol class="list-decimal ml-4">
					<li>
						Studenti se prijavljuju na praksu putem sustava
						<em>Fipu Praksa</em> u kojem prvo odabiru 3 zadatka koja bi željeli raditi.
					</li>
					<li>Nakon što vas se alocira na jedan od prijavljenih zadataka, morate kontaktirati mentora. Predstavite se i recite da ste dobili zadatak. Poslodavac može zatražiti intervju ili provesti selekciju.</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="text-xl mb-2">Izvođenje prakse</div>
				<ol class="list-decimal ml-4">
					<li>Potrebno je s mentorom dogovoriti datum počekta izvođenja prakse. Kada sve finalno dogovorite s mentorom popunite Prijavnicu prije početka izvođenja prakse</li>
					<li>Na mail ćete vi i mentor dobiti praznu Potvrdu o obavljenoj praksi. Mora ju ispuniti <b>mentor</b>.</li>
					<li>Uživajte u izvođenju prakse 🙂! Have fun i učite! Nemojte zaboraviti svakodnevno voditi dnevnik!</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="text-xl mb-2">Završetak prakse i prijava ispita</div>
				<ol class="list-decimal ml-4">
					<li>Nakon što završite sa stručnom praksu potrebno je predati dnevnik.</li>
					<li>
						Za kraj, potrebno je prijaviti ispit preko Studomata. Na ispit
						<b>ne morate</b> dolaziti, samo ga prijavite.
					</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="text-xl mb-2">Sustav <em>Fipu praksa</em></div>
				<ol class="list-decimal ml-4">
					<li>
						Sve radnje (uključujući komunikaciju) vezane uz praksu obavljaju se isključivo putem sustava
						<em>Fipu praksa</em>.
					</li>
					<li>
						<div class="flex flex-wrap text-base">
							Ovisno o stanju vaše prakse,
							<span class="text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center" @click="router.push('/moja-praksa') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiLaptop" class="flex-none align-middle" :size="18"></BaseIcon>
								Moja praksa
							</span>
							&nbsp;se ažurira automatski.
						</div>
					</li>
					<li>Putem iste poveznice predajete dnevnik prakse, dok prijavnicu dobivate na mail.</li>
					<li>
						<div class="flex flex-wrap text-base">
							Komunikaciju s profesorom vršite putem
							<span class="text-fipu_blue cursor-pointer inline-flex whitespace-normal items-center" @click="router.push('/poruke') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiEmail" class="flex-none align-middle" :size="18"></BaseIcon>
								Poruke </span
							>.
						</div>
					</li>
				</ol>
				<BaseDivider></BaseDivider>
			</CardBoxModal>

			<AsideMenu :menu="menuAside" @menu-click="menuClick" />
			<div class="grow relative">
				<slot></slot>
			</div>
			<div class="mt-6">
				<FooterBar
					><br />
					Made with <span style="color: #e25555">&#9829;</span> at FIPU.lab</FooterBar
				>
			</div>
			<SnackBar />
		</div>
	</div>
</template>
