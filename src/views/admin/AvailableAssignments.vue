<script setup>
import { mdiClipboardTextOutline, mdiClipboardCheck, mdiContentCopy } from "@mdi/js";
import { useMainStore } from "@/stores/main_store";
import { ref } from "vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAssignments from "@/components/Tables/TableAssignments.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormControl from "@/components/Form/FormControl.vue";
import FormControlListbox from "@/components/Premium/FormControlListbox.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import { endpoints } from "@/config.js";

const mainStore = useMainStore();

const addNewAssignmentLink = ref(`${endpoints.VITE_FRONTEND_URL}/poslodavci/novi-zadatak`);
const search = ref("");
const statusOptions = [
	{ id: "all", label: "Svi statusi" },
	{ id: "u razradi", label: "Neodobreni" },
	{ id: "odobreno", label: "Odobreni" },
	{ id: "odbijeno", label: "Odbijeni" },
];
const availabilityOptions = [{ id: "all", label: "Sva mjesta" }, { id: "free", label: "Slobodna mjesta" }, { id: "full", label: "Popunjeni zadaci" }];
const status = ref(statusOptions[0]);
const availability = ref(availabilityOptions[0]);
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiClipboardTextOutline" title="Zadaci" main />
				<FormField class="md:w-1/2" label="Forma za prijavu novog zadatka">
					<FormControl v-model="addNewAssignmentLink" :icon-left="mdiClipboardCheck" :icon-right="mdiContentCopy" name="addNewAssignmentLink" readonly copyable />
				</FormField>
				<div class="table-filter-bar mb-3 flex flex-wrap items-center gap-2 text-sm">
					<input v-model="search" type="search" aria-label="Pretraži zadatke" placeholder="Zadatak, poslodavac, tehnologija ili lokacija…" class="min-w-0 basis-full rounded-lg border-gray-300 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-1 sm:basis-0" />
					<FormControlListbox v-model="status" :options="statusOptions" aria-label="Status zadatka" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
					<FormControlListbox v-model="availability" :options="availabilityOptions" aria-label="Dostupnost mjesta" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
				</div>
				<CardBox has-table>
					<TableAssignments :search="search" :status="status.id" :availability="availability.id" />
				</CardBox>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
