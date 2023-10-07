<script setup>
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";
import TableSampleClients from "@/components/Tables/TableSampleClients.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiTableBorder" title="Tables" main>
				<BaseButton href="https://github.com/justboil/admin-one-vue-tailwind" target="_blank" :icon="mdiGithub" label="Star on GitHub" color="contrast" rounded-full small />
			</SectionTitleLineWithButton>
			<NotificationBar color="info" :icon="mdiMonitorCellphone"> <b>Responsive table.</b> Collapses on mobile </NotificationBar>

			<CardBox class="mb-6" has-table>
				<TableSampleClients checkable />
			</CardBox>

			<SectionTitleLineWithButton :icon="mdiTableOff" title="Empty variation" />

			<NotificationBar color="danger" :icon="mdiTableOff"> <b>Empty table.</b> When there's nothing to show </NotificationBar>

			<CardBox>
				<CardBoxComponentEmpty />
			</CardBox>
		</SectionMain>
	</LayoutAuthenticated>
</template>
