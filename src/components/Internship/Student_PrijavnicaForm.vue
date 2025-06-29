<script setup>
import { mdiFileDocumentEdit, mdiLaptop, mdiBallot, mdiAccount, mdiMail, mdiClipboardCheck, mdiPhone, mdiCardAccountDetailsOutline, mdiDomain, mdiClockTimeFiveOutline, mdiTextLong } from "@mdi/js";
import { croatianAlpha, getFirstErrorForField, isUnipuEmail, exactLength, containsNumeric } from "@/helpers/validators";
import { required, email, helpers, numeric } from "@vuelidate/validators";
import { ref, computed, onMounted, reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";
import FormCheckRadioGroup from "@/components/Form/FormCheckRadioGroup.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";

import { mainStore, snackBarStore, studentStore } from "@/main.js";
import { UserTaskMappings } from "@/helpers/maps";
import Utils from "@/helpers/utils.js";

const allocated_assignment = ref(null);
onMounted(async () => {
	await studentStore.getInstanceInfo(mainStore.currentUser.internship_process.id);

	if (studentStore.allocated_assignment == null) {
		//console.log(studentStore.student_process_instance_data.variables["Alocirani_zadatak"]);
		let result = await studentStore.getAssignmentDetails(studentStore.student_process_instance_data.variables["Alocirani_zadatak"]);

		studentStore.allocated_assignment = result.data.results[0];

		allocated_assignment.value = result.data.results[0];
	} else {
		allocated_assignment.value = studentStore.allocated_assignment;
	}
});

const Layout = computed(() => {
	if (mainStore.userAuthenticated) {
		return LayoutAuthenticated;
	} else {
		return LayoutGuest;
	}
});

const nacinIzvrsavanjeRadioOptions = {
	"on-site": "on-site",
	remote: "remote",
	hybrid: "hybrid",
};

//ispunjavanje_prijavnice_student
const form = reactive({
	student_ime: mainStore.currentUser.ime,
	student_prezime: mainStore.currentUser.prezime,
	student_broj_mobitela: "",
	student_OIB: "",
	student_email: mainStore.currentUser.email,
	mentor_ime: "",
	mentor_prezime: "",
	mentor_email: "",
	detaljan_opis_zadatka: "",
	dogovoreni_broj_sati: null,
	pocetak_prakse: "",
	kraj_prakse: "",
	alokacija_potvrda: true,
	kontakt_potvrda: false,
	Poslodavac: studentStore.student_process_instance_data.variables["poslodavac_naziv"],
	mjesto_izvrsavanja: nacinIzvrsavanjeRadioOptions[0],
});

const rules = {
	student_ime: {
		required: helpers.withMessage("Polje je obavezno", required),
		croatianAlpha: helpers.withMessage("Ime može sadržavati samo slova hrvatske abecede", croatianAlpha),
	},
	student_prezime: {
		required: helpers.withMessage("Polje je obavezno", required),
		croatianAlpha: helpers.withMessage("Prezime može sadržavati samo slova hrvatske abecede", croatianAlpha),
	},
	student_broj_mobitela: {
		required: helpers.withMessage("Polje je obavezno", required),
		containsNumeric: helpers.withMessage("Broj mobitela može sadržavati samo brojeve", containsNumeric),
	},
	student_OIB: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("OIB može sadržavati samo brojeve", numeric),
		exactLength: helpers.withMessage("OIB mora sadržavati točno 11 brojeva", exactLength(11)),
	},
	student_email: {
		required: helpers.withMessage("Polje je obavezno", required),
		email: helpers.withMessage("Molimo unesite ispravnu e-mail adresu", email),
	},
	mentor_ime: {
		required: helpers.withMessage("Polje je obavezno", required),
		croatianAlpha: helpers.withMessage("Ime može sadržavati samo slova hrvatske abecede", croatianAlpha),
	},
	mentor_prezime: {
		required: helpers.withMessage("Polje je obavezno", required),
		croatianAlpha: helpers.withMessage("Prezime može sadržavati samo slova hrvatske abecede", croatianAlpha),
	},
	mentor_email: {
		required: helpers.withMessage("Polje je obavezno", required),
		email: helpers.withMessage("Molimo unesite ispravnu e-mail adresu", email),
	},
	detaljan_opis_zadatka: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	dogovoreni_broj_sati: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("Broj sati može sadržavati samo brojeve", numeric),
	},
	pocetak_prakse: {
		required: helpers.withMessage("Polje je obavezno", required),

		dateMustBeBeforeKrajPrakse: helpers.withMessage("Datum početka ne može biti nakon datuma završetka", (value) => {
			const krajPrakseDate = new Date(form.kraj_prakse);
			const selectedDate = new Date(value);

			return !(selectedDate >= krajPrakseDate);
		}),
	},

	kraj_prakse: {
		required: helpers.withMessage("Polje je obavezno", required),
		dateMustBeAtLeastOneWeekApart: helpers.withMessage("Praksa mora trajati barem tjedan dana", (value) => {
			const pocetakPrakseDate = new Date(form.pocetak_prakse);
			const selectedDate = new Date(value);

			const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
			return !(selectedDate.getTime() <= pocetakPrakseDate.getTime() + oneWeekInMillis);
		}),
	},
	kontakt_potvrda: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	mjesto_izvrsavanja: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
};
let isLoading = ref(false);
const v$ = useVuelidate(rules, form);

async function submit_application_form() {
	isLoading.value = true;

	v$.value.$touch();
	if (v$.value.$invalid) {
		isLoading.value = false;
		return;
	}
	await studentStore.submitApplicationForm(form);
	isLoading.value = false;

	if (UserTaskMappings.getTaskProperty(studentStore.student_process_instance_data.pending[0], "snackbar_msg")) {
		snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(studentStore.student_process_instance_data.pending[0], "snackbar_msg"), UserTaskMappings.getTaskProperty(studentStore.student_process_instance_data.pending[0], "snackbar_color"));
	}
	await Utils.wait(2);
	location.reload();
}
</script>

<template>
	<component :is="Layout">
		<SectionMain v-if="allocated_assignment != null" class="relative">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>
			<img src="/illustrations/prijavnica.svg" class="absolute right-0 top-0 mr-6 hidden w-1/4 max-w-full md:block" />
			<br />
			<div class="sm:mt-32">
				<SectionTitleLineWithButton :icon="mdiClipboardCheck" main title="Alocirani zadatak"></SectionTitleLineWithButton>
				<CardboxAllocation v-if="allocated_assignment != null" :data="allocated_assignment"></CardboxAllocation>
			</div>

			<br />
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiFileDocumentEdit" main title="Prijavnica"></SectionTitleLineWithButton>
			<p>Molimo da ispunite prijavnicu prije početka izvođenja prakse. Popunjena prijavnica se potom šalje na e-mail mentora kojeg navedete na odobrenje i potpis.</p>
			<br />
			<hr />

			<div class="mb-8 grid grid-cols-1 gap-6">
				<CardBox :icon="mdiBallot" class="mb-6 lg:col-span-2 lg:mb-0 xl:col-span-3" is-form @submit.prevent="submit_application_form">
					<CardBoxComponentTitle title="📃 Prijavnica na praksu" />
					<FormField label="Ime i prezime" horizontal>
						<FormControl disabled v-model="form.student_ime" :icon-left="mdiAccount" help="Vaše ime" :error="getFirstErrorForField(v$, 'student_ime')" placeholder="Vaše ime" />
						<FormControl disabled v-model="form.student_prezime" :icon-left="mdiAccount" help="Vaše prezime" :error="getFirstErrorForField(v$, 'student_prezime')" placeholder="Vaše prezime" />
					</FormField>

					<FormField label="UNIPU email" horizontal>
						<FormControl disabled v-model="form.student_email" :icon-left="mdiMail" type="email" help="Vaša UNIPU email adresa" :error="getFirstErrorForField(v$, 'student_email')" placeholder="Email" />
					</FormField>

					<FormField label="Broj mobitela" help="Neće se trajno pohraniti. Samo za slučajeve brzog dogovora." horizontal>
						<FormField addons>
							<FormControl v-model="form.student_broj_mobitela" type="tel" :icon-left="mdiPhone" placeholder="Unesite vaš broj mobitela" :error="getFirstErrorForField(v$, 'student_broj_mobitela')" expanded />
						</FormField>
					</FormField>

					<FormField label="Vaš OIB" horizontal>
						<FormControl v-model="form.student_OIB" :icon-left="mdiCardAccountDetailsOutline" :error="getFirstErrorForField(v$, 'student_OIB')" help="Za potrebe prijave osiguranja" placeholder="Unesite vaš OIB" />
					</FormField>

					<BaseDivider />

					<FormField label="Poduzeće" horizontal>
						<FormControl v-model="form.Poslodavac" :icon-left="mdiDomain" readonly disabled help="Odabrano poduzeće" placeholder="Odabrano poduzeće" />
					</FormField>

					<FormField label="Ime i prezime mentora" horizontal>
						<FormControl v-model="form.mentor_ime" :icon-left="mdiAccount" help="Ime mentora" :error="getFirstErrorForField(v$, 'mentor_ime')" placeholder="Ime mentora" />
						<FormControl v-model="form.mentor_prezime" :icon-left="mdiAccount" help="Prezime mentora" :error="getFirstErrorForField(v$, 'mentor_prezime')" placeholder="Prezime mentora" />
					</FormField>

					<FormField label="Email mentora" horizontal>
						<FormControl v-model="form.mentor_email" :icon-left="mdiMail" :error="getFirstErrorForField(v$, 'mentor_email')" type="email" help="Email mentora (provjeriti dvaput)" placeholder="Email mentora" />
					</FormField>
					<BaseDivider />
					<FormField label="Detaljan opis zadatka" horizontal>
						<FormControl v-model="form.detaljan_opis_zadatka" type="textarea" :error="getFirstErrorForField(v$, 'detaljan_opis_zadatka')" :icon-left="mdiTextLong" placeholder="Detaljno opišite zadatak koji će se izvršavati na praksi." />
					</FormField>

					<FormField label="Dogovoreni broj sati" horizontal>
						<FormField addons>
							<FormControl v-model="form.dogovoreni_broj_sati" type="number" :icon-left="mdiClockTimeFiveOutline" placeholder="Dogovoreni broj sati" :error="getFirstErrorForField(v$, 'dogovoreni_broj_sati')" expanded />
						</FormField>
					</FormField>

					<FormField label="Datum početka" horizontal>
						<FormControl v-model="form.pocetak_prakse" :error="getFirstErrorForField(v$, 'pocetak_prakse')" type="date" />
					</FormField>

					<FormField label="Datum završetka" horizontal>
						<FormControl v-model="form.kraj_prakse" :error="getFirstErrorForField(v$, 'kraj_prakse')" type="date" />
					</FormField>

					<BaseDivider />

					<FormField label="Praksu ću izvršavati" horizontal>
						<FormCheckRadioGroup v-model="form.mjesto_izvrsavanja" name="sample-radio-two" type="radio" :error="getFirstErrorForField(v$, 'mjesto_izvrsavanja')" :options="nacinIzvrsavanjeRadioOptions" />
					</FormField>

					<BaseDivider />

					<FormField label="Potvrda" horizontal>
						<FormCheckRadio
							v-model="form.kontakt_potvrda"
							name="sample-checkbox-two"
							:options="checkboxOptions"
							:error="getFirstErrorForField(v$, 'kontakt_potvrda')"
							label="Potvrđujem da sam kontaktirao poslodavca i dogovorio detalje koji su ovdje uneseni."
							is-column />
					</FormField>
					<BaseDivider />

					<FormField horizontal grouped>
						<BaseButton label="Pošalji" type="submit" :disabled="!form.kontakt_potvrda" :loading="isLoading" color="fipu_blue" />
					</FormField>
				</CardBox>
			</div>
		</SectionMain>
	</component>
</template>
<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
