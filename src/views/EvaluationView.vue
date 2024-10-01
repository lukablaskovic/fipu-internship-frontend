<script setup>
import { mdiAccountTie, mdiAccount, mdiClipboardCheck, mdiCloseCircle } from "@mdi/js";
import Utils from "@/helpers/utils.js";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { router } from "@/router";

import { adminStore, studentStore, snackBarStore } from "@/main.js";
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

const process_instance_id = ref(null);

const assignemntDetails = ref(null);
const instanceInfo = ref(null);
const pendingTaskInfo = ref(null);
const route = useRoute();

let assignment = ref(null);
let studentInfo = ref(null);

const error = ref(false);

onMounted(async () => {
	process_instance_id.value = route.params.process_instance_id;

	instanceInfo.value = await studentStore.getInstanceInfo(process_instance_id.value);
	if (instanceInfo.value == null) {
		error.value = true;
		return;
	}

	assignemntDetails.value = await studentStore.getAssignmentDetails(instanceInfo.value.variables["Alocirani_zadatak"]);
	assignment.value = assignemntDetails.value.data.results[0];

	pendingTaskInfo.value = await adminStore.getTaskInfo(process_instance_id.value, instanceInfo.value.pending[0]);

	studentInfo.value = {
		student_ime: instanceInfo.value.variables["student_ime"],
		student_prezime: instanceInfo.value.variables["student_prezime"],
		student_email: instanceInfo.value.variables["student_email"],
		student_godina_studija: instanceInfo.value.variables["student_godina_studija"],
	};
});
const formDynamicValues = ref({});
const isLoading = ref(false);

async function handleNewInstance() {
	isLoading.value = true;

	adminStore.handleNewInstance(process_instance_id.value, instanceInfo.value.pending[0], formDynamicValues.value);

	if (UserTaskMappings.getTaskProperty(instanceInfo.value.pending[0], "snackbar_msg")) {
		snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(instanceInfo.value.pending[0], "snackbar_msg"), UserTaskMappings.getTaskProperty(instanceInfo.value.pending[0], "snackbar_color"));
	}
	await Utils.wait(2);
	isLoading.value = false;

	router.push("/");
}
const disabledCondition = ref(true);

const updateDisabledCondition = (allFilled) => {
	disabledCondition.value = !allFilled;
};
</script>

<template>
	<div>
		<SectionMain v-if="!error">
			<SectionTitleLineWithButton :icon="instanceInfo != null && instanceInfo.pending[0] == 'evaluacija_poslodavac' ? mdiAccount : mdiCloseCircle" :title="instanceInfo != null && instanceInfo.pending[0] == 'evaluacija_poslodavac' ? 'Student' : 'Greška'" main
				><a href="" target="_blank"> <img :src="FIPU_praksa_logo_transparent" class="max-h-14 object-contain" /> </a>
			</SectionTitleLineWithButton>

			<div v-if="instanceInfo != null && instanceInfo.pending[0] == 'evaluacija_poslodavac'">
				<div class="mb-4" v-if="studentInfo">
					<h1 class="text-lg font-bold sm:text-2xl">{{ studentInfo.student_ime }} {{ studentInfo.student_prezime }}</h1>
					<h3 class="text-base font-bold">
						{{ studentInfo.student_email }}
					</h3>

					<p class="text-small mt-1 font-medium text-gray-600">
						{{ StudentMappings.getGodinaStudija(studentInfo.student_godina_studija) }}
					</p>
				</div>

				<SectionTitleLineWithButton :icon="mdiClipboardCheck" title="Alocirani zadatak" main> </SectionTitleLineWithButton>
				<CardBoxAllocation v-if="assignment != null" :data="assignment"></CardBoxAllocation>

				<SectionTitleLineWithButton :icon="mdiAccountTie" title="Evaluacija kandidata" class="mt-4" main> </SectionTitleLineWithButton>

				<p class="mb-4">Molimo da nakon što evaluirate studenta (bilo to kroz intervju, tehnički ispit ili pak bez procesa selekcije) potvrdite prihvaćate li studenta za obavljanje prakse u Vašem poduzeću.</p>

				<FormDynamic v-if="pendingTaskInfo != null" v-model="formDynamicValues" class="mb-4" :form-fields="pendingTaskInfo.form_fields" :variables="instanceInfo.variables" :documentation="pendingTaskInfo.documentation" @all-fields-filled="updateDisabledCondition" />

				<BaseButton v-if="formDynamicValues['kandidat_odobren']" class="mb-4" label="Potvrdi" :loading="isLoading" color="fipu_blue" @disabled="disabledCondition" @click="handleNewInstance()" />
			</div>
			<div v-else>
				<SectionMain>
					<b>Greška!</b>
					<div v-if="instanceInfo == null">Ne postoji proces s ID-em {{ process_instance_id }}.</div>
					<div v-else-if="instanceInfo.pending[0] != 'evaluacija_poslodavac'">Studenta je trenutno nemoguće evaluirati budući da ga voditelj prakse još nije alocirao na zadatak.</div>
					<p class="mt-4">Molimo pokušajte ponovno kasnije ili kontaktirajte voditelja prakse.</p>
				</SectionMain>
			</div>
		</SectionMain>

		<FooterBar></FooterBar>
		<SnackBar />
	</div>
</template>
