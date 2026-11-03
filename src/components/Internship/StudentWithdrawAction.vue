<script setup>
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import { useStudentStore } from "@/stores/student_store";
import { useMainStore } from "@/stores/main_store";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const process = computed(() => studentStore.student_process_instance_data);
const withdrawing = computed(() => process.value.active_event === "odustajanje_od_prakse");
const available = computed(() => process.value.state === "running" && !withdrawing.value && process.value.available_events?.includes("odustajanje_od_prakse"));
const retry = computed(() => withdrawing.value && process.value.state === "failed");
const confirming = ref(false);
const confirmationText = ref("");
const withdrawalConfirmed = computed(() => confirmationText.value.toLowerCase() === "prekidam proces prakse");
watch(confirming, (open) => {
	if (open) confirmationText.value = "";
});
const busy = ref(false);
const error = ref("");
let timer;
let refreshing = false;

async function refresh() {
	if (refreshing) return;
	refreshing = true;
	try {
		await studentStore.getPendingUserTask(mainStore.currentUser.internship_process.id);
	} catch {
		error.value = "Stanje odustajanja nije moguće dohvatiti. Osvježite stranicu.";
	} finally {
		refreshing = false;
	}
}
watch(
	() => withdrawing.value && process.value.state === "running",
	(pending) => {
		clearInterval(timer);
		if (pending) timer = setInterval(refresh, 1500);
	},
	{ immediate: true },
);
onBeforeUnmount(() => clearInterval(timer));

async function withdraw() {
	if (busy.value || (!retry.value && !withdrawalConfirmed.value)) return;
	busy.value = true;
	error.value = "";
	try {
		const response = await studentStore.withdrawInternship();
		if (response?.status !== "OK") error.value = "Odustajanje nije potvrđeno. Provjerite stanje procesa i pokušajte ponovno.";
	} catch {
		error.value = "Nije moguće potvrditi odustajanje. Osvježite stranicu i provjerite stanje procesa.";
	} finally {
		busy.value = false;
	}
}
</script>

<template>
	<div v-if="!mainStore.userAdmin && $route.path === '/moja-praksa' && (available || retry || busy || error)" class="mt-8 border-t border-gray-200 pt-5 dark:border-slate-700">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
			<div class="sm:text-right">
				<p class="text-sm font-semibold">Ne možete nastaviti praksu?</p>
				<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Odustajanjem završavate trenutni proces prakse.</p>
			</div>
			<BaseButton
				v-if="available || retry || busy"
				:label="retry ? 'Ponovi evidentiranje odustajanja' : 'Odustajanje od prakse'"
				color="danger"
				outline
				class="self-start sm:shrink-0 sm:self-center"
				:disabled="busy"
				@click="retry ? withdraw() : (confirming = true)" />
		</div>
		<p v-if="error" role="alert" class="mt-3 text-red-600">{{ error }}</p>
		<CardBoxModal v-model="confirming" title="Odustajanje od prakse" button="danger" button-label="Odustani od prakse" has-cancel :disabled-condition="busy || !withdrawalConfirmed" @confirm="withdraw">
			<p>Jeste li sigurni da želite trajno završiti proces prakse? Ovom odlukom odustajete od trenutno ugovorene prakse i ne jamči vam se da ćete moći ponovno odabrati isti zadatak, poduzeće ili mentora.</p>
			<p class="mt-3">Nakon odustajanja možete ponovno započeti proces prema modelu A ili B</p>
			<FormField class="mt-4" name="withdrawal-confirmation" label="Za potvrdu upišite: prekidam proces prakse">
				<FormControl v-model="confirmationText" autocomplete="off" :disabled="busy" />
			</FormField>
		</CardBoxModal>
	</div>
</template>
