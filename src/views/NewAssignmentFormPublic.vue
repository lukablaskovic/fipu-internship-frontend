<script setup>
import { submitNewInternshipProject } from "@/services/baserow_client_api";
import { appConfig } from "@/config";
import { mdiBallot, mdiNewBox, mdiEmail, mdiLaptop, mdiDomain, mdiMapMarker, mdiClipboardTextClockOutline, mdiAccountGroup, mdiSchool, mdiTextLong, mdiXml, mdiThumbsUpDown, mdiClockTimeFiveOutline, mdiNoteTextOutline } from "@mdi/js";
import { ref, reactive, onMounted, watch, computed } from "vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";

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


import { useMainStore } from "@/stores/main_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

import FIPU_praksa_logo_transparent from "/FIPU_praksa_logo_transparent.svg";

const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();

const DEFAULT_FORM_VALUES = {
	Poslodavac: "",
	Poslodavac_novi_naziv: "",
	poslodavac_email: "",
	opis_zadatka: "",
	preferirane_tehnologije: "",
	broj_studenata: "",
	preferencije_za_studenta: "",
	potrebno_imati: "",
	trajanje_sati: "",
	lokacija: "",
	zeljeno_okvirno_vrijeme_pocetka: "",
	angazman_selekcija: false,
	angazman_fipu: "",
	napomena: "",
	selekcija: false,
	proces_selekcije: "",
};

const form = reactive({ ...DEFAULT_FORM_VALUES });

const greaterThanZero = (value) => value > 0;

const rules = reactive({
	Poslodavac: computed(() => {
		if (form.Poslodavac_novi_naziv) return {};
		return {
			required: helpers.withMessage("Polje je obavezno", required),
		};
	}),
	Poslodavac_novi_naziv: computed(() => {
		if (form.Poslodavac) return {};
		return {
			required: helpers.withMessage("Polje je obavezno", required),
		};
	}),
	poslodavac_email: {
		required: helpers.withMessage("Polje je obavezno", required),
		email: helpers.withMessage("Molimo unesite ispravnu e-mail adresu", email),
	},
	opis_zadatka: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	preferirane_tehnologije: {},
	broj_studenata: {
		required: helpers.withMessage("Polje je obavezno", required),
		maxValue: helpers.withMessage("Minimalno 1 student", greaterThanZero),
	},
	preferencije_za_studenta: {},
	potrebno_imati: {},
	trajanje_sati: {
		required: helpers.withMessage("Polje je obavezno", required),
		maxValue: helpers.withMessage("Mora biti veće od 0", greaterThanZero),
	},
	lokacija: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	zeljeno_okvirno_vrijeme_pocetka: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	angazman_selekcija: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	angazman_fipu: computed(() => {
		if (form.angazman_selekcija === "true") {
			return {
				required: helpers.withMessage("Polje je obavezno", required),
			};
		}
		return {};
	}),
	proces_selekcije: computed(() => {
		if (form.selekcija === true) {
			return {
				required: helpers.withMessage("Polje je obavezno", required),
			};
		}
		return {};
	}),
	napomena: {},
	selekcija: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
});

const isLoading = ref(false);

const v$ = useVuelidate(rules, form);

function resetForm(notify = true) {
	for (const key in DEFAULT_FORM_VALUES) {
		form[key] = DEFAULT_FORM_VALUES[key];
	}
	v$.value.$reset();
	if (notify) snackBarStore.pushMessage("Forma resetirana.", "success");
}

async function onSubmit() {
	if (isLoading.value) return;
	isLoading.value = true;
	v$.value.$touch();
	if (v$.value.$invalid) {
		isLoading.value = false;
		return;
	}

	if (form.angazman_selekcija === "false") {
		form.angazman_fipu = "Nema";
	}

	if (!form.selekcija) {
		form.proces_selekcije = "Nema";
	}

	let saved = false;
	try {
		const result = await submitNewInternshipProject(form);
		if (!result) throw new Error("Project submission failed");
		saved = true;
		resetForm(false);
		snackBarStore.pushMessage("Uspješno ste prijavili zadatak!", "success");
		await refreshCompanies();
	} catch (error) {
		snackBarStore.pushMessage(saved ? "Zadatak je prijavljen, ali popis poduzeća nije osvježen. Pokušajte ponovno otvoriti obrazac." : "Zadatak nije prijavljen. Molimo pokušajte ponovno.", "danger");
	} finally {
		isLoading.value = false;
	}
}

const allCompanies = ref([]);
const mappedCompanies = ref([]);

const angazmanSelect = { true: "Da", false: "Ne" };
const selectionSelect = { true: "Da", false: "Ne" };

async function refreshCompanies() {
	let results = await mainStore.fetchCompanies("", true);
	allCompanies.value = results;

	mappedCompanies.value = allCompanies.value.map((items, index) => ({
		id: index + 1,
		label: items.naziv,
	}));
}

onMounted(refreshCompanies);

watch(
	() => form.selekcija,
	(newValue) => {
		if (typeof newValue === "string") {
			form.selekcija = newValue === "true";
		}
	},
);
</script>

<template>
	<div>
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
			<SectionTitleLineWithButton :icon="mdiNewBox" main title="Prijava zadatka"></SectionTitleLineWithButton>
			<p>
				Ova prijavnica je namijenjena <u>privatnim i javnim poslovnim organizacijama</u> koje žele provoditi studentsku praksu u suradnji s <a href="https://fipu.unipu.hr/" target="_blank" class="text-fipu_blue">Fakultetom informatike u Puli</a>. Na
				temelju ovog upitnika odabrat će se idealni studenti za provođenje prakse u Vašoj organizaciji.
			</p>
			<br />

			<p>Studentima je ovo izborni kolegij i oni koji su prijavljeni, motivirani su i spremni za rad!</p>
			<br />
			<p>
				<b>Važna napomena:</b> Pojedina organizacija može prijaviti i više zadataka. <b>Molimo da za svaki zadatak zasebno popunite prijavnicu</b> (ovaj link) te navedete broj studenata koji može na njemu raditi (npr. možete prijaviti 2 zadataka, na
				prvom 3 studenta, na drugom 4).
			</p>
			<br />
			<p>(<b>Model B</b>) Ako ste već u dogovoru sa studentom, ili je student već odradio praksu kod Vas, molimo da navedete njegovo ime i prezime u polju "Preferencije pri odabiru studenta" te detaljno opišete zadatak.</p>

			<br />
			<p><b>Niste sigurni što su Modeli A i B?</b> <router-link class="text-fipu_blue" to="/upute">Proučite kako izvodimo praksu na FIPU.</router-link></p>

			<br />
			<p>Za sve dodatne informacije slobodno kontaktirajte voditelja stručne prakse.</p>

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
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mb-6 grid grid-cols-1 gap-6">
				<CardBox :icon="mdiBallot" class="mb-6 lg:col-span-2 lg:mb-0 xl:col-span-3" is-form novalidate @submit.prevent="onSubmit">
					<CardBoxComponentTitle class="text-center" title="💼 Prijava projekta za studentsku praksu " />

					<FormField name="Poslodavac" label="Postojeći partner*" horizontal help="Ako niste partner, unesite naziv organizacije ispod." :error="getFirstErrorForField(v$, 'Poslodavac')" :disabled="!!form.Poslodavac_novi_naziv">
						<FormCombobox v-model="form.Poslodavac" :disabled="!!form.Poslodavac_novi_naziv" :list="mappedCompanies" label-name="label" emit-name="label" />
					</FormField>

					<div class="mb-4 sm:mb-12">ili</div>

					<FormField
						name="Poslodavac_novi_naziv"
						label="Naziv organizacije*"
						horizontal
						help="Ovdje unesite naziv organizacije ako ste novi partner (nema vas u dropdown obrascu iznad)"
						:error="getFirstErrorForField(v$, 'Poslodavac_novi_naziv')"
						:disabled="!!form.Poslodavac">
						<FormControl v-model="form.Poslodavac_novi_naziv" :disabled="form.Poslodavac != ''" :icon-left="mdiDomain" placeholder="Naziv organizacije" />
					</FormField>

					<FormField
						name="poslodavac_email"
						label="Kontakt email*"
						horizontal
						:error="getFirstErrorForField(v$, 'poslodavac_email')"
						help="E-mail adresa pri kojoj će se student obratiti oko dogovora za izvođenje studentske prakse ili provedbu selekcije. Ne mora nužno biti budući mentor.">
						<FormControl v-model="form.poslodavac_email" :icon-left="mdiEmail" type="email" placeholder="Vaš kontakt email" />
					</FormField>

					<BaseDivider />
					<FormField
						name="opis_zadatka"
						label="Detaljan opis zadatka*"
						horizontal
						:error="getFirstErrorForField(v$, 'opis_zadatka')"
						help="Opis zadataka koji bi student izvršavao. Može biti: mala (web, mobilna, desktop) aplikacija, program za obradu podataka, analiza podataka, poboljšanje postojećeg koda (engl. code refactoring), pomoć pri održavanju računalne ili aplikacijske infrastrukture - DevOps poslovi... Preporučuje se što detaljniji opis kako bi mogli alocirati idealnog kandidata.">
						<FormControl v-model="form.opis_zadatka" type="textarea" placeholder="Zadatak će se sastojati od... Student će raditi na..." :icon-left="mdiTextLong" />
					</FormField>

					<FormField
						name="preferirane_tehnologije"
						label="Preferirane tehnologije/platforme
"
						horizontal
						:error="getFirstErrorForField(v$, 'preferirane_tehnologije')"
						help="Što sve koristi vaša organizacija ili na čemu će se temeljiti rad studenta? Navedite konkretne tehnologij/programske jezike, razvojne okvire...
">
						<FormControl v-model="form.preferirane_tehnologije" type="textarea" :placeholder="`npr. PHP, Laravel, Python, Django, JavaScript, Vue.js, Unity, WordPress, TensorFlow...`" :icon-left="mdiXml" />
					</FormField>

					<FormField
						name="broj_studenata"
						label="Broj studenata*"
						horizontal
						:error="getFirstErrorForField(v$, 'broj_studenata')"
						help="Koliko studenata možete primiti u rješavanju ovog zadatka? Studenti mogu raditi odvojeno ili u timu. Ako imate više zadataka, molimo da popunite formu za svaki zadatak zasebno.">
						<FormControl v-model="form.broj_studenata" type="number" :icon-left="mdiAccountGroup" :min="1" placeholder="Maksimalni broj studenata" expanded />
					</FormField>

					<FormField
						name="preferencije_za_studenta"
						label="Preferencije pri odabiru studenta"
						horizontal
						:error="getFirstErrorForField(v$, 'preferencije_za_studenta')"
						help="U koliko smatrate važnim, opišite odlike poželjnog kandidata na praksi. Ako već imate dogovor sa studentom, navedite ovdje njegovo ime i prezime.">
						<FormControl v-model="form.preferencije_za_studenta" type="textarea" placeholder="Poželjni kandidat posjeduje znanja iz... mora imati iskustva u... (model A) ILI ime i prezime željenog studenta (model B)" :icon-left="mdiThumbsUpDown" />
					</FormField>

					<FormField name="potrebno_imati" label="Potrebna infrastruktura koju student mora posjedovati" horizontal :error="getFirstErrorForField(v$, 'potrebno_imati')" help="Potrebna infrastruktura koju student mora posjedovati">
						<FormControl v-model="form.potrebno_imati" :icon-left="mdiDomain" placeholder="npr. Osobno računalo, određeni softver, hardver..." />
					</FormField>

					<FormField
						name="trajanje_sati"
						label="Željeno trajanje prakse*"
						horizontal
						:error="getFirstErrorForField(v$, 'trajanje_sati')"
						help="Preporučeno trajanje studentske prakse je između 90 i 150 radnih sati. U dogovoru sa studentom može se kasnije taj angažman produljiti. Dogovor kako će se izvršiti ti sati je između Vas i studenta (npr. koncentrirano u 2-3 tjedna ili par puta tjedno kroz dulje vrijeme).
">
						<FormControl v-model="form.trajanje_sati" type="number" :icon-left="mdiClockTimeFiveOutline" placeholder="Preporuka je 90 - 150 radnih sati" expanded />
					</FormField>

					<FormField name="lokacija" label="Lokacija*" horizontal help="Moguća je 'remote' praksa." :error="getFirstErrorForField(v$, 'lokacija')">
						<FormControl v-model="form.lokacija" :icon-left="mdiMapMarker" placeholder="Lokacija održavanja prakse" />
					</FormField>

					<FormField name="zeljeno_okvirno_vrijeme_pocetka" label="Željeno okvirno vrijeme početka" horizontal :error="getFirstErrorForField(v$, 'zeljeno_okvirno_vrijeme_pocetka')" help="Praksa se mora obaviti najkasnije do 15. rujna 2025.">
						<FormControl v-model="form.zeljeno_okvirno_vrijeme_pocetka" :icon-left="mdiClipboardTextClockOutline" placeholder="npr. Svibanj 2025." />
					</FormField>

					<FormField
						name="angazman_selekcija"
						label="Angažman nastavnika s FIPU*"
						help="Po želji, nastavno osoblje FIPU-a može pomoći pri izvođenju prakse na način da oni dijelom (ili u potpunosti) mentoriraju studenta. Moguće je čak da student u našem laboratoriju obavlja praksu, te povremeno dolazi prezentirati učinjeno."
						horizontal
						:error="getFirstErrorForField(v$, 'angazman_selekcija')">
						<FormCheckRadioGroup v-model="form.angazman_selekcija" name="angazman_selection" type="radio" :options="angazmanSelect" component-class="check-radio-warning" />
					</FormField>

					<FormField
						v-if="form.angazman_selekcija === 'true'"
						name="angazman_fipu"
						label="Opis angažmana nastavnika"
						help="Molimo da detaljnije opišite angažman nastavnog osoblja i proces obavljanje prakse."
						horizontal
						:error="getFirstErrorForField(v$, 'angazman_fipu')">
						<FormControl v-model="form.angazman_fipu" type="textarea" :icon-left="mdiSchool" :disabled="form.angazman_selekcija === false" />
					</FormField>

					<FormField name="napomena" label="Dodatna napomena" horizontal :error="getFirstErrorForField(v$, 'napomena')">
						<FormControl v-model="form.napomena" :icon-left="mdiNoteTextOutline" placeholder="Slobodno unesite napomenu, nije obavezno." type="textarea" />
					</FormField>

					<FormField
						name="selekcija"
						label="Selekcijski postupak*"
						help="Želite li provesti dodatnu selekciju kandidata koji se prijave na praksu (npr. intervju, ispit)?
"
						horizontal
						:error="getFirstErrorForField(v$, 'selekcija')">
						<FormCheckRadioGroup v-model="form.selekcija" name="selekcija_selection" type="radio" :options="selectionSelect" component-class="check-radio-warning" />
					</FormField>

					<FormField
						v-if="form.selekcija === true"
						name="proces_selekcije"
						label="Proces selekcije"
						horizontal
						:error="getFirstErrorForField(v$, 'proces_selekcije')"
						help="Molimo da opišete postupak selekcije, kako bi studenti znali što otprilike očekivati.">
						<FormControl v-model="form.proces_selekcije" type="textarea" :disabled="form.selekcija === false" />
					</FormField>

					<FormField horizontal grouped>
						<BaseButton label="Pošalji" type="submit" :disabled="isLoading" :loading="isLoading" color="fipu_blue" />
						<BaseButton label="Resetiraj formu" color="danger" @click="resetForm()" />
					</FormField>
				</CardBox>
			</div>
		</SectionMain>
		<FooterBar
			><br />
			Made with <span style="color: #e25555">&#9829;</span> at <a :href="appConfig.fipulab_web" target="_blank" class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue">FIPUlab</a></FooterBar
		>
		<SnackBar />
	</div>
</template>

<style></style>
