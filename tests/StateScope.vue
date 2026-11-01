<script setup>
import { ref } from "vue";
import TableAvailableAssignments from "../src/components/Tables/TableAvailableAssignments.vue";
import TableInstanceData from "../src/components/BPMN/TableInstanceData.vue";
const first = ref([]);
const second = ref([]);
const mounted = ref(true);
const preferences = ref({ Prvi_odabir: ["First task"], napomena: "First note" });
</script>
<template>
	<button @click="mounted = !mounted">Toggle tables</button>
	<button @click="preferences = { Prvi_odabir: ['Updated task'], napomena: 'Updated note' }">Update process</button>
	<output aria-label="First selection">{{ first.map(item => item.id_zadatak).join(',') }}</output>
	<output aria-label="Second selection">{{ second.map(item => item.id_zadatak).join(',') }}</output>
	<section v-if="mounted" aria-label="First table"><TableAvailableAssignments v-model="first" checkable /></section>
	<section v-if="mounted" aria-label="Second table"><TableAvailableAssignments v-model="second" checkable /></section>
	<section aria-label="First process"><TableInstanceData task-id="odabiranje_zadatka_student" :variables="preferences" /></section>
	<section aria-label="Second process"><TableInstanceData task-id="upis_ocjene" :variables="{ ocjena_unesena_studomat: 'Second process' }" /></section>
</template>
