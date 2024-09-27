<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu, mdiMagnify, mdiLaptop, mdiEmail, mdiAccountMultiple, mdiClipboardCheck, mdiDomain, mdiClipboardText } from "@mdi/js";
import { mainStore, styleStore } from "@/main.js";
import { ref, onMounted, computed } from "vue";

import AsideMenu from "@/components/AsideMenu/AsideMenu.vue";
import menuAsideAdmin from "@/menus/menuAsideAdmin.js";

import menuAsideStudent from "@/menus/menuAsideStudent.js";
import menuNavBar from "@/menus/menuNavBar.js";

import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import NavBar from "@/components/Navbar/NavBar.vue";
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
		<div :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': layoutStore.isAsideMobileExpanded }]" class="flex min-h-screen w-screen flex-col bg-gray-50 pt-14 transition-position dark:bg-slate-800 dark:text-slate-100 lg:w-auto">
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

			<CardBoxModal v-model="logoutModalActive" has-cancel is-logout title="Jeste li sigurni da se želite odjaviti?" button-label="Odjava" class="z-100" @cancel="mainStore.activateLogoutModal(false)" @confirm="mainStore.logout()"> </CardBoxModal>

			<CardBoxModal v-if="!mainStore.userAdmin" v-model="helpModalActive" has-cancel :has-confirm="false" title="ℹ️ Upute za korištenje aplikacije" button-label="Povratak" @cancel="mainStore.activateHelpModal(false)">
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">O kolegiju</div>
				<div>Cilj kolegija <b>Stručna praksa</b> je omogućiti studentima praktični rad u IT poduzećima na projektima oblikovanja i implementacije programske podrške; usvajanja stručnih kompetencija iz područja djelovanja organizacije u kojoj se praksa provodi te razvijanje osjećaja odgovornosti i timskoga rada unutar zadanoga radnoga okruženja.</div>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Prijava na praksu</div>

				<ol class="ml-4 list-decimal">
					<li>
						Studenti se prijavljuju na praksu putem aplikacije
						<em>FIPU Praksa</em> u kojem prvo odabiru 3 zadatka koja bi željeli raditi.
					</li>
					<li>Nakon što vas se alocira na jedan od prijavljenih zadataka, morate kontaktirati mentora. Predstavite se i recite da ste dobili zadatak. Poslodavac može zatražiti intervju ili provesti selekciju.</li>
					<li>Profesor može i odbiti zadatke koje ste odabrali te vas vratiti na početni korak odabira preferencija, ili vas može alocirati na neko 4. poduzeće ukoliko smatra da je to potrebno.</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Izvođenje prakse</div>
				<ol class="ml-4 list-decimal">
					<li>Potrebno je s mentorom dogovoriti datum počekta izvođenja prakse. Kada sve finalno dogovorite s mentorom popunite Prijavnicu putem aplikacije <b>prije početka izvođenja prakse</b>.</li>
					<li>
						<div class="flex flex-wrap text-base">
							Niste dobili email? Javite se profesoru putem
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/poruke') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiEmail" class="flex-none align-middle" :size="18"></BaseIcon>
								Poruke </span
							>.
						</div>
					</li>
					<li>Nakon ispunjavanja prijavnice, na mail ćete vi i mentor dobiti praznu Potvrdu. Mora ju ispuniti <b>mentor</b> i to po završetku odrađenog posla.</li>
					<li>Uživajte u izvođenju prakse 🙂 Have fun i učite! Nemojte zaboraviti svakodnevno voditi Dnevnik!</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Završetak prakse i prijava ispita</div>
				<ol class="ml-4 list-decimal">
					<li>Nakon što završite sa stručnom praksu potrebno je predati Dnevnik, također putem aplikacije.</li>
					<li>
						Za kraj, potrebno je prijaviti ispit preko Studomata. Na ispit
						<b>ne morate</b> dolaziti, samo ga prijavite.
					</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Aplikacija <em>FIPU praksa</em></div>
				<ol class="ml-4 list-decimal">
					<li>
						Sve radnje (uključujući komunikaciju) vezane uz praksu obavljaju se isključivo putem aplikacije
						<em>FIPU praksa</em>.
					</li>
					<li>
						<div class="flex flex-wrap text-base">
							Ovisno o stanju vaše prakse,
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/moja-praksa') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiLaptop" class="flex-none align-middle" :size="18"></BaseIcon>
								Moja praksa
							</span>
							&nbsp;se ažurira automatski.
						</div>
					</li>
					<li>Putem iste poveznice predajete dnevnik prakse, dok prijavnicu dobivate na vaš email.</li>
					<li>
						<div class="flex flex-wrap text-base">
							Komunikaciju s profesorom vršite putem
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/poruke') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiEmail" class="flex-none align-middle" :size="18"></BaseIcon>
								Poruke </span
							>.
						</div>
					</li>
				</ol>
				<BaseDivider></BaseDivider>
				<p><b>Važno!</b> Aplikacija <em>FIPU Praksa</em> razvijena je 2023. godine u sklopu istraživačkog laboratorija FIPU-lab za potrebe pojednostavljenja i automatizacije procesa izvođenja studentske prakse, za studente, voditelja te poslodavce.</p>
				<p class="mt-2">Aplikacija je razvijena eksperimentalnim BPMN model-based development-om i integracijom mikroservisa te je, kao i svaki drugi programski proizvod, podložna bugovima🐞!</p>
				<p class="mt-2">Stoga vas molimo da sve bugove koje pronađete prijavite otvaranjem novog Github issue-a, <a class="hover-underline-animation cursor-pointer text-fipu_text_blue" target="_blank" href="https://github.com/lukablaskovic/fipu-internship-frontend/issues">ovdje!</a></p>
				<p class="mt-2">Hvala! 🙂</p>
			</CardBoxModal>

			<CardBoxModal v-else v-model="helpModalActive" has-cancel :has-confirm="false" title="ℹ️ Upute za korištenje aplikacije" button-label="Povratak" @cancel="mainStore.activateHelpModal(false)">
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">O kolegiju</div>
				<div>Cilj kolegija <b>Stručna praksa</b> je omogućiti studentima praktični rad u IT poduzećima na projektima oblikovanja i implementacije programske podrške; usvajanja stručnih kompetencija iz područja djelovanja organizacije u kojoj se praksa provodi te razvijanje osjećaja odgovornosti i timskoga rada unutar zadanoga radnoga okruženja.</div>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Prijava na praksu</div>

				<ol class="ml-4 list-decimal">
					<li>
						Studenti se prijavljuju na praksu putem aplikacije
						<em>FIPU Praksa</em> u kojem prvo odabiru 3 zadatka koja bi željeli raditi.
					</li>
					<li>
						<div class="flex flex-wrap text-base">
							Studente možete alocirati putem
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/studenti') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiAccountMultiple" class="flex-none align-middle" :size="18"></BaseIcon>
								Studenti </span
							>.
						</div>
					</li>
					<li>Nakon odabira studenta, odaberite "Alociranje studenta na zadatak" na BPMN grafu. Nakon toga odaberite zadatak i potvrdite.</li>

					<li>Možete i odbiti preferencije nakon čega se studenta vraća na početni korak.</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Dashboard</div>
				<ol class="ml-4 list-decimal">
					<li>Dashboard se trenutno sastoji od 2 dijela - <b>Nadzorna ploča</b>, gdje možete vidjeti općenite numeričke podatke o izvođenju prakse, te <b>Najnoviji događaji</b>, gdje se nalaze event logovi iz BPMN engine-a</li>
					<li>Možete stisnuti na pojedini event log, što će vas odnijeti na studenti/:id gdje je id jednak instanci tog procesa prakse za tog studenta</li>
					<li>Tražilicu možete otvoriti pritiskom <b>CTRL + k</b>. Običnim upisivanjem možete brzo prelaziti kroz stranice aplikacije, a prefiksima (ispisani su u uputama tražilice) mogu se tražiti određene stavke, poput studenata po JMBAGU, emailu, ili poduzeća.</li>
				</ol>

				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Alokacije</div>
				<ol class="ml-4 list-decimal">
					<li>
						<div class="flex flex-wrap text-base">
							Alokacije možete provjeriti u
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/alokacije') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiClipboardCheck" class="flex-none align-middle" :size="18"></BaseIcon>
								Alokacije </span
							>.
						</div>
					</li>
					<li>Postoji nekoliko stanja alokacija: <em>student_prihvaćen</em>, <em>student_odbijen</em>, <em>evaluacija_u_tijeku</em>, <em>student_odustao</em>, <em>profesor_ponistio</em>.</li>
					<li>U alokaciji se za sada prikazuju: <em>student_prihvaćen</em>, <em>evaluacija_u_tijeku</em> <em>te student_odbijen</em>.</li>
					<li>Možete za svakog studenta pregledati dnevnik prakse te poslanu prijavnicu.</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Poslodavci</div>
				<ol class="ml-4 list-decimal">
					<li>
						<div class="flex flex-wrap text-base">
							Sve prijavljene poslodavce možete pronaći u
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/poslodavci') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiDomain" class="flex-none align-middle" :size="18"></BaseIcon>
								Poslodavci </span
							>.
						</div>
					</li>
					<li>Poslodavci su podijeljeni u 2 tablice: <b>Novi Poslodavci</b> i <b>Svi Poslodavci</b>. Tablica Novi Poslodavci će prikazivati nove retke nakon što novo poduzeće (koje još nije partner) prijavi zadatak.</li>
					<li>Tada je potrebno ručno unijeti podatke o poduzeću</li>
					<li>Podatke o poslodavcu je moguće i direktno ažurirati Baserowu.</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Dostupni Zadaci</div>
				<ol class="ml-4 list-decimal">
					<li>
						<div class="flex flex-wrap text-base">
							Novo-prijavljene zadatke možete pronaći u
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/dostupni-zadaci') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiClipboardText" class="flex-none align-middle" :size="18"></BaseIcon>
								Dostupni zadaci </span
							>.
						</div>
					</li>
					<li>Tu možete vidjeti podjelu na <b>Novi Zadaci</b>, <b>Aktivni Zadaci</b> te <b>Odbijeni Zadaci</b>.</li>
					<li>Zadatak novog partnera je moguće odobriti i prije ažuriranja podataka novog poduzeća.</li>
					<li>Na ovoj stranici također možete pronaći javni link koji se proslijeđuje poslodavcima za prijavu novog zadatka.</li>
				</ol>
				<BaseDivider></BaseDivider>
				<p><b>Važno!</b> Aplikacija <em>Fipu Praksa</em> razvijena je 2023. godine u sklopu istraživačkog laboratorija FIPU-lab za potrebe pojednostavljenja i automatizacije procesa izvođenja studentske prakse, za studente, voditelja te poslodavce.</p>
				<p class="mt-2">Aplikacija je razvijena eksperimentalnim BPMN model-based development-om i integracijom mikroservisa te je, kao i svaki drugi programski proizvod, podložna bugovima🐞!</p>
				<p class="mt-2">Stoga vas molimo da sve bugove koje pronađete prijavite otvaranjem novog Github issue-a, <a class="hover-underline-animation cursor-pointer text-fipu_text_blue" target="_blank" href="https://github.com/lukablaskovic/fipu-internship-frontend/issues">ovdje!</a></p>
				<p class="mt-2">Hvala! 🙂</p>
			</CardBoxModal>

			<AsideMenu :menu="menuAside" @menu-click="menuClick" />
			<div class="relative grow">
				<slot></slot>
			</div>
			<div class="mt-6">
				<FooterBar
					><br />
					Made with <span style="color: #e25555">&#9829;</span> at <a :href="mainStore.fipulab_web" target="_blank" class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue">FIPU Lab</a></FooterBar
				>
			</div>
			<SnackBar />
		</div>
	</div>
</template>
<style>
.hover-underline-animation {
	position: relative;
}

.hover-underline-animation:after {
	content: "";
	position: absolute;
	width: 100%;
	transform: scaleX(0);
	height: 2px;
	bottom: 0;
	left: 0;
	background-color: #9de0f7;
	transform-origin: bottom right;
	transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover:after {
	transform: scaleX(1);
	transform-origin: bottom left;
}
</style>
