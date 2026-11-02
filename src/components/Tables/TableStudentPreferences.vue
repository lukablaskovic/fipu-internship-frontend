<script setup>
import TableCellText from "@/components/Tables/TableCellText.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import { ref, onMounted } from "vue";

import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import { mdiEye } from "@mdi/js";

import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { useAdminStore } from "@/stores/admin_store";

const adminStore = useAdminStore();


const props = defineProps({
	preferencesId: { type: [Number, String], default: null },
	checkable: Boolean,
});

const isModalActive = ref(null);
const registeredPreferences = ref([]);

const prviOdabir = ref({});
const drugiOdabir = ref({});
const treciOdabir = ref({});

const selectedAssignmentId = defineModel({ type: [String, Number], default: null });
const preferencesArray = ref([]);
const dataLoaded = ref(false);

onMounted(async () => {
	registeredPreferences.value = await adminStore.getPreferencesDetailed(props.preferencesId);
	registeredPreferences.value = registeredPreferences.value.data;
	prviOdabir.value = registeredPreferences.value["Prvi_odabir"]?.[0]?.details;
	drugiOdabir.value = registeredPreferences.value["Drugi_odabir"]?.[0]?.details;
	treciOdabir.value = registeredPreferences.value["Treci_odabir"]?.[0]?.details;

	preferencesArray.value = [prviOdabir.value, drugiOdabir.value, treciOdabir.value]
		.map((assignment, index) => ({ assignment, order: index + 1 }))
		.filter(({ assignment }) => assignment);
	dataLoaded.value = true;
});
</script>

<template>
	<CardBoxModal v-if="isModalActive" v-model="isModalActive" large button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="isModalActive = null">
		<CardboxAllocation :data="isModalActive"></CardboxAllocation>

		<br />
	</CardBoxModal>

	<LoadingOverlay :is-active="!dataLoaded" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>

	<CardBoxComponentEmpty v-if="dataLoaded && !preferencesArray.length" />
	<table v-if="preferencesArray.length">
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
				v-for="{ assignment, order } in preferencesArray"
				:key="assignment['id_zadatak']"
				:class="{
					'selected-row': selectedAssignmentId === assignment['id_zadatak'],
					'cursor-pointer': true,
				}"
				@click="selectedAssignmentId = assignment.id_zadatak">
				<td data-label="Odabir"><TableCellText :value="order" /></td>
				<td data-label="ID Zadatka"><TableCellText :value="assignment['id_zadatak']" /></td>
				<td data-label="Kontakt email"><TableCellText :value="assignment['poslodavac_email']" /></td>
				<td data-label="Lokacija"><TableCellText :value="assignment['lokacija']" /></td>
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
