<script setup>
import { mdiClose } from "@mdi/js";
import { Dialog } from "reka-ui/namespaced";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import CardBoxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";

defineProps({ modelValue: { type: Object, default: null } });
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
	<CardBoxModal v-if="modelValue" :model-value="modelValue" large button-label="Zatvori" button="fipu_blue" @update:model-value="emit('update:modelValue', null)">
		<CardBoxAllocation :key="modelValue.id_zadatak" :data="modelValue">
			<template #header-action>
				<Dialog.Close as-child>
					<BaseButton :icon="mdiClose" icon-size="24" aria-label="Zatvori detalje zadatka" class="ml-auto h-11 w-11 shrink-0 self-start sm:hidden" />
				</Dialog.Close>
			</template>
		</CardBoxAllocation>
	</CardBoxModal>
</template>
