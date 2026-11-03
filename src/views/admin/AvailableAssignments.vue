<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiClipboardTextOutline, mdiClipboardCheck, mdiContentCopy, mdiMagnify } from "@mdi/js";
import { useMainStore } from "@/stores/main_store";
import { ref } from "vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAssignments from "@/components/Tables/TableAssignments.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormControl from "@/components/Form/FormControl.vue";
import FormControlListbox from "@/components/Form/FormControlListbox.vue";
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
				<div class="table-filter-bar mb-3">
					<div class="relative min-w-0 basis-full sm:flex-1 sm:basis-0">
						<BaseIcon :path="mdiMagnify" :size="20" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" aria-hidden="true" />
						<input v-model="search" type="search" aria-label="Pretraži zadatke" placeholder="Zadatak, poslodavac, tehnologija ili lokacija…" class="table-filter-search w-full pl-10" />
					</div>
					<FormControlListbox v-model="status" :options="statusOptions" aria-label="Status zadatka" button-class="table-filter-select" />
					<FormControlListbox v-model="availability" :options="availabilityOptions" aria-label="Dostupnost mjesta" button-class="table-filter-select" />
				</div>
				<CardBox has-table>
					<TableAssignments :search="search" :status="status.id" :availability="availability.id" />
				</CardBox>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
