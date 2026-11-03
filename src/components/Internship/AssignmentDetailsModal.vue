<script setup>
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import CardBoxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";

defineProps({ modelValue: { type: Object, default: null } });
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
	<CardBoxModal v-if="modelValue" :model-value="modelValue" large button-label="Zatvori" button="fipu_blue" @update:model-value="emit('update:modelValue', null)">
		<CardBoxAllocation :key="modelValue.id_zadatak" :data="modelValue" />
	</CardBoxModal>
</template>
