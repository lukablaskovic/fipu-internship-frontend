<script setup>
import { BPMN_STUDIO_URL } from "@/config.js";
import { ref, onMounted } from "vue";
import { mdiRefresh, mdiSourceBranch } from "@mdi/js";
import { Model } from "@/services/bpmn_engine_api";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const loading = ref(true);
const deployments = ref(null);
async function refresh() {
	loading.value = true;
	deployments.value = (await Model.deployments())?.deployments ?? null;
	loading.value = false;
}
onMounted(refresh);
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiSourceBranch" title="BPMN engine" main>
				<BaseButton :icon="mdiRefresh" label="Osvježi" :disabled="loading" @click="refresh" />
			</SectionTitleLineWithButton>
			<p role="status" class="mb-5">{{ loading ? "Učitavanje stanja…" : deployments ? "Engine je dostupan." : "Dohvat stanja nije uspio." }}</p>
			<template v-if="!loading && deployments">
				<h2 class="mb-2 text-xl font-semibold">Objavljeni procesi</h2>
				<p class="mb-4">Nove prakse koriste prikazane verzije. Broj aktivnih praksi obuhvaća sve verzije modela.</p>
				<div class="grid gap-4 md:grid-cols-2">
					<CardBox v-for="model in deployments" :key="model.model_path">
						<h3 class="text-lg font-semibold">{{ model.model_path.replace(/^strucna_praksa_/, "Model ").replace(/\.bpmn$/, "") }} · v{{ model.version }}</h3>
						<p>{{ model.process }}</p>
						<p class="mt-4">Aktivne prakse: <strong>{{ model.active }}</strong></p>
						<a class="mt-3 inline-block text-fipu_blue underline" :href="`${BPMN_STUDIO_URL}/admin/model/${encodeURIComponent(model.model_path.replace(/\.bpmn$/, ''))}/${model.version}`" target="_blank" rel="noopener">Otvori u BPMN Studiju ↗</a>
						<div class="mt-4">
							<h4 class="font-semibold">Prethodne verzije</h4>
							<p v-if="!model.previous_versions?.length">Nema prethodnih verzija.</p>
							<ul v-else><li v-for="version in model.previous_versions" :key="version">
								<a class="text-fipu_blue underline" :href="`${BPMN_STUDIO_URL}/admin/model/${encodeURIComponent(model.model_path.replace(/\.bpmn$/, ''))}/${version}`" target="_blank" rel="noopener">{{ model.model_path.replace(/^strucna_praksa_/, "Model ").replace(/\.bpmn$/, "") }} · v{{ version }}</a>
							</li></ul>
						</div>
					</CardBox>
				</div>
				<p v-if="!deployments.length">Nema objavljenih procesa.</p>
			</template>
		</SectionMain>
	</LayoutAuthenticated>
</template>
