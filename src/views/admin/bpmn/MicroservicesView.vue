<script setup>
import { ref, onMounted } from "vue";
import { mdiMonitorCellphone, mdiCloudCog } from "@mdi/js";

import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableMicroservices from "@/components/Tables/TableMicroservices.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

import { Control } from "@/services/microservices_control";

const servicesStatus = ref({});
const loading = ref(true);

onMounted(async () => {
	try {
		servicesStatus.value = await Control.checkAllServiceStatuses();
	} catch (error) {
		console.error("Failed to fetch service statuses:", error);
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div>
		<LayoutAuthenticated>
			<LoadingOverlay :is-active="loading" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>

			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiCloudCog" title="Mikroservisi" main> </SectionTitleLineWithButton>

				<NotificationBar color="info" :icon="mdiMonitorCellphone"> <b>Responsive table.</b> Collapses on mobile </NotificationBar>

				<CardBox v-if="Object.keys(servicesStatus).length" has-table>
					<TableMicroservices :services="servicesStatus" />
				</CardBox>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
