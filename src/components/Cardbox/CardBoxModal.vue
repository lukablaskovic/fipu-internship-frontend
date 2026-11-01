<script setup>
import { Dialog } from "reka-ui/namespaced";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import { computed, watch } from "vue";

const props = defineProps({
	title: {
		type: String,
		required: true,
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
			<Dialog.Overlay class="reka-animated fixed inset-0 z-[5000] bg-gradient-to-tr from-gray-700 via-gray-800 to-gray-900 opacity-90" />
			<div class="pointer-events-none fixed inset-0 z-[5001] flex items-center justify-center"><Dialog.Content class="reka-animated" as-child :aria-describedby="undefined" @close-auto-focus="restoreFocus">
				<CardBox
					class="pointer-events-auto"
					:class="{
						'2xl:3/12 modal-scrollable fipu_vertical_scrollbar z-50 max-h-modal w-11/12 rounded shadow-lg md:w-3/5 lg:w-2/5 xl:w-6/12': !large && !isLogout,
						'modal-scrollable fipu_vertical_scrollbar z-50 max-h-modal w-full rounded shadow-lg md:w-4/5 lg:w-3/5 xl:w-3/5': large && !isLogout,
						'2xl:3/12 modal-scrollable fipu_vertical_scrollbar z-50 max-h-modal w-11/12 rounded shadow-lg md:w-3/5 lg:w-1/5 xl:w-4/12': isLogout,
						'mobile-fullscreen': !isLogout,
					}"
					is-modal>
					<div class="modal-content">
						<Dialog.Title as-child><CardBoxComponentTitle :title="title" /></Dialog.Title>

						<slot v-if="modelValue != null" :assignment="modelValue"></slot>

						<BaseButtons class="mt-4 justify-center">
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
.modal-scrollable {
	max-height: 90vh;
	overflow-y: auto;
}

/* Fullscreen modal on mobile */
@media (max-width: 640px) {
	.mobile-fullscreen {
		width: 100vw;
		height: 100vh;
		max-height: 100vh;
		top: 0;
		left: 0;
		position: fixed;
		margin: 0;
		border-radius: 0;
		overflow-y: auto;
	}

	/* Center the content inside the modal */
	.modal-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100%;
	}
}
</style>
