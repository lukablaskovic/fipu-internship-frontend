<script setup>
import StudentWithdrawAction from "@/components/Internship/StudentWithdrawAction.vue";
import InternshipPageHeader from "@/components/Internship/InternshipPageHeader.vue";

import { mdiBallot, mdiNotebook, mdiBriefcase } from "@mdi/js";
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

import { useSnackBarStore } from "@/stores/snackbar_store";
import { useStudentStore } from "@/stores/student_store";
import { useMainStore } from "@/stores/main_store";

import { UserTaskMappings } from "@/helpers/maps";

const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();
const studentStore = useStudentStore();
const allocated_assignment = ref(null);
onMounted(async () => {
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

const pdfRules = {
	required: helpers.withMessage("Stavka je obavezna", required),
	format: helpers.withMessage("Odaberite PDF datoteku.", file => !file || file.type === "application/pdf" || (!file.type && /\.pdf$/i.test(file.name))),
	size: helpers.withMessage("Datoteka je prevelika. Najveća dopuštena veličina je 10 MB po PDF-u.", file => !file || file.size <= 10 * 1024 * 1024),
	$autoDirty: true,
};

const rules = {
	potvrda_attachment: pdfRules,
	dnevnik_attachment: pdfRules,
	prijavljen_rok: {
		required: helpers.withMessage("Stavka je obavezna", required),
	},
};

const v$ = useVuelidate(rules, form);

const isLoading = ref(false);
const serverSizeError = ref("");

async function submit_diary_form() {
	if (isLoading.value) return;
	isLoading.value = true;
	serverSizeError.value = "";

	v$.value.$touch();
	if (v$.value.$invalid) {
		isLoading.value = false;
		return;
	}

	const task = studentStore.student_process_instance_data.pending[0];
	let saved = false;
	try {
		const result = await studentStore.submitDiaryForm(form);
		if (!result) throw new Error("Submission failed");
		saved = true;
		if (UserTaskMappings.getTaskProperty(task, "snackbar_msg")) {
			snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(task, "snackbar_msg"), UserTaskMappings.getTaskProperty(task, "snackbar_color"));
		}
		await studentStore.getPendingUserTask(mainStore.currentUser.internship_process.id);
	} catch (error) {
		if (!saved && error.response?.status === 413) {
			serverSizeError.value = "Poslužitelj je odbio privitke jer zahtjev premašuje ograničenje veličine. Ako su oba PDF-a unutar dopuštene veličine, javite se voditelju prakse.";
			return;
		}
		snackBarStore.pushMessage(saved ? "Podaci su spremljeni, ali stanje prakse nije osvježeno. Ponovno otvorite Moju praksu." : "Podaci nisu poslani. Molimo pokušajte ponovno ili kontaktirajte voditelja prakse.", "danger");
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<component :is="Layout">
		<SectionMain v-if="allocated_assignment != null" class="relative">
			<InternshipPageHeader />
			<img src="/illustrations/in_progress.svg" class="absolute right-0 top-0 mr-6 mt-4 hidden w-1/5 max-w-full md:block" />

			<SectionTitleLineWithButton :icon="mdiBriefcase" main class="mt-24" title="Izvođenje prakse u tijeku"></SectionTitleLineWithButton>
			<CardboxAllocation v-if="allocated_assignment != null" class="sm:mt-12" :data="allocated_assignment"></CardboxAllocation>

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
				<a href="/predlozak-dnevnika-prakse.docx" download class="cursor-pointer text-fipu_blue">ovdje</a>.
			</p>
			<p>
				📃 Praznu potvrdu o obavljenoj praksi možete preuzeti
				<a :href="studentStore.student_process_instance_data.variables?.pdf_attachment_url" target="_blank" class="cursor-pointer text-fipu_blue">ovdje</a>.
			</p>
			<br />
			<hr />

			<div class="mb-6 grid grid-cols-1 gap-6">
				<CardBox :icon="mdiBallot" class="mb-6 rounded-xl lg:col-span-2 lg:mb-0 xl:col-span-3" is-form novalidate @submit.prevent="submit_diary_form">
					<CardBoxComponentTitle title="Dnevnik prakse i potvrda o praksi" />

					<FormField :error="getFirstErrorForField(v$, 'dnevnik_attachment')" label="PDF dnevnika prakse" help="obavezno PDF format, maksimalno 10 MB" horizontal>
						<FormFilePicker v-model="form.dnevnik_attachment" pdf :disabled="isLoading" required @update:model-value="serverSizeError = ''" />
					</FormField>

					<FormField :error="getFirstErrorForField(v$, 'potvrda_attachment')" label="PDF ispunjene potvrde o obavljenoj praksi" help="obavezno PDF format, maksimalno 10 MB" horizontal>
						<FormFilePicker v-model="form.potvrda_attachment" pdf :disabled="isLoading" required @update:model-value="serverSizeError = ''" />
					</FormField>

					<BaseDivider />

					<FormField :error="getFirstErrorForField(v$, 'prijavljen_rok')" label="Datum ispitnog roka" horizontal>
						<FormControl v-model="form.prijavljen_rok" type="date" />
					</FormField>

					<FormField name="nastavak_radnog_odnosa" horizontal>
						<FormCheckRadio v-model="form.nastavak_radnog_odnosa" name="sample-checkbox-two" label="Označi ako nastavljaš i dalje raditi u tvrtci ili ćeš ubrzo početi raditi honorarno." is-column />
					</FormField>

					<BaseDivider />

					<p v-if="serverSizeError" role="alert" class="mb-4 text-red-600">{{ serverSizeError }}</p>
					<FormField horizontal grouped>
						<BaseButton label="Predaj" type="submit" :loading="isLoading" :disabled="v$.dnevnik_attachment.$error || v$.potvrda_attachment.$error" color="fipu_blue" />
					</FormField>
				</CardBox>
			</div>
			<StudentWithdrawAction />
		</SectionMain>
	</component>
</template>
<style scoped>
@reference "../../css/main.css";
.ghost {
	opacity: 0.5;
	background: theme("colors.fipu_light_blue / 25%");
}
</style>
