<script setup>
import { mdiClipboardTextOutline, mdiAccountMultiple, mdiClipboardPlusOutline, mdiClipboardCheck, mdiContentCopy, mdiClipboardTextOff, mdiClipboardText, mdiClipboardTextMultiple } from "@mdi/js";
import { mainStore, adminStore } from "@/main";
import { ref } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import TableRejectedAssignments from "@/components/Tables/TableRejectedAssignments.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TableNewAssignments from "@/components/Tables/TableNewAssignments.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormControl from "@/components/Form/FormControl.vue";
import IconTextLink from "@/components/IconTextLink.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import PillTag from "@/components/PillTag/PillTag.vue";

import { endpoints } from "@/config.js";

const VITE_FRONTEND_URL = endpoints.VITE_FRONTEND_URL;

const addNewAssignmentLink = ref(`${VITE_FRONTEND_URL}/poslodavci/novi-zadatak`);
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiClipboardPlusOutline" title="Novi zadaci (neodobreni)" main> </SectionTitleLineWithButton>

				<FormField class="md:w-1/2" label="Forma za prijavu novog zadatka">
					<FormControl v-model="addNewAssignmentLink" :icon-left="mdiClipboardCheck" :icon-right="mdiContentCopy" name="addNewAssignmentLink" readonly copyable />
				</FormField>

				<p class="mb-4">U tablici ispod se nalaze novo-prijavljeni zadaci koje je potrebno proučiti te odobriti kako bi ih studenti mogli prijaviti, ili odbiti ukoliko ne zadovoljavaju definirane zahtjeve.</p>

				<span class="mb-2 flex flex-wrap text-base">
					<!--	<b> Upozorenje!</b> &nbsp; Ako odobravate/odbijate zadatke za određenog studenta koji radi praksu po Modelu B, to morate <span class="ml-1 inline-flex"> učiniti kroz <IconTextLink :to="'/studenti'" :icon="mdiAccountMultiple" :text="'Studenti'"></IconTextLink>.</span>-->
				</span>

				<CardBox has-table>
					<TableNewAssignments />
				</CardBox>

				<CardBox v-if="!adminStore.newAssignments.length">
					<CardBoxComponentEmpty />
				</CardBox>

				<SectionTitleLineWithButton class="mt-8" :icon="mdiClipboardTextOutline" title="Aktivni (odobreni) zadaci" main> </SectionTitleLineWithButton>
				<div class="flex flex-row">
					<div class="mb-4">
						<PillTag class="cursor-pointer" :left="false" :icon="adminStore.availableAssignmentsFilter ? mdiClipboardText : mdiClipboardTextMultiple" :color="adminStore.availableAssignmentsFilter ? 'success' : 'info'" :label="adminStore.availableAssignmentsFilter ? 'Samo slobodni' : 'Svi zadaci'" @click="adminStore.availableAssignmentsFilter = !adminStore.availableAssignmentsFilter" />
					</div>
				</div>
				<CardBox has-table>
					<TableAvailableAssignments />
				</CardBox>

				<SectionTitleLineWithButton class="mt-8" :icon="mdiClipboardTextOff" title="Odbijeni zadaci" main> </SectionTitleLineWithButton>

				<CardBox has-table>
					<TableRejectedAssignments />
				</CardBox>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
<style scoped>
.copy-container {
	position: relative;
	cursor: pointer;
}

.copy-icon {
	position: absolute;
	right: 0.5rem;
	top: 0.5rem;
	opacity: 0;
	transition: opacity 0.2s;
}

.copy-container:hover .copy-icon {
	opacity: 1;
}
</style>
