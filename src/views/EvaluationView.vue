<script setup>
import { mdiAccountTie, mdiAccount, mdiClipboardCheck } from "@mdi/js";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { router } from "@/router";

import { Student } from "@/services/baserow_client_api";
import { ProcessInstance } from "@/services/bpmn_engine_api";
import { useSnackBarStore } from "@/stores/snackbar_store";

import { UserTaskMappings } from "@/helpers/maps";
import { StudentMappings } from "@/helpers/maps";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormDynamic from "@/components/Form/FormDynamic.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import SnackBar from "@/components/Premium/SnackBar.vue";
import FooterBar from "@/components/FooterBar.vue";

import FIPU_praksa_logo_transparent from "/FIPU_praksa_logo_transparent.svg";

const snackBarStore = useSnackBarStore();

const route = useRoute();
const evaluation = ref(null);
const assignment = ref(null);
const error = ref(false);
const evaluationTask = "evaluacija_poslodavac";

onMounted(async () => {
	evaluation.value = await ProcessInstance.evaluation(route.params.process_instance_id, route.hash.slice(1));
	if (!evaluation.value) {
		error.value = true;
		return;
	}
	const vars = evaluation.value.variables;
	const details = await Student.getAssignmentDetails({ search: vars.Alocirani_zadatak });
	assignment.value = details?.data?.results?.find(row => row.id_zadatak === vars.Alocirani_zadatak);
});
const formDynamicValues = ref({});
const isLoading = ref(false);

async function handleNewInstance() {
	if (isLoading.value) return;
	isLoading.value = true;
	try {
		const task = evaluationTask;
		const result = await ProcessInstance.evaluation(route.params.process_instance_id, route.hash.slice(1), { kandidat_odobren: formDynamicValues.value.kandidat_odobren });
		if (result?.status !== "OK") throw new Error("Evaluation failed");
		if (UserTaskMappings.getTaskProperty(task, "snackbar_msg")) {
			snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(task, "snackbar_msg"), UserTaskMappings.getTaskProperty(task, "snackbar_color"));
		}
		await router.push("/");
	} catch (error) {
		snackBarStore.pushMessage("Evaluacija nije spremljena. Molimo pokušajte ponovno.", "danger");
	} finally {
		isLoading.value = false;
	}
}

const disabledCondition = ref(true);

const updateDisabledCondition = (allFilled) => {
	disabledCondition.value = !allFilled;
};
</script>

<template>
	<div>
		<SectionMain v-if="evaluation">
			<SectionTitleLineWithButton :icon="mdiAccount" title="Student" main>
				<img :src="FIPU_praksa_logo_transparent" alt="FIPU Praksa" class="max-h-14 object-contain" />
			</SectionTitleLineWithButton>
			<div>
				<div class="mb-4">
					<h1 class="text-lg font-bold sm:text-2xl">{{ evaluation.variables.student_ime }} {{ evaluation.variables.student_prezime }}</h1>
					<h3 class="text-base font-bold">
						{{ evaluation.variables.student_email }}
					</h3>

					<p class="text-small mt-1 font-medium text-gray-600">
						{{ StudentMappings.getGodinaStudija(evaluation.variables.student_godina_studija) }}
					</p>
				</div>

				<SectionTitleLineWithButton :icon="mdiClipboardCheck" title="Alocirani zadatak" main> </SectionTitleLineWithButton>
				<CardBoxAllocation v-if="assignment" :data="assignment" />
				<p v-else>{{ evaluation.variables.Alocirani_zadatak }} · {{ evaluation.variables.opis_zadatka }}</p>

				<SectionTitleLineWithButton :icon="mdiAccountTie" title="Evaluacija kandidata" class="mt-4" main> </SectionTitleLineWithButton>

				<p class="mb-4">Molimo da nakon što evaluirate studenta (bilo to kroz intervju, tehnički ispit ili pak bez procesa selekcije) potvrdite prihvaćate li studenta za obavljanje prakse u Vašem poduzeću.</p>

				<FormDynamic v-model="formDynamicValues" class="mb-4 rounded-md p-1" :form-fields="evaluation.task.form_fields" :variables="evaluation.variables" :documentation="evaluation.task.documentation" @all-fields-filled="updateDisabledCondition" />

				<BaseButton v-if="formDynamicValues['kandidat_odobren']" class="mb-4" label="Potvrdi" :loading="isLoading" color="fipu_blue" :disabled="disabledCondition" @click="handleNewInstance()" />
			</div>
		</SectionMain>

		<SectionMain v-else-if="error">Poveznica za evaluaciju nije važeća ili je evaluacija završena. Za novu poveznicu obratite se voditelju prakse.</SectionMain>
		<SectionMain v-else>Učitavanje evaluacije…</SectionMain>
		<FooterBar></FooterBar>
		<SnackBar />
	</div>
</template>
