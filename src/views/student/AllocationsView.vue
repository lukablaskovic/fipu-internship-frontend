<script setup>
import { mdiClipboardCheck, mdiFilePdfBox } from "@mdi/js";

import { adminStore } from "@/main.js";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAllocations from "@/components/Tables/TableAllocations.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
</script>

<template>
	<div>
		<LayoutAuthenticated>
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiClipboardCheck" title="Alokacije na praksu" main> </SectionTitleLineWithButton>

				<CardBox has-table>
					<TableAllocations />
				</CardBox>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
