<script setup>
import { ref } from "vue";
import { ProcessInstance } from "@/services/bpmn_engine_api";
import { useSnackBarStore } from "@/stores/snackbar_store";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";

const props = defineProps({ instanceId: { type: String, required: true } });
const emit = defineEmits(["moved"]);
const snack = useSnackBarStore();
const open = ref(false);
const loading = ref(false);
const moving = ref(false);
const options = ref(null);
const target = ref("");

async function choose() {
	loading.value = true;
	target.value = "";
	open.value = true;
	options.value = await ProcessInstance.rollbackOptions(props.instanceId);
	loading.value = false;
}

async function move() {
	if (moving.value || !target.value) return;
	moving.value = true;
	try {
		const result = await ProcessInstance.rollback(props.instanceId, options.value.checkpoint, target.value);
		if (!result) {
			snack.pushMessage("Povratak nije potvrđen. Ponovno otvorite odabir i provjerite stanje prakse.", "danger");
		} else {
			snack.pushMessage("Praksa je vraćena na odabrani zadatak.", "success");
		}
		emit("moved", props.instanceId);
	} finally {
		moving.value = false;
	}
}
</script>

<template>
	<div>
		<BaseButton label="Vrati na prethodni zadatak" :disabled="loading || moving" @click="choose" />
		<CardBoxModal v-model="open" is-bpmn title="Povratak na prethodni zadatak" description="Odaberite ranije dovršeni zadatak na koji želite vratiti ovu praksu." has-cancel button-label="Vrati praksu" :disabled-condition="loading || moving || !target" @confirm="move">
			<p v-if="loading" role="status">Učitavanje prethodnih zadataka…</p>
			<p v-else-if="!options" role="alert">Dohvat prethodnih zadataka nije uspio.</p>
			<p v-else-if="!options.targets.length">U trenutačnom stanju nema dostupnog prethodnog zadatka.</p>
			<template v-else>
				<label class="block">Prethodni zadatak
					<select v-model="target" class="mt-1 block w-full rounded border-slate-300 dark:bg-slate-800">
						<option disabled value="">Odaberite zadatak</option>
						<option v-for="task in options.targets" :key="task.id" :value="task.id">{{ task.name }}</option>
					</select>
				</label>
				<p class="mt-4">Zadržavaju se trenutačne vrijednosti obrasca i postojeći zapisi. Ponovnim prolaskom kroz proces mogu nastati novi zapisi, potvrde i e-poruke.</p>
			</template>
		</CardBoxModal>
	</div>
</template>
