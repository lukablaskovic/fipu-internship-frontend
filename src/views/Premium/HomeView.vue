<script setup>
import { mdiAccountMultiple, mdiCartOutline, mdiChartTimelineVariant, mdiMonitorCellphone, mdiReload, mdiBell, mdiPlusCircle, mdiBroadcast, mdiBriefcaseVariant, mdiCalendarToday, mdiCameraSwitch, mdiChartPie, mdiCreditCardOutline } from "@mdi/js";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBoxAmountItem from "@/components/Premium/CardBoxAmountItem.vue";
import CardBoxProduct from "@/components/Premium/CardBoxProduct.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
import CardBoxTransaction from "@/components/CardBoxTransaction.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import * as chartConfig from "@/components/Charts/chart.config.js";
import NotificationBar from "@/components/NotificationBar.vue";
import { useSnackBarStore } from "@/stores/snackbar_store.js";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBoxClient from "@/components/CardBoxClient.vue";
import LineChart from "@/components/Charts/LineChart.vue";

import UserCard from "@/components/Premium/UserCard.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { ref, computed, watch, onMounted } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { useMainStore } from "@/stores/main.js";
import CardBox from "@/components/CardBox.vue";

const mainStore = useMainStore();

const snackBarStore = useSnackBarStore();

snackBarStore.pushMessage("Welcome back. This is demo", "contrast");

const userSwitchVal = ref(true);

watch(userSwitchVal, (value) => {
	if (value) {
		snackBarStore.pushMessage("Success! Now active", "success");
	} else {
		snackBarStore.pushMessage("Done! Now inactive", "danger");
	}
});

const layoutStore = useLayoutStore();

const isLg = computed(() => layoutStore.isLg);

const isMd = computed(() => layoutStore.isMd);

watch([isLg, isMd], () => {
	fillChartData();
});

const chartData = ref(null);

const fillChartData = () => {
	let points = 4;

	if (isLg.value) {
		points = 9;
	} else if (isMd.value) {
		points = 6;
	}

	chartData.value = chartConfig.sampleChartData(points);
};

onMounted(() => {
	fillChartData();
});

const clientBarItems = computed(() => mainStore.clients.slice(0, 3));

const transactionBarItems = computed(() => mainStore.history);

const productBarItems = computed(() => mainStore.products);
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main>
				<BaseButton href="https://justboil.me/tailwind-admin-templates/vue-dashboard/" label="Buy dashboard" :icon="mdiCreditCardOutline" color="contrast" rounded-full small />
			</SectionTitleLineWithButton>
			<div class="mb-6 grid grid-cols-12 gap-6">
				<div class="col-span-12 sm:col-span-6 xl:col-span-3">
					<CardBoxWidget trend="12%" trend-type="up" color="text-green-500" :icon="mdiAccountMultiple" :number="512" label="Clients" />
				</div>
				<div class="col-span-12 sm:col-span-6 xl:col-span-3">
					<CardBoxWidget trend="12%" trend-type="down" color="text-blue-500" :icon="mdiCartOutline" :number="7770" prefix="$" label="Sales" />
				</div>
				<div class="col-span-12 sm:col-span-6 xl:col-span-3">
					<CardBoxWidget trend="Overflow" trend-type="alert" color="text-red-500" :icon="mdiChartTimelineVariant" :number="256" suffix="%" label="Performance" />
				</div>
				<div class="col-span-12 sm:col-span-6 xl:col-span-3">
					<CardBoxWidget trend="Last 24 hours" trend-type="info" color="text-yellow-500" :icon="mdiBell" :number="24" label="Alerts" />
				</div>
			</div>

			<div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
				<UserCard />
				<div class="flex flex-col">
					<CardBoxClient v-for="client in clientBarItems" :key="client.id" :name="client.name" :login="client.login" :date="client.created" :progress="client.progress" />
				</div>
			</div>

			<SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Finance" />

			<div class="mb-6 grid grid-cols-1 xl:grid-cols-4 xl:gap-6">
				<div class="mb-6 xl:col-span-3 xl:mb-0 xl:flex xl:flex-col">
					<CardBoxTransaction v-for="(transaction, index) in transactionBarItems" :key="index" :amount="transaction.amount" :date="transaction.date" :business="transaction.business" :type="transaction.type" :name="transaction.name" :account="transaction.account" />
				</div>
				<CardBox>
					<CardBoxAmountItem title="Unpaid balance" value="$120,489.67" :icon="mdiBriefcaseVariant" icon-type="info" divider />
					<CardBoxAmountItem title="Pending transactions" value="$756.49" :icon="mdiCalendarToday" icon-type="warning" divider />
					<CardBoxAmountItem title="Pending withdrawals" value="$50,124.28" :icon="mdiCameraSwitch" icon-type="danger" />
					<template #footer>
						<BaseButtons>
							<BaseButton color="info" :icon="mdiPlusCircle" label="Payout" />
							<BaseButton color="info" :icon="mdiBroadcast" outline />
						</BaseButtons>
					</template>
				</CardBox>
			</div>

			<SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
				<BaseButton :icon="mdiReload" color="whiteDark" @click="fillChartData" />
			</SectionTitleLineWithButton>

			<CardBox class="mb-6">
				<div class="grid grid-cols-1 gap-6 md:grid-cols-4">
					<div v-if="chartData" class="md:col-span-3">
						<LineChart :data="chartData" />
					</div>
					<div class="text-center md:text-right">
						<CardBoxAmountItem title="Checking Account" value="$33,908.37" trend="12%" trend-type="up" divider />
						<CardBoxAmountItem title="Auto Loan Account" value="$1,456.49" trend="Balance low" trend-type="alert" divider />
						<CardBoxAmountItem title="Home Loan Account" value="$98,726.20" trend="24%" trend-type="down" />
					</div>
				</div>
			</CardBox>

			<SectionTitleLineWithButton :icon="mdiChartPie" title="Products" />

			<CardBoxProduct v-for="product in productBarItems" :key="product.id" :product="product" />

			<SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" />

			<NotificationBar color="info" :icon="mdiMonitorCellphone"> <b>Responsive table.</b> Collapses on mobile </NotificationBar>

			<CardBox has-table>
				<TableSampleClients />
			</CardBox>
		</SectionMain>
	</LayoutAuthenticated>
</template>
