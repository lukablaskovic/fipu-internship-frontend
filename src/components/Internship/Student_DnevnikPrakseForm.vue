<script setup>
import { mdiLaptop, mdiBallot, mdiNotebook, mdiBriefcase } from "@mdi/js";
import { ref, computed, onMounted, reactive } from "vue";

import { getFirstErrorForField } from "@/helpers/validators";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";
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
const studentData = ref(null);
const allocated_assignment = ref(null);
onMounted(async () => {
	studentData.value = await studentStore.getInstanceInfo(mainStore.currentUser.internship_process.id);
	if (studentStore.allocated_assignment == null) {
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

//ispunjavanje_prijavnice_student
const form = reactive({
	potvrda_attachment: null,
	dnevnik_attachment: null,
	nastavak_radnog_odnosa: false,
	prijavljen_rok: null,
});

const rules = {
	potvrda_attachment: {
		required: helpers.withMessage("Stavka je obavezna", required),
	},
	dnevnik_attachment: {
		required: helpers.withMessage("Stavka je obavezna", required),
	},
	prijavljen_rok: {
		required: helpers.withMessage("Stavka je obavezna", required),
	},
};

const v$ = useVuelidate(rules, form);

let isLoading = ref(false);

async function submit_diary_form() {
	isLoading.value = true;

	v$.value.$touch();
	if (v$.value.$invalid) {
		isLoading.value = false;
		return;
	}

	if (form.potvrda_attachment == null || form.dnevnik_attachment == null || form.prijavljen_rok == null || form.nastavak_radnog_odnosa == null) {
		snackBarStore.pushMessage("Molimo ispunite sva obavezna polja.", "error");
		isLoading.value = false;
		return;
	}

	await studentStore.submitDiaryForm(form);
	if (UserTaskMappings.getTaskProperty(studentStore.student_process_instance_data.pending[0], "snackbar_msg")) {
		snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(studentStore.student_process_instance_data.pending[0], "snackbar_msg"), UserTaskMappings.getTaskProperty(studentStore.student_process_instance_data.pending[0], "snackbar_color"));
	}
	isLoading.value = false;
	await Utils.wait(2);
	location.reload();
}
</script>

<template>
	<component :is="Layout">
		<SectionMain v-if="allocated_assignment != null" class="relative">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj: </b> {{ mainStore.voditelj_prakse }}</p>
			<img src="/illustrations/in_progress.svg" class="absolute right-0 top-0 mr-6 mt-4 hidden w-1/5 max-w-full md:block" />

			<SectionTitleLineWithButton :icon="mdiBriefcase" main class="mt-24" title="Izvođenje prakse u tijeku"></SectionTitleLineWithButton>
			<CardboxAllocation class="sm:mt-12" v-if="allocated_assignment != null" :data="allocated_assignment"></CardboxAllocation>

			<br />
			<hr />

			<br />
			<SectionTitleLineWithButton :icon="mdiNotebook" main title="Dnevnik prakse"></SectionTitleLineWithButton>
			<p><b>Nakon što ste završili praksu i ispunili sve vaše obaveze</b>, predajete dnevnik prakse skupa s ispunjenom potvrdom o obavljenoj praksi.</p>
			<p>Potvrdu ispunjava vaš mentor, vi predajete PDF sken (ili digitalno potpisani PDF) ispunjene potvrde.</p>
			<p>Dnevnik prakse je potrebno predati <b>prije datuma ispitnog roka</b>.</p>
			<br />
			<p>
				📓 Predložak za dnevnik prakse možete preuzeti
				<a href="https://bit.ly/fipu-praksa-template" target="_blank" class="cursor-pointer text-fipu_blue">ovdje</a>.
			</p>
			<p>
				📃 Praznu potvrdu o obavljenoj praksi možete preuzeti
				<a :href="studentData.variables.pdf_attachment_url" target="_blank" class="cursor-pointer text-fipu_blue">ovdje</a>.
			</p>
			<br />
			<hr />

			<div class="mb-6 grid grid-cols-1 gap-6">
				<CardBox :icon="mdiBallot" class="mb-6 lg:col-span-2 lg:mb-0 xl:col-span-3" is-form @submit.prevent="submit_diary_form">
					<CardBoxComponentTitle title="📓 Dnevnik prakse" />

					<FormField label="PDF dnevnika prakse" help="obavezno PDF format" horizontal>
						<FormFilePicker v-model="form.dnevnik_attachment" pdf :error="getFirstErrorForField(v$, 'dnevnik_attachment')" label="Prenesi" required />
					</FormField>

					<FormField
						label="PDF ispunjene potvrde o obavljenoj praksi"
						help="obavezno PDF format
"
						horizontal>
						<FormFilePicker v-model="form.potvrda_attachment" pdf :error="getFirstErrorForField(v$, 'potvrda_attachment')" label="Prenesi" required />
					</FormField>

					<BaseDivider />

					<FormField label="Datum ispitnog roka" horizontal>
						<FormControl v-model="form.prijavljen_rok" :error="getFirstErrorForField(v$, 'prijavljen_rok')" type="date" />
					</FormField>

					<FormField horizontal>
						<FormCheckRadio v-model="form.nastavak_radnog_odnosa" name="sample-checkbox-two" :options="checkboxOptions" label="Označi ako nastavljaš i dalje raditi u tvrtci ili ćeš ubrzo početi raditi honorarno." is-column />
					</FormField>

					<BaseDivider />

					<FormField horizontal grouped>
						<BaseButton label="Predaj" type="submit" :loading="isLoading" color="fipu_blue" />
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
