<script setup>
import { Dialog } from "reka-ui/namespaced";
import { mdiClose, mdiLogout } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import { computed, watch } from "vue";

const props = defineProps({
	title: {
		type: String,
		default: "",
	},
	button: {
		type: String,
		default: "fipu_blue",
	},
	buttonLabel: {
		type: String,
		default: "Done",
	},
	hasCancel: Boolean,
	modelValue: {
		type: [String, Number, Boolean, Object],
		default: null,
	},
	disabledCondition: {
		type: Boolean,
		default: false,
	},
	hasConfirm: {
		type: Boolean,
		default: true,
	},
	large: {
		type: Boolean,
		default: false,
	},
	isLogout: {
		type: Boolean,
		default: false,
	},
	isBpmn: Boolean,
	description: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

let returnFocus;
watch(
	() => !!props.modelValue,
	(open) => {
		if (open) returnFocus = document.activeElement;
	},
	{ immediate: true, flush: "sync" },
);
function restoreFocus(event) {
	if (returnFocus?.isConnected) {
		event.preventDefault();
		returnFocus.focus();
	}
}

const confirmCancel = (mode) => {
	value.value = false;
	emit(mode);
};

const confirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("cancel");
</script>

<template>
	<Dialog.Root :open="!!value" @update:open="!$event && cancel()">
		<Dialog.Portal>
			<Dialog.Overlay class="reka-animated fixed inset-0 z-[5000]" :class="isLogout || isBpmn ? 'bg-slate-950/50' : 'bg-gradient-to-tr from-gray-700 via-gray-800 to-gray-900 opacity-90'" />
			<div class="pointer-events-none fixed inset-0 z-[5001] flex items-center justify-center"><Dialog.Content class="reka-animated" as-child v-bind="description ? {} : { 'aria-describedby': undefined }" @close-auto-focus="restoreFocus">
				<CardBox
					class="pointer-events-auto [&>div]:min-w-0"
					:class="{
						'2xl:3/12 modal-scrollable fipu_vertical_scrollbar z-50 max-h-modal w-11/12 rounded shadow-lg md:w-3/5 lg:w-2/5 xl:w-6/12': !large && !isLogout && !isBpmn,
						'modal-scrollable fipu_vertical_scrollbar z-50 max-h-modal w-11/12 max-w-6xl rounded-xl shadow-lg': large && !isLogout && !isBpmn,
						'modal-scrollable fipu_vertical_scrollbar w-11/12 max-w-md rounded-2xl shadow-2xl': isLogout,
						'bpmn-task-dialog w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl text-slate-900 shadow-2xl dark:text-slate-100': isBpmn,
					}"
					:has-component-layout="isBpmn"
					is-modal>
					<div class="modal-content" :class="{ 'flex w-full flex-col': isBpmn }">
						<header v-if="isBpmn" class="flex shrink-0 items-start gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:px-6">
							<div class="min-w-0 flex-1">
								<Dialog.Title class="text-xl font-semibold leading-7">{{ title }}</Dialog.Title>
								<Dialog.Description v-if="description" class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ description }}</Dialog.Description>
							</div>
							<Dialog.Close as-child><BaseButton :icon="mdiClose" aria-label="Zatvori detalje zadatka" class="h-11 w-11 shrink-0 rounded-lg" /></Dialog.Close>
						</header>
						<template v-else-if="isLogout">
							<div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-fipu_blue/10 text-fipu_text_blue dark:text-fipu_blue">
								<BaseIcon :path="mdiLogout" size="24" aria-hidden="true" />
							</div>
							<Dialog.Title class="text-xl font-semibold leading-7 text-gray-900 dark:text-slate-100">{{ title }}</Dialog.Title>
						</template>
						<Dialog.Title v-else-if="title" as-child><CardBoxComponentTitle :title="title" /></Dialog.Title>
						<Dialog.Title v-else class="sr-only">Detalji</Dialog.Title>

						<div v-if="isBpmn" class="fipu_vertical_scrollbar min-h-0 overflow-y-auto px-5 py-5 text-sm leading-6 sm:px-6">
							<slot v-if="modelValue != null" :assignment="modelValue"></slot>
						</div>
						<slot v-else-if="modelValue != null" :assignment="modelValue"></slot>

						<footer v-if="isBpmn" class="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/50 sm:px-6">
							<BaseButton v-if="hasCancel" label="Natrag" class="min-h-[44px] rounded-lg" @click="cancel" />
							<BaseButton v-if="hasConfirm" :label="buttonLabel" color="border-fipu_blue bg-fipu_blue text-slate-900 hover:border-fipu_light_blue hover:bg-fipu_light_blue" class="min-h-[44px] rounded-lg" :disabled="disabledCondition" @click="confirm" />
						</footer>
						<BaseButtons v-else-if="isLogout" type="justify-end" class="mt-6 gap-3" class-addon="" mb="">
							<BaseButton v-if="hasCancel" label="Natrag" color="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" class="min-h-[44px] flex-1 sm:flex-none" @click="cancel" />
							<BaseButton v-if="hasConfirm" :label="buttonLabel" color="border-fipu_blue bg-fipu_blue text-slate-900 hover:border-fipu_light_blue hover:bg-fipu_light_blue" class="min-h-[44px] flex-1 sm:flex-none" :disabled="disabledCondition" @click="confirm" />
						</BaseButtons>
						<BaseButtons v-else class="mt-4 justify-center">
							<BaseButton v-if="hasConfirm" :label="buttonLabel" :color="button" :disabled="disabledCondition" @click="confirm" />
							<BaseButton v-if="hasCancel" label="Natrag" :color="button" outline @click="cancel" />
						</BaseButtons>
					</div>
				</CardBox>
			</Dialog.Content></div>
		</Dialog.Portal>
	</Dialog.Root>
</template>

<style scoped>
.bpmn-task-dialog .modal-content {
	max-height: calc(100dvh - 2rem);
	min-height: 0;
}

.modal-scrollable {
	max-height: 90vh;
	overflow-y: auto;
}
</style>
