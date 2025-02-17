<script setup>
import {
	mdiBallot,
	mdiCalendarRange,
	mdiChatQuestionOutline,
	mdiLogin,
	mdiAlphaACircle,
	mdiNewBox,
	mdiAlphaBCircle,
	mdiEmail,
	mdiInformation,
	mdiClipboardText,
	mdiLaptop,
	mdiDomain,
	mdiMapMarker,
	mdiClipboardTextClockOutline,
	mdiAccountGroup,
	mdiSchool,
	mdiTextLong,
	mdiXml,
	mdiThumbsUpDown,
	mdiClockTimeFiveOutline,
	mdiNoteTextOutline,
} from "@mdi/js";
import { ref, reactive, onMounted, watch, computed } from "vue";
import SectionMain from "@/components/Section/SectionMain.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import BaseButton from "@/components/Base/BaseButton.vue";
import SnackBar from "@/components/Premium/SnackBar.vue";
import FooterBar from "@/components/FooterBar.vue";

import CardBox from "@/components/Cardbox/CardBox.vue";

import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";
import FormCheckRadioGroup from "@/components/Form/FormCheckRadioGroup.vue";
import FormCombobox from "@/components/Form/FormCombobox.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import FormField from "@/components/Form/FormField.vue";

import { required, email, helpers } from "@vuelidate/validators";
import { getFirstErrorForField } from "@/helpers/validators";
import { useVuelidate } from "@vuelidate/core";

import IconTextLink from "@/components/IconTextLink.vue";

import Utils from "@/helpers/utils";

import { mainStore, snackBarStore } from "@/main.js";

import FIPU_praksa_logo_transparent from "/FIPU_praksa_logo_transparent.svg";

import BaseIcon from "@/components/Base/BaseIcon.vue";

import { router } from "@/router";

const isLoading = ref(false);
const triggered = ref(false);

const allCompanies = ref([]);
const mappedCompanies = ref([]);

onMounted(async () => {
	let results = await mainStore.fetchCompanies();
	allCompanies.value = results;

	mappedCompanies.value = allCompanies.value.map((items, index) => ({
		id: index + 1,
		label: items.naziv,
	}));
});
</script>

<template>
	<div>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiLaptop" title="FIPU Praksa" main>
				<a href="https://fipu-praksa.unipu.hr/" target="_blank">
					<img :src="FIPU_praksa_logo_transparent" class="max-h-14 object-contain" />
				</a>
			</SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> doc. dr. sc. Ivan Lorencin</p>

			<hr />
			<br />

			<SectionTitleLineWithButton :icon="mdiInformation" main title="O praksi"></SectionTitleLineWithButton>
			<p>
				Zahvaljujući izvrsnoj suradnji i kontinuiranom angažmanu, studentska praksa na <a href="https://fipu.unipu.hr/" target="_blank" class="text-fipu_blue"> Fakultetu informatike u Puli </a>već se dugi niz godina uspješno provodi. Ovaj oblik
				praktične nastave omogućava studentima stjecanje vrijednih iskustava i vještina izvan učionice, pružajući im priliku za primjenu stečenog znanja u stvarnim poslovnim situacijama.
			</p>
			<br />

			<p>Studentima je ovo izborni kolegij i oni koji su prijavljeni, motivirani su i spremni za rad!</p>
			<br />
			<p>
				Kako bismo stvarili učinili jednostavnijima, proces izvođenja prakse odlučili smo automatizirati kroz novu aplikaciju <a href="https://fipu-praksa.unipu.hr/" class="text-fipu_blue" target="_blank">FIPU Praksa</a>. Ova aplikacija rezultat je
				istraživačkog rada te suradnje između studenata i profesora na Fakultetu informatike u Puli. Temelji se na eksperimentalnom razvoju baziranom na procesnim modelima (BPMN).
			</p>

			<SectionTitleLineWithButton :icon="mdiChatQuestionOutline" title="Komunikacija"></SectionTitleLineWithButton>

			<p>Studenti, imate pitanja vezana uz izvođenje prakse, sva komunikacija odvija se na <a href="https://chat.google.com/" target="_blank" class="text-fipu_blue">Google Chat</a> kanalu: <b>FIPU 2024/25 Stručna praksa</b></p>

			<p class="mt-1">Poslodavci i mentori, za sve upite kontaktirajte voditelja stručne prakse.</p>

			<SectionTitleLineWithButton :icon="mdiCalendarRange" title="Važni datumi"></SectionTitleLineWithButton>
			<p>Za studente koji su upisali Stručnu praksu na prijediplomskom ili diplomskom studiju:</p>
			<ul class="ml-8 list-disc">
				<li>Najraniji datum početka izvođenja stručne prakse - <b> 14. listopad 2024.</b></li>
				<li>Najkasniji datum završetka - <b> 15. rujna 2025.</b></li>
			</ul>
			<br />
			<p>Za sve dodatne informacije kontaktirajte voditelja stručne prakse na FIPU.</p>
			<br />

			<div class="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
				<div class="flex flex-wrap">
					<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
						<div class="flex items-start">
							<div class="shrink-0">
								<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
									<a href="https://fipu.unipu.hr/fipu/ivan.lorencin" target="_blank"><img class="rounded-full" src="https://fipu.unipu.hr/images/users_profiles/Ivan-Lorencin.jpg" alt="Ivan Lorencin" /></a>
								</div>
							</div>
							<div class="ml-3 grow">
								<p class="mb-2 font-bold dark:text-white">doc. dr. sc. Ivan Lorencin</p>
								<p class="text-neutral-500 dark:text-neutral-200">ivan.lorencin@unipu.hr</p>
								<p class="text-neutral-500 dark:text-neutral-200">+385 98 96 12 042</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<hr class="mb-4" />
			<p>
				Postoje dva pristupa za obavljanje prakse: (<b>Model A</b>) ukoliko ste u potrazi za poslodavcem, i (<b>Model B</b>) ako već imate dogovorenu tvrtku kod koje ćete obavljati praktični dio. Studenti moraju prilikom prve prijave u aplikaciji
				odabrati model prakse koji će izvoditi.
			</p>
			<br />
			<SectionTitleLineWithButton :icon="mdiAlphaACircle" main title="Model A"> </SectionTitleLineWithButton>
			<h2 class="my-2 text-xl font-bold underline">Student nema ugovorenu tvrtku</h2>

			<ol class="mb-6 ml-8 flex list-decimal flex-col space-y-4">
				<li>Prijava u aplikaciju FIPU Praksa. Potrebno se prijaviti UNIPU računom i odabrati izvođenje prakse po <b> Modelu A</b> (bez ugovorene tvrtke).</li>
				<li>
					Pogledati dostupne zadatke
					<div class="inline-flex">na <IconTextLink :to="'/moja-praksa'" :icon="mdiLaptop" :text="'Moja praksa'"></IconTextLink>.</div>
					<ul class="ml-8 list-disc">
						<li>
							<div class="">Odaberite 3 zadatka po želji i prijavite preferencije (1. odabir | 2. odabir | 3. odabir)</div>
						</li>
						<li>
							Ukoliko želite specifično poduzeće koje nije na listi, javite im da popune zadatak
							<div class="inline-flex">na <IconTextLink :to="'/poslodavci/novi-zadatak'" :icon="mdiNewBox" :text="'Prijava zadatka'"></IconTextLink></div>
						</li>
					</ul>
				</li>
				<li>
					Molimo vas da pričekate dodjelu zadatka od strane voditelja. Voditelj će vam dodijeliti jedan od odabranih zadataka ili će zatražiti da odaberete nove preferencije. Ukoliko ne dobijete odgovor u roku od 10 dana, preporučujemo da
					kontaktirate voditelja. O konačnom izboru bit ćete obaviješteni putem e-maila.
				</li>
				<li>
					Jednom kad ste alocirani na zadatak, vi i poslodavac bit ćete obaviješteni putem e-maila. Kontaktirajte mentora sa zadatka na koji ste alocirani i recite da ste dobili zadatak za obavljanje studentske prakse, po potrebi obavite intervju ili
					drugi oblik selekcije, ako to poslodavac traži.
				</li>
				<li>Jednom kad poslodavac donese odluku, istu <b></b> mora evidentirati putem poveznice na e-mailu koji dobiva. Ako poslodavac ne može pronaći e-mail, molimo da kontaktirate voditelja prakse.</li>
				<li>
					Dogovorite s poslodavcem detalje uključujući period izvršavanja prakse.
					<ul class="ml-8 list-disc">
						<li>
							Nakon što dogovorite sve detalje, ispunite Prijavnicu<b> prije</b> početka izvođenja prakse
							<span class="inline-flex">na <IconTextLink :to="'/moja-praksa'" :icon="mdiLaptop" :text="'Moja praksa'"></IconTextLink></span>
						</li>
					</ul>
				</li>
				<li>Nakon što ispunite Prijavnicu, mentor kojeg ste naveli i vi dobivate na e-mail praznu “Potvrdu o obavljenoj praksi“, <strong>Vaš mentor ju mora ispuniti nakon što završite s praksom</strong>.</li>
				<ul class="ml-8 list-disc">
					<li>Uživajte u izvođenju prakse :) Have fun i učite! 🚀 Ali, nemojte zaboraviti svakodnevno voditi dnevnik!</li>
					<li>Ovaj kolegij pruža vam priliku da sami oblikujete svoje iskustvo, obogatite ga novim i zanimljivim znanjima te steknete vrijedne kontakte i poznanstva iz industrije. Potencijal je velik, iskoristite ga!</li>
				</ul>
				<li>Kada ste završili s praksom, zatražite od mentora da ispuni ”Potvrdu o obavljenoj praksi” te ju predajte, zajedno s dnevnikom prakse u aplikaciji na istoj poveznici. Morate navesti i datum ispitnog roka.</li>
				<li>Prijavite ispitni rok na Studomatu, ocjena se unosi automatski, jednom kad voditelj pregleda vaš Dnevnik, ne morate dolaziti na ispit.</li>
				<li>Uspješno ste odradili stručnu praksu! Čestitamo! 🎊</li>
			</ol>

			<SectionTitleLineWithButton :icon="mdiAlphaBCircle" main title="Model B"></SectionTitleLineWithButton>

			<h2 class="my-2 text-xl font-bold underline">Već ugovorena/obavljena praksa (u dogovoru s voditeljem!)</h2>

			<ol class="mb-6 ml-8 flex list-decimal flex-col space-y-4">
				<li>Odrađujete dogovor s voditeljem prakse i poduzećem. Model B prijavljujete u situacijama kada:</li>
				<ul class="ml-8 list-disc">
					<li>
						<div class="">već radite u poduzeću ili</div>
					</li>
					<li>već ste odradili praksu u poduzeću ili</li>
					<li>već imate nekakav dogovor s poduzećem</li>
				</ul>
				<li><b>Obavezno morate obavijestiti voditelja</b> prakse o dogovorenom načinu izvedbe.</li>
				<li>Jednom kada to učinite, prijavite se u aplikaciju FIPU Praksa i odaberite izvođenje prakse po <b> Modelu B</b></li>
				<li>Prijavite poduzeće i zadatak, idealno to čini mentor iz poduzeća</li>
				<ul class="ml-8 list-disc">
					<li>
						Zadatak prijavljujete
						<div class="inline-flex">na <IconTextLink :to="'/poslodavci/novi-zadatak'" :icon="mdiNewBox" :text="'Prijava zadatka'"></IconTextLink></div>
					</li>
					<li>Ako poduzeće nije do sada surađivalo sa Sveučilištem, potrebno je realizirati Ugovor o stručnoj praksi između Sveučilišta i Poduzeća. Javite se voditelju prakse za predložak ugovora.</li>
					<li>
						Svakako provjerite je li poduzeće već potpisalo ugovor, prijavite se u aplikaciju FIPU Praksa i odaberite
						<div class="inline-flex">na <IconTextLink Link :to="'/poslodavci'" :icon="mdiDomain" :text="'Poslodavci'"></IconTextLink></div>
					</li>
				</ul>
				<li>
					<b>Nakon što voditelj prakse odobri zadatak</b>, direktno se prijavite na njega kroz aplikaciju
					<div class="inline-flex">na <IconTextLink :to="'/moja-praksa'" :icon="mdiLaptop" :text="'Moja praksa'"></IconTextLink></div>
				</li>
				<li>
					Ispunite Prijavnicu
					<span class="inline-flex">na <IconTextLink :to="'/moja-praksa'" :icon="mdiLaptop" :text="'Moja praksa'"></IconTextLink></span>
				</li>
				<li>Nakon što ispunite Prijavnicu, mentor kojeg ste naveli i vi dobivate na e-mail praznu “Potvrdu o obavljenoj praksi“, <strong>Vaš mentor ju mora ispuniti nakon što završite s praksom</strong>.</li>
				<ul class="ml-8 list-disc">
					<li>Uživajte u izvođenju prakse :) Have fun i učite! 🚀 Ali, nemojte zaboraviti svakodnevno voditi dnevnik!</li>
					<li>Ovaj kolegij pruža vam priliku da sami oblikujete svoje iskustvo, obogatite ga novim i zanimljivim znanjima te steknete vrijedne kontakte i poznanstva iz industrije. Potencijal je velik, iskoristite ga!</li>
				</ul>
				<li>Kada ste završili s praksom, zatražite od mentora da ispuni ”Potvrdu o obavljenoj praksi” te ju predajte, zajedno s dnevnikom prakse u aplikaciji na istoj poveznici. Morate navesti i datum ispitnog roka.</li>
				<li>Prijavite ispitni rok na Studomatu, ocjena se unosi automatski, jednom kad voditelj pregleda vaš Dnevnik, ne morate dolaziti na ispit.</li>
				<li>Uspješno ste odradili stručnu praksu! Čestitamo! 🎊</li>
			</ol>
		</SectionMain>
		<FooterBar
			><br />
			Made with <span style="color: #e25555">&#9829;</span> at <a :href="mainStore.fipulab_web" target="_blank" class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue">FIPUlab</a></FooterBar
		>
		<SnackBar />
	</div>
</template>

<style></style>
