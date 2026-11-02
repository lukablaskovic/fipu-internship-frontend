<script setup>
import { BPMN_STUDIO_URL } from "@/config.js";
import { ref, onMounted } from "vue";
import { mdiRefresh, mdiSourceBranch } from "@mdi/js";
import { Model, ProcessInstance } from "@/services/bpmn_engine_api";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const loading = ref(true);
const deployments = ref(null);
const incidents = ref([]);
const confirmed = ref([]);
const retrying = ref(false);
const notice = ref("");
async function retry(incident) {
	if (retrying.value) return;
	retrying.value = true;
	const accepted = await ProcessInstance.retry(incident.instance_id, incident.attempt_id, confirmed.value.includes(incident.attempt_id));
	notice.value = accepted ? "Zahtjev za ponovni pokušaj je prihvaćen." : "Ponovni pokušaj nije potvrđen. Provjerite stanje koraka.";
	await refresh();
	retrying.value = false;
}
async function refresh() {
	loading.value = true;
	const result = await Model.deployments();
	deployments.value = result?.deployments ?? null;
	incidents.value = result?.incidents ?? [];
	confirmed.value = [];
	loading.value = false;
}
onMounted(refresh);
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiSourceBranch" title="BPMN engine" main>
				<BaseButton :icon="mdiRefresh" label="Osvježi" :disabled="loading || retrying" @click="refresh" />
			</SectionTitleLineWithButton>
			<p role="status" class="mb-5">{{ loading ? "Učitavanje stanja…" : deployments ? "Engine je dostupan." : "Dohvat stanja nije uspio." }}</p>
			<p v-if="notice" role="status" class="mb-4">{{ notice }}</p>
			<template v-if="!loading && deployments">
				<section v-if="incidents.length" class="mb-6">
					<h2 class="mb-2 text-xl font-semibold">Koraci koji čekaju ponovni pokušaj</h2>
					<CardBox v-for="incident in incidents" :key="incident.attempt_id" class="mb-3">
						<h3 class="font-semibold">{{ incident.task || incident.task_id }}</h3>
						<p>{{ incident.model }} · {{ incident.version ? 'v' + incident.version : 'nepoznata verzija' }} · {{ incident.instance_id }}</p>
						<p>{{ new Date(incident.started).toLocaleString("hr-HR") }} · {{ incident.connector }} · {{ incident.error }}</p>
						<p v-if="incident.retried_by">Ponovni pokušaj zatražio/la je {{ incident.retried_by }}.</p>
						<label v-if="incident.connector === 'emailjs'" class="my-3 block">
							<input v-model="confirmed" type="checkbox" :value="incident.attempt_id" />
							Poruka je možda već dostavljena. Želim je ponovno poslati.
						</label>
						<BaseButton class="mt-2" label="Ponovi ovaj korak" :disabled="retrying || (incident.connector === 'emailjs' && !confirmed.includes(incident.attempt_id))" @click="retry(incident)" />
					</CardBox>
				</section>
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
