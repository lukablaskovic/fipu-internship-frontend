<script setup>
import { ref } from "vue";
import { Control } from "@/services/microservices_control";
import { mdiRefresh, mdiRestartAlert, mdiCheckCircleOutline, mdiAlertCircle } from "@mdi/js";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import SkeletonLoaderTable from "@/components/SkeletonLoaderTable.vue";
import IconRounded from "@/components/IconRounded.vue";
import moment from "@/moment-setup";
import CardBoxModal from "../Cardbox/CardBoxModal.vue";
const props = defineProps({
	checkable: Boolean,
	services: {
		type: Object,
		required: true,
	},
});

// Making a local reactive copy of services
const localServices = ref({ ...props.services });

const restartConfirmModal = ref(false);
async function checkServiceStatus(serviceName) {
	localServices.value[serviceName].loading = true;

	try {
		let { [serviceName]: updatedService } = await Control.checkServiceStatus(serviceName);
		localServices.value[serviceName] = {
			...localServices.value[serviceName],
			...updatedService,
		};
	} finally {
		// Reset loading state after fetching data or if an error occurs
		localServices.value[serviceName].loading = false;
	}
}
</script>
<template>
	<table>
		<thead>
			<tr>
				<th v-if="checkable"></th>
				<th>Naziv</th>
				<th>Status</th>
				<th>Poruka</th>
				<th>URL</th>
				<th>Zadnja provjera</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			<template v-for="(service, serviceName) in localServices">
				<!-- Display the skeleton loader when the service is loading -->
				<SkeletonLoaderTable v-if="service.loading" :key="'skeleton-' + serviceName" :checkable="checkable" />

				<!-- Display the actual row when the service isn't loading -->
				<tr v-else :key="serviceName">
					<TableCheckboxCell v-if="checkable" />

					<td data-label="Naziv">
						{{ serviceName }}
					</td>
					<td data-label="Status" class="flex items-center justify-center">
						<IconRounded v-if="service['status'] == 'OK'" :icon="mdiCheckCircleOutline" color="success" />
						<IconRounded v-else :icon="mdiAlertCircle" color="danger" />
					</td>
					<td data-label="Poruka">
						{{ service["message"] }}
					</td>
					<td data-label="URL" class="underline text-fipu_dark_blue">
						<a :href="service['url']" target="_blank"> {{ service["url"] }}</a>
					</td>
					<td data-label="Zadnji put aktivan">
						{{ moment(service["status_check_timestamp"]).fromNow() }}
					</td>
					<td class="before:hidden lg:w-1 whitespace-nowrap">
						<BaseButtons type="justify-start lg:justify-end" no-wrap>
							<BaseButton color="fipu_blue" :icon="mdiRefresh" small @click="checkServiceStatus(serviceName)" />
							<BaseButton color="danger" :icon="mdiRestartAlert" small @click="restartConfirmModal = true" />
						</BaseButtons>
					</td>
				</tr>
			</template>
			<CardBoxModal v-model="restartConfirmModal" title="Jeste li sigurni da želite restartirati odabrani servis?" button-label="Restart" has-cancel @cancel="console.log('NO')" @confirm="console.log('restart')">
				<p class="text-center mb-4">To može dovesti do prekida rada aplikacije.</p>
			</CardBoxModal>
		</tbody>
	</table>
</template>
