<script setup>
import { appConfig } from "@/config";
import { Accordion, Tabs } from "reka-ui/namespaced";
import BaseIcon from "@/components/Base/BaseIcon.vue";

import UserAvatar from "@/components/User/UserAvatar.vue";
import { mdiChevronDown, mdiCalendarRange, mdiChatQuestionOutline, mdiAlphaACircle, mdiNewBox, mdiAlphaBCircle, mdiInformation, mdiLaptop, mdiDomain } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import { ref, onMounted, computed } from "vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import IconTextLink from "@/components/IconTextLink.vue";

import { useMainStore } from "@/stores/main_store";


import FIPU_praksa_logo_transparent from "/FIPU_praksa_logo_transparent.svg";

const mainStore = useMainStore();

const userAuthenticated = computed(() => mainStore.userAuthenticated);

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
		<LayoutAuthenticated v-if="userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiLaptop" title="FIPU Praksa" main>
					<a href="https://fipu-praksa.unipu.hr/" target="_blank">
						<img :src="FIPU_praksa_logo_transparent" class="max-h-14 object-contain" />
					</a>
				</SectionTitleLineWithButton>
				<p><b>Akademska godina:</b> {{ appConfig.academicYear }}</p>
				<p><b>Voditelj:</b> doc. dr. sc. Ivan Lorencin</p>

				<hr />
				<br />

				<Accordion.Root type="single" collapsible class="mb-6 border-b border-gray-200 dark:border-slate-700">
					<Accordion.Item value="about">
						<Accordion.Header as="h2">
							<Accordion.Trigger class="group flex w-full items-center gap-3 rounded py-4 text-left text-2xl hover:text-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue dark:hover:text-sky-300">
								<BaseIcon :path="mdiInformation" size="24" aria-hidden="true" />
								<span class="grow">O praksi</span>
								<BaseIcon :path="mdiChevronDown" size="24" class="motion-safe:transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content class="reka-animated pb-6">
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
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>

				<Accordion.Root type="single" collapsible class="mb-6 border-b border-gray-200 dark:border-slate-700">
					<Accordion.Item value="communication">
						<Accordion.Header as="h2">
							<Accordion.Trigger class="group flex w-full items-center gap-3 rounded py-4 text-left text-2xl hover:text-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue dark:hover:text-sky-300">
								<BaseIcon :path="mdiChatQuestionOutline" size="24" aria-hidden="true" />
								<span class="grow">Komunikacija</span>
								<BaseIcon :path="mdiChevronDown" size="24" class="motion-safe:transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content class="reka-animated pb-6">
							<p>
								Studenti, imate pitanja vezana uz izvođenje prakse, sva komunikacija odvija se na <a href="https://chat.google.com/" target="_blank" class="text-fipu_blue">Google Chat</a> kanalu:
								<b><a href="https://chat.google.com/room/AAAASZREDy8" target="_blank" class="text-fipu_blue">FIPU Praksa</a></b>
							</p>

							<p class="mt-1">Poslodavci i mentori, za sve upite kontaktirajte administratoricu ili voditelja stručne prakse.</p>
							<b>Kolegij "Stručna praksa" ne koristi klasični Merlin e-kolegij.</b>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>

				<SectionTitleLineWithButton :icon="mdiCalendarRange" title="Važni datumi"></SectionTitleLineWithButton>
				<p>Za studente koji su upisali Stručnu praksu na prijediplomskom ili diplomskom studiju:</p>
				<ul class="ml-8 list-disc">
					<li>Najraniji datum početka izvođenja stručne prakse - <b> 14. listopad 2025.</b></li>
					<li>Najkasniji datum završetka - <b> 15. rujna 2026.</b></li>
				</ul>
				<br />
				<p>Za sve dodatne informacije kontaktirajte administratore ili voditelja stručne prakse.</p>
				<br />

				<div class="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
					<div class="flex flex-wrap">
						<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
							<div class="flex items-start">
								<div class="shrink-0">
									<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
										<a href="https://fipu.unipu.hr/fipu/ivan.lorencin" target="_blank"><UserAvatar class="h-16 w-16" avatar="https://fipu.unipu.hr/images/users_profiles/Ivan-Lorencin.jpg" username="Ivan Lorencin" /></a>
									</div>
								</div>
								<div class="ml-3 grow">
									<p class="mb-2 font-bold dark:text-white">doc. dr. sc. Ivan Lorencin (voditelj)</p>
									<p class="text-neutral-500 dark:text-neutral-200">ivan.lorencin@unipu.hr</p>
									<p class="text-neutral-500 dark:text-neutral-200">+385 98 96 12 042</p>
									<p class="text-neutral-500 dark:text-neutral-200">ili preko UNIPU Google Chata</p>
								</div>
							</div>
						</div>
						<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
							<div class="flex items-start">
								<div class="shrink-0">
									<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
										<a href="https://fipu.unipu.hr/fipu/marijela.milicevic" target="_blank"
											><UserAvatar class="h-16 w-16" avatar="https://i1.rgstatic.net/ii/profile.image/11431281279391644-1727018247353_Q512/Marijela-Milicevic-2.jpg" username="Marijela Miličević" /></a>
									</div>
								</div>
								<div class="ml-3 grow">
									<p class="mb-2 font-bold dark:text-white">Marijela Miličević, mag. educ. inf. (administratorica)</p>
									<p class="text-neutral-500 dark:text-neutral-200">marijela.milicevic@unipu.hr</p>
									<p class="text-neutral-500 dark:text-neutral-200">ili preko UNIPU Google Chata</p>
								</div>
							</div>
						</div>
						<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
							<div class="flex items-start">
								<div class="shrink-0">
									<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
										<a href="https://fipu.unipu.hr/fipu/luka.blaskovic" target="_blank"><UserAvatar class="h-16 w-16" avatar="https://fipu.unipu.hr/images/users_profiles/1748527029profile_main.jpg" username="Luka Blašković" /></a>
									</div>
								</div>
								<div class="ml-3 grow">
									<p class="mb-2 font-bold dark:text-white">Luka Blašković, mag. inf. (tehnička podrška)</p>
									<p class="text-neutral-500 dark:text-neutral-200">luka.blaskovic@unipu.hr</p>
									<p class="text-neutral-500 dark:text-neutral-200">ili preko UNIPU Google Chata</p>
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
				<Tabs.Root default-value="A" class="mt-2">
					<Tabs.List aria-label="Upute po modelu prakse" class="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-white p-1 dark:bg-slate-900">
						<Tabs.Trigger value="A" class="instructions-tab">
							<span class="font-semibold">Model A</span>
							<span class="text-sm">Tražim poslodavca</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="B" class="instructions-tab">
							<span class="font-semibold">Model B</span>
							<span class="text-sm">Imam dogovorenu tvrtku</span>
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="A" class="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue">
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
								Jednom kad ste alocirani na zadatak, vi i poslodavac bit ćete obaviješteni putem e-maila. Kontaktirajte mentora sa zadatka na koji ste alocirani i recite da ste dobili zadatak za obavljanje studentske prakse, po potrebi obavite intervju
								ili drugi oblik selekcije, ako to poslodavac traži.
							</li>
							<li>Jednom kad poslodavac donese odluku, isto <b></b> mora evidentirati putem poveznice na e-mailu koji dobiva. Ako poslodavac ne može pronaći e-mail, molimo da kontaktirate voditelja prakse.</li>
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
					</Tabs.Content>
					<Tabs.Content value="B" class="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue">
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
									<div class="inline-flex"><IconTextLink :to="'/poslodavci'" :icon="mdiDomain" :text="'Poslodavci'"></IconTextLink></div>
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
					</Tabs.Content>
				</Tabs.Root>
			</SectionMain>
		</LayoutAuthenticated>

		<LayoutGuest v-else>
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiLaptop" title="FIPU Praksa" main>
					<a href="https://fipu-praksa.unipu.hr/" target="_blank">
						<img :src="FIPU_praksa_logo_transparent" class="max-h-14 object-contain" />
					</a>
				</SectionTitleLineWithButton>
				<p><b>Akademska godina:</b> {{ appConfig.academicYear }}</p>
				<p><b>Voditelj:</b> doc. dr. sc. Ivan Lorencin</p>

				<hr />
				<br />

				<Accordion.Root type="single" collapsible class="mb-6 border-b border-gray-200 dark:border-slate-700">
					<Accordion.Item value="about">
						<Accordion.Header as="h2">
							<Accordion.Trigger class="group flex w-full items-center gap-3 rounded py-4 text-left text-2xl hover:text-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue dark:hover:text-sky-300">
								<BaseIcon :path="mdiInformation" size="24" aria-hidden="true" />
								<span class="grow">O praksi</span>
								<BaseIcon :path="mdiChevronDown" size="24" class="motion-safe:transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content class="reka-animated pb-6">
							<p>
								Zahvaljujući izvrsnoj suradnji i kontinuiranom angažmanu, studentska praksa na <a href="https://fipu.unipu.hr/" target="_blank" class="text-fipu_blue"> Fakultetu informatike u Puli </a>već se dugi niz godina uspješno provodi. Ovaj oblik
								praktične nastave omogućava studentima stjecanje vrijednih iskustava i vještina izvan učionice, pružajući im priliku za primjenu stečenog znanja u stvarnim poslovnim situacijama.
							</p>
							<br />

							<p>Studentima je ovo izborni kolegij i oni koji su prijavljeni, motivirani su i spremni za rad!</p>
							<br />
							<p>
								Kako bismo stvarali učinili jednostavnijima, proces izvođenja prakse odlučili smo automatizirati kroz novu aplikaciju <a href="https://fipu-praksa.unipu.hr/" class="text-fipu_blue" target="_blank">FIPU Praksa</a>. Ova aplikacija rezultat je
								istraživačkog rada te suradnje između studenata i profesora na Fakultetu informatike u Puli. Temelji se na eksperimentalnom razvoju baziranom na procesnim modelima (BPMN).
							</p>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>

				<Accordion.Root type="single" collapsible class="mb-6 border-b border-gray-200 dark:border-slate-700">
					<Accordion.Item value="communication">
						<Accordion.Header as="h2">
							<Accordion.Trigger class="group flex w-full items-center gap-3 rounded py-4 text-left text-2xl hover:text-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue dark:hover:text-sky-300">
								<BaseIcon :path="mdiChatQuestionOutline" size="24" aria-hidden="true" />
								<span class="grow">Komunikacija</span>
								<BaseIcon :path="mdiChevronDown" size="24" class="motion-safe:transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content class="reka-animated pb-6">
							<p>
								Studenti, imate pitanja vezana uz izvođenje prakse, sva komunikacija odvija se na <a href="https://chat.google.com/" target="_blank" class="text-fipu_blue">Google Chat</a> kanalu:
								<b><a href="https://chat.google.com/room/AAAASZREDy8" target="_blank" class="text-fipu_blue">FIPU Praksa</a></b>
							</p>

							<p class="mt-1">Poslodavci i mentori, za sve upite kontaktirajte administratoricu ili voditelja stručne prakse.</p>
							<b>Kolegij "Stručna praksa" ne koristi klasični Merlin e-kolegij.</b>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>

				<SectionTitleLineWithButton :icon="mdiCalendarRange" title="Važni datumi"></SectionTitleLineWithButton>
				<p>Za studente koji su upisali Stručnu praksu na prijediplomskom ili diplomskom studiju:</p>
				<ul class="ml-8 list-disc">
					<li>Najraniji datum početka izvođenja stručne prakse - <b> 14. listopad 2025.</b></li>
					<li>Najkasniji datum završetka - <b> 15. rujna 2026.</b></li>
				</ul>
				<br />
				<p>Za sve dodatne informacije kontaktirajte administratore ili voditelja stručne prakse.</p>
				<br />

				<div class="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
					<div class="flex flex-wrap">
						<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
							<div class="flex items-start">
								<div class="shrink-0">
									<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
										<a href="https://fipu.unipu.hr/fipu/ivan.lorencin" target="_blank"><UserAvatar class="h-16 w-16" avatar="https://fipu.unipu.hr/images/users_profiles/Ivan-Lorencin.jpg" username="Ivan Lorencin" /></a>
									</div>
								</div>
								<div class="ml-3 grow">
									<p class="mb-2 font-bold dark:text-white">doc. dr. sc. Ivan Lorencin</p>
									<p class="text-neutral-500 dark:text-neutral-200">ivan.lorencin@unipu.hr</p>
									<p class="text-neutral-500 dark:text-neutral-200">+385 98 96 12 042</p>
									<p class="text-neutral-500 dark:text-neutral-200">ili preko UNIPU Google Chata</p>
								</div>
							</div>
						</div>
						<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
							<div class="flex items-start">
								<div class="shrink-0">
									<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
										<a href="https://fipu.unipu.hr/fipu/marijela.milicevic" target="_blank"
											><UserAvatar class="h-16 w-16" avatar="https://i1.rgstatic.net/ii/profile.image/11431281279391644-1727018247353_Q512/Marijela-Milicevic-2.jpg" username="Marijela Miličević" /></a>
									</div>
								</div>
								<div class="ml-3 grow">
									<p class="mb-2 font-bold dark:text-white">Marijela Miličević (administratorica)</p>
									<p class="text-neutral-500 dark:text-neutral-200">marijela.milicevic@unipu.hr</p>
									<p class="text-neutral-500 dark:text-neutral-200">ili preko UNIPU Google Chata</p>
								</div>
							</div>
						</div>
						<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
							<div class="flex items-start">
								<div class="shrink-0">
									<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
										<a href="https://fipu.unipu.hr/fipu/luka.blaskovic" target="_blank"><UserAvatar class="h-16 w-16" avatar="https://fipu.unipu.hr/images/users_profiles/1748527029profile_main.jpg" username="Luka Blašković" /></a>
									</div>
								</div>
								<div class="ml-3 grow">
									<p class="mb-2 font-bold dark:text-white">Luka Blašković (tehnička podrška)</p>
									<p class="text-neutral-500 dark:text-neutral-200">luka.blaskovic@unipu.hr</p>
									<p class="text-neutral-500 dark:text-neutral-200">ili preko UNIPU Google Chata</p>
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
				<Tabs.Root default-value="A" class="mt-2">
					<Tabs.List aria-label="Upute po modelu prakse" class="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-white p-1 dark:bg-slate-900">
						<Tabs.Trigger value="A" class="instructions-tab">
							<span class="font-semibold">Model A</span>
							<span class="text-sm">Tražim poslodavca</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="B" class="instructions-tab">
							<span class="font-semibold">Model B</span>
							<span class="text-sm">Imam dogovorenu tvrtku</span>
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="A" class="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue">
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
								Jednom kad ste alocirani na zadatak, vi i poslodavac bit ćete obaviješteni putem e-maila. Kontaktirajte mentora sa zadatka na koji ste alocirani i recite da ste dobili zadatak za obavljanje studentske prakse, po potrebi obavite intervju
								ili drugi oblik selekcije, ako to poslodavac traži.
							</li>
							<li>Jednom kad poslodavac donese odluku, isto <b></b> mora evidentirati putem poveznice na e-mailu koji dobiva. Ako poslodavac ne može pronaći e-mail, molimo da kontaktirate voditelja prakse.</li>
							<li>
								Dogovorite s poslodavcem detalje uključujući period izvršavanja prakse.
								<ul class="ml-8 list-disc">
									<li>
										Nakon što dogovorite sve detalje, ispunite Prijavnicu<b> prije</b> početka izvođenja prakse
										<span class="inline-flex">na <IconTextLink :to="'/moja-praksa'" :icon="mdiLaptop" :text="'Moja praksa'"></IconTextLink></span>
									</li>
								</ul>
							</li>
							<li>Nakon što ispunite Prijavnicu, mentor kojeg ste naveli i vi dobivate na e-mail praznu "Potvrdu o obavljenoj praksi", <strong>Vaš mentor ju mora ispuniti nakon što završite s praksom</strong>.</li>
							<ul class="ml-8 list-disc">
								<li>Uživajte u izvođenju prakse :) Have fun i učite! 🚀 Ali, nemojte zaboraviti svakodnevno voditi dnevnik!</li>
								<li>Ovaj kolegij pruža vam priliku da sami oblikujete svoje iskustvo, obogatite ga novim i zanimljivim znanjima te steknete vrijedne kontakte i poznanstva iz industrije. Potencijal je velik, iskoristite ga!</li>
							</ul>
							<li>Kada ste završili s praksom, zatražite od mentora da ispuni "Potvrdu o obavljenoj praksi" te ju predajte, zajedno s dnevnikom prakse u aplikaciji na istoj poveznici. Morate navesti i datum ispitnog roka.</li>
							<li>Prijavite ispitni rok na Studomatu, ocjena se unosi automatski, jednom kad voditelj pregleda vaš Dnevnik, ne morate dolaziti na ispit.</li>
							<li>Uspješno ste odradili stručnu praksu! Čestitamo! 🎊</li>
						</ol>
					</Tabs.Content>
					<Tabs.Content value="B" class="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fipu_blue">
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
									<div class="inline-flex"><IconTextLink :to="'/poslodavci'" :icon="mdiDomain" :text="'Poslodavci'"></IconTextLink></div>
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
							<li>Nakon što ispunite Prijavnicu, mentor kojeg ste naveli i vi dobivate na e-mail praznu "Potvrdu o obavljenoj praksi", <strong>Vaš mentor ju mora ispuniti nakon što završite s praksom</strong>.</li>
							<ul class="ml-8 list-disc">
								<li>Uživajte u izvođenju prakse :) Have fun i učite! 🚀 Ali, nemojte zaboraviti svakodnevno voditi dnevnik!</li>
								<li>Ovaj kolegij pruža vam priliku da sami oblikujete svoje iskustvo, obogatite ga novim i zanimljivim znanjima te steknete vrijedne kontakte i poznanstva iz industrije. Potencijal je velik, iskoristite ga!</li>
							</ul>
							<li>Kada ste završili s praksom, zatražite od mentora da ispuni "Potvrdu o obavljenoj praksi" te ju predajte, zajedno s dnevnikom prakse u aplikaciji na istoj poveznici. Morate navesti i datum ispitnog roka.</li>
							<li>Prijavite ispitni rok na Studomatu, ocjena se unosi automatski, jednom kad voditelj pregleda vaš Dnevnik, ne morate dolaziti na ispit.</li>
							<li>Uspješno ste odradili stručnu praksu! Čestitamo! 🎊</li>
						</ol>
					</Tabs.Content>
				</Tabs.Root>
			</SectionMain>
		</LayoutGuest>
	</div>
</template>

<style scoped>
.instructions-tab {
	@apply flex min-w-0 flex-col gap-1 rounded px-3 py-3 text-left transition-colors data-[state=inactive]:hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fipu_blue data-[state=active]:bg-sky-100 data-[state=active]:text-sky-900 dark:data-[state=inactive]:hover:bg-slate-800 dark:data-[state=active]:bg-sky-900 dark:data-[state=active]:text-sky-100;
}
</style>
