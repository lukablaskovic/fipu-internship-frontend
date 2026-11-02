<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const process = computed(() => studentStore.student_process_instance_data);
const withdrawing = computed(() => process.value.active_event === "odustajanje_od_prakse");
const available = computed(() => process.value.state === "running" && !withdrawing.value && process.value.available_events?.includes("odustajanje_od_prakse"));
const retry = computed(() => withdrawing.value && process.value.state === "failed");
const confirming = ref(false);
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
watch(() => withdrawing.value && process.value.state === "running", (pending) => {
	clearInterval(timer);
	if (pending) timer = setInterval(refresh, 1500);
}, { immediate: true });
onBeforeUnmount(() => clearInterval(timer));

async function withdraw() {
	if (busy.value) return;
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
	<div v-if="available || retry || busy || error" class="px-6 pt-6">
		<div class="flex justify-end">
			<BaseButton v-if="available || retry || busy" :label="retry ? 'Ponovi evidentiranje odustajanja' : 'Odustajanje od prakse'" color="danger" outline :disabled="busy" @click="retry ? withdraw() : confirming = true" />
		</div>
		<p v-if="error" role="alert" class="mt-3 text-red-600">{{ error }}</p>
		<CardBoxModal v-model="confirming" title="Odustajanje od prakse" button="danger" button-label="Odustani od prakse" has-cancel :disabled-condition="busy" @confirm="withdraw">
			<p>Želite li trajno završiti ovaj proces prakse? Svi preostali koraci bit će prekinuti. Podaci i povijest ostat će sačuvani, a praksa neće biti označena kao uspješno odrađena.</p>
			<p class="mt-3">Nakon odustajanja možete ponovno odabrati model A ili B.</p>
		</CardBoxModal>
	</div>
</template>
