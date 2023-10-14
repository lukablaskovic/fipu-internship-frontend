<script setup>
import { ref, onMounted, onBeforeUnmount, shallowReactive, triggerRef } from "vue";
import { Control } from "@/services/microservices_control";
import { mdiRefresh, mdiCheckCircleOutline, mdiAlertCircle } from "@mdi/js";
import moment from "@/moment-setup";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import SkeletonLoaderTable from "@/components/SkeletonLoaderTable.vue";
import IconRounded from "@/components/IconRounded.vue";

const props = defineProps({
	checkable: Boolean,
	services: {
		type: Object,
		required: true,
	},
});

let intervalId, nowIntervalId;
const EVERY_N_MINUTES = 5;
const now = ref(new Date());
const localServices = ref(shallowReactive({ ...props.services }));

onMounted(() => {
	const updateServiceStatuses = async () => {
		localServices.value = await Control.checkAllServiceStatuses();
	};
	intervalId = setInterval(updateServiceStatuses, EVERY_N_MINUTES * 60 * 1000);
	updateServiceStatuses();
	nowIntervalId = setInterval(() => {
		now.value = new Date();
	}, 60 * 100);
});

onBeforeUnmount(() => {
	clearInterval(intervalId);
	clearInterval(nowIntervalId);
});

let formatTimestamp = (timestamp) => {
	return moment(timestamp).from(now.value);
};

async function checkServiceStatus(serviceName) {
	localServices.value[serviceName].loading = true;
	try {
		let { [serviceName]: updatedService } = await Control.checkServiceStatus(serviceName);
		localServices.value = {
			...localServices.value,
			[serviceName]: {
				...localServices.value[serviceName],
				...updatedService,
				status_check_timestamp: new Date(),
			},
		};
		triggerRef(localServices);
	} finally {
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
				<th>Akcije</th>
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
						{{ formatTimestamp(service["status_check_timestamp"]) }}
					</td>

					<td class="before:hidden lg:w-1 whitespace-nowrap">
						<BaseButtons type="justify-start lg:justify-end" no-wrap>
							<BaseButton color="fipu_blue" :icon="mdiRefresh" small @click="checkServiceStatus(serviceName)" />
						</BaseButtons>
					</td>
				</tr>
			</template>
		</tbody>
	</table>
</template>
