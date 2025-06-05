<script setup>
import { ref, onMounted } from "vue";

import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import { mdiEye } from "@mdi/js";

import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { adminStore } from "@/main.js";

defineProps({
	checkable: Boolean,
});

const isModalActive = ref(null);
const registeredPreferences = ref([]);

const prviOdabir = ref({});
const drugiOdabir = ref({});
const treciOdabir = ref({});

const selectedAssignmentId = ref(null);
const preferencesArray = ref([]);

const emit = defineEmits(["rowSelected"]);

const selectAssignment = (assignment) => {
	selectedAssignmentId.value = assignment["id_zadatak"];
	emit("rowSelected", assignment["id_zadatak"]);
};

onMounted(async () => {
	registeredPreferences.value = await adminStore.getPreferencesDetailed(adminStore.selectedStudent.process_instance_data.variables.id_preferencije);
	registeredPreferences.value = registeredPreferences.value.data;
	prviOdabir.value = registeredPreferences.value["Prvi_odabir"][0]["details"];
	drugiOdabir.value = registeredPreferences.value["Drugi_odabir"][0]["details"];
	treciOdabir.value = registeredPreferences.value["Treci_odabir"][0]["details"];

	preferencesArray.value = [prviOdabir.value, drugiOdabir.value, treciOdabir.value];
});
</script>

<template>
	<CardBoxModal v-if="isModalActive" v-model="isModalActive" button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="mainStore.activateLogoutModal(false)">
		<CardboxAllocation :data="isModalActive"></CardboxAllocation>

		<br />
	</CardBoxModal>

	<LoadingOverlay v-if="!preferencesArray.length" :is-active="!preferencesArray.length" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>

	<table v-else>
		<thead class="text-sm">
			<tr>
				<th>Odabir</th>
				<th>ID Zadatka</th>
				<th>Kontakt email</th>
				<th>Lokacija</th>
				<th />
			</tr>
		</thead>
		<tbody class="text-sm">
			<tr
				v-for="(assignment, index) in preferencesArray"
				:key="assignment['id_zadatak']"
				:class="{
					'selected-row': selectedAssignmentId === assignment['id_zadatak'],
					'cursor-pointer': true,
				}"
				@click="selectAssignment(assignment)">
				<td data-label="Odabir">{{ index + 1 }}</td>
				<td data-label="ID Zadatka">{{ assignment["id_zadatak"] }}</td>
				<td data-label="Kontakt email">{{ assignment["poslodavac_email"] }}</td>
				<td data-label="Lokacija">{{ assignment["lokacija"] }}</td>
				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiEye" small @click="isModalActive = assignment" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped></style>
