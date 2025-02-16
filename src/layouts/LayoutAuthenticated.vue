<script setup>
import { mdiForwardburger, mdiChartTimeline, mdiInformation, mdiBackburger, mdiMenu, mdiMagnify, mdiLaptop, mdiEmail, mdiAccountMultiple, mdiClipboardCheck, mdiDomain, mdiClipboardText } from "@mdi/js";
import { mainStore, styleStore } from "@/main.js";
import { ref, onMounted, computed } from "vue";

import AsideMenu from "@/components/AsideMenu/AsideMenu.vue";
import menuAsideAdmin from "@/menus/menuAsideAdmin.js";

import menuAsideStudent from "@/menus/menuAsideStudent.js";
import menuNavBar from "@/menus/menuNavBar.js";

import NavBarItemPlain from "@/components/Navbar/NavBarItemPlain.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import IconTextLink from "@/components/IconTextLink.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import NavBar from "@/components/Navbar/NavBar.vue";
import FooterBar from "@/components/FooterBar.vue";

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
				<NavBarItemPlain use-margin v-if="mainStore.userAdmin">
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

				<ol class="ml-8 list-disc">
					<li>Studenti na početku biraju model prakse (A ili B) te se prijavljuju putem aplikacije <em>FIPU Praksa</em>.</li>
					<li><b>Proces A</b>: Studenti biraju 3 preferencije, odnosno zadataka koje bi željeli odraditi. Voditelj prakse vas može alocirati na jedan od tih zadataka ili vratiti na početni korak odabira preferencija.</li>
					<li><b>Proces B</b>: Student unaprijed dogovara s poslodavcem i voditeljem prakse kako će istu izvoditi, nakon toga poslodavac prijavljuje zadatak, a student se prijavljuje direktno.</li>
					<li>
						Detaljan opis svakog od procesa možete pronaći
						<div class="inline-flex">na <IconTextLink :to="'/upute'" :icon="mdiInformation" :text="'Upute'" @click="mainStore.activateHelpModal(false)"></IconTextLink>.</div>
					</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Izvođenje prakse</div>
				<ol class="ml-8 list-decimal">
					<li>Potrebno je s mentorom dogovoriti datum počekta izvođenja prakse. Kada sve finalno dogovorite s mentorom popunite Prijavnicu putem aplikacije <b>prije početka izvođenja prakse</b>.</li>
					<li>
						<div class="flex flex-wrap text-base">Niste dobili email? Javite se voditelju prakse putem maila ili Google Chata.</div>
					</li>
					<li>Nakon ispunjavanja prijavnice, na mail ćete vi i mentor dobiti praznu Potvrdu. Mora ju ispuniti <b>mentor</b> i to po završetku odrađenog posla.</li>
					<li>Uživajte u procesu učenja! 🙂 Ovaj kolegij pruža vam priliku da sami oblikujete svoje iskustvo, obogatite ga novim i zanimljivim znanjima te stvorite vrijedne kontakte s poduzećima. Potencijal je velik, iskoristite ga!</li>
				</ol>
				<BaseDivider></BaseDivider>

				<div class="mb-2 text-xl">Završetak prakse i prijava ispita</div>
				<ol class="ml-8 list-decimal">
					<li>Nakon što završite sa stručnom praksu potrebno je predati Dnevnik, također putem aplikacije.</li>
					<li>
						Za kraj, potrebno je prijaviti ispit preko Studomata. Na ispit
						<b>ne morate</b> dolaziti, samo ga prijavite.
					</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Aplikacija <em>FIPU praksa</em></div>
				<ol class="ml-8 list-decimal">
					<li>
						Sve radnje (izuzev komunikacije) vezane uz praksu obavljaju se isključivo putem aplikacije
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
					<li>
						BPMN graf koji predstavlja stanje vaše prakse možete vidjeti
						<div class="inline-flex">na <IconTextLink :to="'/stanje-procesa'" :icon="mdiChartTimeline" :text="'Stanje procesa'" @click="mainStore.activateHelpModal(false)"></IconTextLink>.</div>
					</li>
					<li>
						<div class="flex flex-wrap text-base">Komunikaciju s voditeljem prakse vodite putem Google Chata</div>
					</li>
				</ol>
				<BaseDivider></BaseDivider>
				<p><b>Final thought:</b> Aplikacija <em>FIPU Praksa</em> u aktivnom je razvoju od 2023. godine u sklopu istraživačkog laboratorija FIPUlaba za potrebe pojednostavljenja i automatizacije procesa izvođenja studentske prakse, za studente, voditelja te poslodavce.</p>
				<p class="mt-2">Ova aplikacija bazira se na eksperimentalnom razvoju baziranom na procesima koji su definirani BPMN nomenklaturom i Python <i>enginom</i> koji pogoni aplikaciju u pozadini. Kao i svaki drugi proizvod, i ovaj je podložan bugovima 🐞!</p>
				<p class="mt-2">Stoga vas molimo da sve bugove koje pronađete prijavite otvaranjem novog Github <i> issuea</i>, <a class="hover-underline-animation cursor-pointer text-fipu_text_blue" target="_blank" href="https://github.com/lukablaskovic/fipu-internship-frontend/issues">ovdje!</a></p>
				<p class="mt-2">Hvala! 😁</p>
			</CardBoxModal>

			<CardBoxModal v-else v-model="helpModalActive" has-cancel :has-confirm="false" title="ℹ️ Upute za korištenje aplikacije" button-label="Povratak" @cancel="mainStore.activateHelpModal(false)">
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">O kolegiju</div>
				<div>Cilj kolegija <b>Stručna praksa</b> je omogućiti studentima praktični rad u IT poduzećima na projektima oblikovanja i implementacije programske podrške; usvajanja stručnih kompetencija iz područja djelovanja organizacije u kojoj se praksa provodi te razvijanje osjećaja odgovornosti i timskoga rada unutar zadanoga radnoga okruženja.</div>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Prijava na praksu</div>

				<ol class="ml-8 list-disc">
					<li>Studenti na početku biraju model prakse (A ili B) te se prijavljuju putem aplikacije <em>FIPU Praksa</em>.</li>
					<li><b>Proces A</b>: Studenti biraju 3 preferencije, odnosno zadataka koje bi željeli odraditi. Voditelj prakse alocira studenta na jedan od zadataka ili ga vraća na početni korak odabira preferencija.</li>
					<li><b>Proces B</b>: Student unaprijed dogovara s poslodavcem i voditeljem prakse kako će istu izvoditi, nakon toga poslodavac prijavljuje zadatak, voditelj ga odobrava, a student se prijavljuje direktno.</li>
					<li>
						Detaljan opis svakog od procesa možete pronaći
						<div class="inline-flex">na <IconTextLink :to="'/upute'" :icon="mdiInformation" :text="'Upute'" @click="mainStore.activateHelpModal(false)"></IconTextLink>.</div>
					</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Dashboard</div>
				<ol class="ml-4 list-decimal">
					<li>Dashboard se trenutno sastoji od 2 dijela - <b>Nadzorna ploča</b>, gdje možete pronaći statistike o procesima prakse te <b>Najnoviji događaji</b>, gdje se prikazuju event logovi iz BPMN <i> enginea</i>.</li>
					<li>Možete stisnuti na pojedini <i> event log</i>, što će vas odnijeti na <i> studenti/:id</i> gdje je ID jednak instanci procesa prakse za tog studenta.</li>
					<li>Tražilicu možete otvoriti pritiskom kombinacije tipki <b>CTRL/OPT + k</b>. Običnim pretraživanjem možete brzo prolaziti kroz stranice aplikacije, a unosom prefiksa (navedeni su u uputama tražilice) mogu se tražiti određene stavke, poput studenata po JMBAGU, emailu, poduzeća itd.</li>
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
					<li>Trenutno, u ovom prikazu moguće je vidjeti: <em>student_prihvaćen</em>, <em>evaluacija_u_tijeku</em> <em>te student_odbijen</em>.</li>
					<li>Dodatno, možete za svakog studenta pronaći generiranu prijavnicu, popunjenu prijavnicu te dnevnik prakse.</li>
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
					<li>Poslodavci su podijeljeni u 2 tablice: <b>Novi Poslodavci</b> i <b>Svi Poslodavci</b>. U tablici <b>Novi Poslodavci</b> se prikazuju novi retci nakon što novo poduzeće (koje još nije partner) prijavi zadatak.</li>
					<li>Tada je potrebno ručno unijeti podatke o poduzeću te realizirati Ugovor o praksi s poduzećem.</li>
					<li>Podatke o poslodavcu je moguće i direktno ažurirati u <a href="https://baserow.unipu.hr/" target="_blank" class="text-fipu_blue">Baserow</a> bazi podataka</li>
				</ol>
				<BaseDivider></BaseDivider>
				<div class="mb-2 text-xl">Dostupni Zadaci</div>
				<ol class="ml-4 list-decimal">
					<li>
						<div class="flex flex-wrap text-base">
							Novoprijavljene zadatke možete pronaći u
							<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push('/dostupni-zadaci') && mainStore.activateHelpModal(false)">
								<BaseIcon :path="mdiClipboardText" class="flex-none align-middle" :size="18"></BaseIcon>
								Dostupni zadaci </span
							>.
						</div>
					</li>
					<li>Tu možete vidjeti podjelu na <b>Novi Zadaci</b>, <b>Aktivni Zadaci</b> te <b>Odbijeni Zadaci</b>.</li>
					<li>Zadatak novog partnera je moguće odobriti i prije dopunjavanja podataka o tom poduzeću (ali nije preporuka).</li>
					<li>Na ovoj stranici također možete pronaći javnu poveznicu koja se proslijeđuje poslodavcima za prijavu novog zadatka.</li>
					<li>Podatke o zadacima je moguće i direktno ažurirati u <a href="https://baserow.unipu.hr/" target="_blank" class="text-fipu_blue">Baserow</a> bazi podataka</li>
				</ol>
				<BaseDivider></BaseDivider>
				<p><b>Final thought:</b> Aplikacija <em>FIPU Praksa</em> u aktivnom je razvoju od 2023. godine u sklopu istraživačkog laboratorija FIPU za potrebe pojednostavljenja i automatizacije procesa izvođenja studentske prakse, za studente, voditelja te poslodavce.</p>
				<p class="mt-2">Ova aplikacija bazira se na eksperimentalnom razvoju baziranom na procesima koji su definirani BPMN nomenklaturom i Python <i>enginom</i> koji pogoni aplikaciju u pozadini. Kao i svaki drugi proizvod, i ovaj je podložan bugovima 🐞!</p>
				<p class="mt-2">Stoga vas molimo da sve bugove koje pronađete prijavite otvaranjem novog Github <i> issuea</i>, <a class="hover-underline-animation cursor-pointer text-fipu_text_blue" target="_blank" href="https://github.com/lukablaskovic/fipu-internship-frontend/issues">ovdje!</a></p>
				<p class="mt-2">Hvala! 😁</p>
			</CardBoxModal>

			<AsideMenu :menu="menuAside" @menu-click="menuClick" />
			<div class="relative grow">
				<slot></slot>
			</div>
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
