<script setup>
import { onMounted, ref } from "vue";
import { mdiSecurity } from "@mdi/js";
import { Admin } from "@/services/baserow_client_api";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";

const emails = ref();
onMounted(async () => { emails.value = await Admin.listAdministrators(); });
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiSecurity" title="Administratori" main />
			<p v-if="emails === undefined" role="status">Učitavanje administratora…</p>
			<p v-else-if="emails === null" role="alert">Dohvat administratora nije uspio.</p>
			<p v-else-if="!emails.length">Nema administratora.</p>
			<CardBox v-else has-table>
				<table aria-label="Administratori">
					<thead><tr><th scope="col">E-mail</th></tr></thead>
					<tbody><tr v-for="email in emails" :key="email"><td data-label="E-mail">{{ email }}</td></tr></tbody>
				</table>
			</CardBox>
		</SectionMain>
	</LayoutAuthenticated>
</template>
