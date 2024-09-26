<script setup>
import { mdiBallot, mdiEmail, mdiClipboardText, mdiLaptop, mdiDomain, mdiMapMarker, mdiClipboardTextClockOutline, mdiAccountGroup, mdiSchool, mdiTextLong, mdiXml, mdiThumbsUpDown, mdiClockTimeFiveOutline, mdiNoteTextOutline } from "@mdi/js";
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

import Utils from "@/helpers/utils";

import { guestStore, mainStore, snackBarStore } from "@/main.js";

import FIPU_praksa_logo_transparent from "/FIPU_praksa_logo_transparent.svg";

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
	// ... other fields
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

function resetForm() {
	for (const key in DEFAULT_FORM_VALUES) {
		form[key] = DEFAULT_FORM_VALUES[key];
	}
	v$.value.$reset();
	snackBarStore.pushMessage("Forma je resetirana!", "success");
}

async function onSubmit() {
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

	let result = await guestStore.submitNewInternshipProject(form);
	isLoading.value = false;

	if (result) {
		snackBarStore.pushMessage("Uspješno ste prijavili zadatak!", "success");
		await Utils.wait(1);
		location.reload();
	}
}

const allCompanies = ref([]);
const mappedCompanies = ref([]);

const angazmanSelect = { true: "Da", false: "Ne" };
const selectionSelect = { true: "Da", false: "Ne" };

onMounted(async () => {
	let result = await mainStore.fetchCompanies();
	allCompanies.value = result.data.results;

	mappedCompanies.value = allCompanies.value.map((items, index) => ({
		id: index + 1,
		label: items.naziv,
	}));
});

watch(
	() => form.selekcija,
	(newValue) => {
		if (typeof newValue === "string") {
			form.selekcija = newValue === "true";
		}
	},
);

const onCompanyChange = () => {
	if (form.Poslodavac) {
		form.Poslodavac_novi_naziv = "";
	}
};
</script>

<template>
	<div>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiLaptop" title="FIPU Praksa" main>
				<a href="/" target="_blank">
					<img :src="FIPU_praksa_logo_transparent" class="max-h-14 object-contain" />
				</a>
			</SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> doc. dr. sc. Ivan Lorencin</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardText" main title="Prijava zadatka (Poslodavci)"></SectionTitleLineWithButton>
			<p>Ova prijavnica je namijenjena <u>poduzećima i organizacijama</u> koje žele provoditi studentsku praksu u suradnji s Fakultetom informatike u Puli. Na temelju ovog upitnika odredit će se idealni studenti za provođenje prakse u Vašem poduzeću.</p>
			<br />

			<p>Studentima je ovo izborni kolegij i oni koji su prijavljeni, motivirani su i spremni za rad!</p>
			<br />
			<p><b>Važna napomena:</b> Pojedina organizacija može prijaviti i više zadataka. Molimo da za svaki zadatak zasebno popunite prijavnicu (isti link) te zatražite broj studenata koji može na njemu raditi (npr. može biti 2 zadataka, na prvom 3 studenta, na drugom 4).</p>
			<br />
			<p>Za sve dodatne informacije slobodno kontaktirajte voditelja stručne prakse:</p>

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
								<p class="text-neutral-500 dark:text-neutral-200">+385 98 30 56 73</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mb-6 grid grid-cols-1 gap-6">
				<CardBox :icon="mdiBallot" class="mb-6 lg:col-span-2 lg:mb-0 xl:col-span-3" is-form @submit.prevent="onSubmit">
					<CardBoxComponentTitle class="text-center" title="💼Prijava projekta za studentsku praksu " />

					<FormField v-if="!form.Poslodavac_novi_naziv" label="Poduzeće partner" help="Ako niste partner, unesite naziv poduzeća ispod" horizontal>
						<FormCombobox v-model="form.Poslodavac" :options="mappedCompanies" placeholder="Odaberite poduzeće ako ste postojeći partner" @change="onCompanyChange" />
					</FormField>

					<FormField v-if="!form.Poslodavac" label="Naziv poduzeća" horizontal>
						<FormControl v-model="form.Poslodavac_novi_naziv" :icon-left="mdiDomain" help="Ovdje unesite naziv poduzeća ako ste novi partner (nema vas u dropdown obrascu iznad)" :error="getFirstErrorForField(v$, 'Poslodavac_novi_naziv')" placeholder="Naziv poduzeća" />
					</FormField>

					<FormField label="Kontakt email" horizontal>
						<FormControl v-model="form.poslodavac_email" :icon-left="mdiEmail" type="email" :error="getFirstErrorForField(v$, 'poslodavac_email')" help="E-mail adresa pri kojoj će se student obratiti oko dogovora za izvođenje studentske prakse ili provedbu selekcije. Ne mora nužno biti budući mentor." placeholder="Vaš kontakt email" />
					</FormField>

					<BaseDivider />
					<FormField label="Detaljan opis zadatka" horizontal>
						<FormControl
							v-model="form.opis_zadatka"
							type="textarea"
							placeholder="Zadatak će se sastojati od ... Student će raditi na ..."
							:error="getFirstErrorForField(v$, 'opis_zadatka')"
							:icon-left="mdiTextLong"
							help="Opis zadataka koji bi student izvršavao. Može biti: mala (web, mobilna, desktop) aplikacija, program za obradu podataka, analiza podataka, poboljšanje postojećeg koda (engl. code refactoring), pomoć pri održavanju računalne ili aplikacijske infrastrukture - DevOps poslovi, ... Preporučuje se što detaljniji opis kako bi mogli alocirati idealnog kandidata." />
					</FormField>

					<FormField
						label="Preferirane tehnologije/platforme
"
						horizontal>
						<FormControl
							v-model="form.preferirane_tehnologije"
							type="textarea"
							:error="getFirstErrorForField(v$, 'preferirane_tehnologije')"
							:placeholder="`Npr. PHP, Laravel, Python, Django, JavaScript, Vue.js, Unity, WordPress, TensorFlow...`"
							:icon-left="mdiXml"
							help="Što sve koristi vaša tvrtka ili na čemu će se temeljiti rad studenta? Npr. PHP, Laravel, Python, Django, JavaScript, Vue.js, Unity, WordPress, TensorFlow...
" />
					</FormField>

					<FormField label="Broj studenata" horizontal>
						<FormField addons>
							<FormControl v-model="form.broj_studenata" type="number" :icon-left="mdiAccountGroup" :error="getFirstErrorForField(v$, 'broj_studenata')" :min="1" placeholder="Maksimalni broj studenata" help="Koliko studenata možete primiti u rješavanju ovog zadatka? Studenti mogu raditi odvojeno ili u timu. Ako imate više zadataka, možete ponovno popuniti formu za svaki zadatak posebno." expanded />
						</FormField>
					</FormField>

					<FormField
						label="Preferencije pri odabiru studenta
"
						horizontal>
						<FormControl v-model="form.preferencije_za_studenta" type="textarea" :error="getFirstErrorForField(v$, 'preferencije_za_studenta')" placeholder="Poželjni kandidat posjeduje znanja iz ... ima iskustva u..." :icon-left="mdiThumbsUpDown" help="U koliko smatrate važnim, opišite odlike poželjnog kandidata na praksi." />
					</FormField>

					<FormField label="Potrebna infrastruktura koju student mora posjedovati" horizontal>
						<FormControl v-model="form.potrebno_imati" :error="getFirstErrorForField(v$, 'potrebno_imati')" :icon-left="mdiDomain" help="Potrebna infrastruktura koju student mora posjedovati" placeholder="Npr. laptop" />
					</FormField>

					<FormField label="Željeno trajanje prakse" horizontal>
						<FormField addons>
							<FormControl
								v-model="form.trajanje_sati"
								type="number"
								:error="getFirstErrorForField(v$, 'trajanje_sati')"
								:icon-left="mdiClockTimeFiveOutline"
								placeholder="Preporuka je 90 - 150 radnih sati"
								help="Preporučeno trajanje studentske prakse je između 90 i 150 radnih sati. U dogovoru sa studentom može se kasnije taj angažman produljiti. Dogovor kako će se izvršiti ti sati je između vas i studenta (npr. koncentrirano u 2-3 tjedna ili par puta tjedno kroz dulje vrijeme).
"
								expanded />
						</FormField>
					</FormField>

					<FormField label="Lokacija" horizontal>
						<FormControl v-model="form.lokacija" help="Moguća je 'remote' praksa" :error="getFirstErrorForField(v$, 'lokacija')" :icon-left="mdiMapMarker" placeholder="Lokacija održavanja prakse" />
					</FormField>

					<FormField label="Željeno okvirno vrijeme početka" horizontal>
						<FormControl v-model="form.zeljeno_okvirno_vrijeme_pocetka" :icon-left="mdiClipboardTextClockOutline" :error="getFirstErrorForField(v$, 'zeljeno_okvirno_vrijeme_pocetka')" placeholder="npr. Veljača 2024." help="Praksa se mora obaviti najkasnije do 1. rujna sljedeće godine." />
					</FormField>

					<FormField label="Angažman nastavnika s FIPU" help="Po želji, nastavno osoblje FIPU-a može pomoći pri izvođenju prakse na način da oni dijelom (ili u potpunosti) mentoriraju studenta. Moguće je čak da student u našem laboratoriju obavlja praksu, te povremeno dolazi prezentirati učinjeno." horizontal>
						<FormCheckRadioGroup v-model="form.angazman_selekcija" :error="getFirstErrorForField(v$, 'angazman_selekcija')" name="angazman_selection" type="radio" :options="angazmanSelect" component-class="check-radio-warning" />
					</FormField>

					<FormField v-if="form.angazman_selekcija === 'true'" label="Opis angažmana nastavnika" help="Molimo da detaljnije opišite angažman nastavnog osoblja i proces obavljanje prakse." horizontal>
						<FormControl v-model="form.angazman_fipu" :error="getFirstErrorForField(v$, 'angazman_fipu')" type="textarea" :icon-left="mdiSchool" :disabled="form.angazman_selekcija === false" />
					</FormField>

					<FormField label="Dodatna napomena" horizontal>
						<FormControl v-model="form.napomena" :icon-left="mdiNoteTextOutline" placeholder="Slobodno unesite napomenu, nije obavezno." :error="getFirstErrorForField(v$, 'napomena')" type="textarea" />
					</FormField>

					<FormField
						label="Selekcijski postupak"
						help="Želite li provesti dodatnu selekciju kandidata koji se prijave na praksu (npr. intervju, ispit) ?
"
						horizontal>
						<FormCheckRadioGroup v-model="form.selekcija" name="selekcija_selection" :error="getFirstErrorForField(v$, 'selekcija')" type="radio" :options="selectionSelect" component-class="check-radio-warning" />
					</FormField>

					<FormField v-if="form.selekcija === true" label="Proces selekcije" horizontal>
						<FormControl v-model="form.proces_selekcije" :error="getFirstErrorForField(v$, 'proces_selekcije')" type="textarea" :disabled="form.selekcija === false" help="Molimo da opišete postupak selekcije, da studenti otprilike znaju što očekivati." />
					</FormField>

					<FormField horizontal grouped>
						<BaseButton label="Pošalji" type="submit" :disabled="isLoading" :loading="isLoading" color="fipu_blue" />
						<BaseButton label="Resetiraj formu" color="danger" @click="resetForm()" />
					</FormField>
				</CardBox>
			</div>
		</SectionMain>
		<FooterBar><br />Made with <span style="color: #e25555">&#9829;</span> at FIPU.lab</FooterBar>
		<SnackBar />
	</div>
</template>
