<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useMainStore } from "@/stores/main_store";

import { endpoints, LOCAL_DEV } from "@/config.js";
import { archiveDocuments, displayArchiveValue } from "@/helpers/academic-archive.js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const mainStore = useMainStore();

const index = ref(null);
const year = ref("");
const snapshot = ref(null);
const table = ref("Student");
const search = ref("");
const selected = ref(null);
const error = ref("");
const loading = ref(false);
const downloading = ref(false);
const base = endpoints.VITE_BASEROW_API_URL + "/api/academic-years";
const headers = () => ({ "X-Local-User": mainStore.currentUser.email });
const rows = computed(() => (snapshot.value?.tables[table.value] || []).filter((row) =>
	Object.values(row).some((value) => displayArchiveValue(value).toLocaleLowerCase("hr").includes(search.value.toLocaleLowerCase("hr"))),
));
const primary = computed(() => snapshot.value?.fields[table.value]?.find((field) => field.primary)?.name);
const processId = computed(() => selected.value?.process_instance_id || "");
const events = computed(() => (snapshot.value?.events || []).filter((event) => event.instance_id === processId.value).sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
const documents = computed(() => snapshot.value && selected.value ? archiveDocuments(snapshot.value, [selected.value, events.value]) : []);
const related = computed(() => {
	if (table.value !== "Student" || !selected.value) return [];
	return Object.entries(snapshot.value.tables).flatMap(([name, records]) => name === "Student" ? [] : records
		.filter((row) => row.Student?.some((student) => student.id === selected.value.id))
		.map((row) => ({ table: name, row, label: displayArchiveValue(row[snapshot.value.fields[name].find((field) => field.primary).name]) })));
});
const databaseUrl = computed(() => {
	const database = index.value?.years.find((item) => item.year === year.value);
	return database ? `http://localhost:8085/database/${database.database_id}/table/${database.tables[table.value]}` : "";
});
let requestNumber = 0;
async function loadYear() {
	const request = ++requestNumber;
	loading.value = true;
	error.value = "";
	snapshot.value = null;
	selected.value = null;
	search.value = "";
	try {
		const response = await axios.get(`${base}/${year.value.replace("/", "-")}`, { headers: headers() });
		if (request === requestNumber) snapshot.value = response.data;
	} catch {
		if (request === requestNumber) error.value = "Arhivu nije moguće učitati. Provjerite lokalni uvoz podataka.";
	} finally {
		if (request === requestNumber) loading.value = false;
	}
}
function openRelated(item) {
	table.value = item.table;
	selected.value = item.row;
	search.value = "";
}
function changeTable() {
	selected.value = null;
	search.value = "";
}
async function download(document) {
	downloading.value = true;
	error.value = "";
	try {
		const response = await axios.get(`${base}/${year.value.replace("/", "-")}/files/${document.id}`, { headers: headers(), responseType: "blob" });
		const url = URL.createObjectURL(response.data);
		const link = window.document.createElement("a");
		link.href = url;
		link.download = document.name;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	} catch {
		error.value = "Dokument nije moguće preuzeti.";
	} finally {
		downloading.value = false;
	}
}
watch(year, loadYear);
onMounted(async () => {
	if (!LOCAL_DEV) return;
	try {
		index.value = (await axios.get(base, { headers: headers() })).data;
		year.value = index.value.years.at(-1)?.year || "";
	} catch {
		error.value = "Arhiva još nije dostupna. Dovršite lokalni uvoz podataka.";
	}
});
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<h1 class="text-2xl font-semibold mb-3">Arhiva akademskih godina</h1>
			<p class="mb-6">Aktivna godina: <strong>{{ index?.active_year || "2026/2027" }}</strong>. Arhivirani podaci dostupni su samo za pregled.</p>
			<p v-if="error" role="alert" class="mb-4 text-red-600">{{ error }}</p>
			<CardBox v-if="index" class="mb-6">
				<div class="grid gap-4 md:grid-cols-3">
					<FormField label="Akademska godina"><FormControl v-model="year" :options="index.years.map((item) => item.year)" /></FormField>
					<FormField label="Tablica"><FormControl v-model="table" :options="Object.keys(snapshot?.tables || { Student: [] })" @update:model-value="changeTable" /></FormField>
					<FormField label="Pretraži arhivu"><FormControl v-model="search" type="search" placeholder="Ime, JMBAG ili drugi podatak" /></FormField>
				</div>
				<BaseButton v-if="databaseUrl" :href="databaseUrl" target="_blank" label="Otvori godinu u lokalnom Baserowu" small />
			</CardBox>
			<p v-if="loading" role="status">Učitavanje arhive…</p>
			<template v-if="snapshot">
				<p class="mb-4 text-sm">{{ rows.length }} zapisa · Snimljeno {{ new Date(snapshot.captured_at).toLocaleString("hr") }} · Bez dostupne povijesti: {{ snapshot.missing_history.length }} procesa.</p>
				<div class="grid gap-6 lg:grid-cols-2">
					<CardBox>
						<ul class="max-h-[36rem] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
							<li v-for="row in rows" :key="row.id">
								<button type="button" class="w-full text-left p-3 rounded hover:bg-gray-100 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500" :aria-pressed="selected?.id === row.id" @click="selected = row">
									<span class="block font-semibold">{{ table === "Student" ? [row.ime, row.prezime].join(" ") : displayArchiveValue(row[primary]) }}</span>
									<span class="text-sm opacity-70">{{ table === "Student" ? row.JMBAG : `Zapis ${row.id}` }}</span>
								</button>
							</li>
						</ul>
						<p v-if="!rows.length">Nema zapisa za odabranu pretragu.</p>
					</CardBox>
					<CardBox v-if="selected">
						<h2 class="text-xl font-semibold mb-4">{{ table }} · {{ snapshot.year }}</h2>
						<dl class="space-y-3 break-words">
							<div v-for="field in snapshot.fields[table]" :key="field.id">
								<dt class="text-sm font-semibold">{{ field.name }}</dt>
								<dd class="whitespace-pre-wrap">{{ displayArchiveValue(selected[field.name]) }}</dd>
							</div>
						</dl>
						<div v-if="related.length" class="mt-6">
							<h3 class="font-semibold mb-2">Povezani zapisi studenta</h3>
							<BaseButton v-for="item in related" :key="`${item.table}-${item.row.id}`" class="mr-2 mb-2" :label="`${item.table}: ${item.label}`" small @click="openRelated(item)" />
						</div>
						<div v-if="documents.length" class="mt-6">
							<h3 class="font-semibold mb-2">Dokumenti</h3>
							<div v-for="document in documents" :key="document.id" class="mb-2">
								<BaseButton :label="document.name" :disabled="!document.available || downloading" small @click="download(document)" />
								<span v-if="!document.available" class="text-red-600"> Izvorni dokument nije dostupan.</span>
							</div>
						</div>
						<div v-if="processId" class="mt-6">
							<h3 class="font-semibold mb-2">Povijest procesa · {{ events.length }} događaja</h3>
							<p v-if="index.shared_workflow_ids?.includes(processId)" class="mb-3 text-sm">Isti ID procesa postoji u obje izvorne godine. Prikazani su svi dostupni događaji tog ID-a; njihova pripadnost pojedinoj godini nije potvrđena.</p>
							<p v-if="!events.length">Povijest ovog procesa nije dostupna u izvoru. Poslovni zapisi i dokumenti ostaju sačuvani.</p>
							<details v-for="(event, position) in events" :key="position" class="mb-3">
								<summary class="cursor-pointer">{{ event.activity_id }} · {{ new Date(event.timestamp).toLocaleString("hr") }}</summary>
								<dl class="ml-3 mt-2 break-words">
									<div v-for="(value, key) in event.activity_variables" :key="key"><dt class="font-semibold">{{ key }}</dt><dd class="whitespace-pre-wrap">{{ displayArchiveValue(value) }}</dd></div>
								</dl>
							</details>
						</div>
					</CardBox>
					<CardBox v-else><p>Odaberite zapis za pregled podataka, dokumenata i dostupne povijesti.</p></CardBox>
				</div>
			</template>
		</SectionMain>
	</LayoutAuthenticated>
</template>
