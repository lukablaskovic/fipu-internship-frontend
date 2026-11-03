<script setup>
import { FieldControl, FieldRoot, Primitive, injectFieldRootContext } from "reka-ui";
const fieldContext = injectFieldRootContext(null);
import BaseButton from "@/components/Base/BaseButton.vue";
import { computed, ref, watch } from "vue";
import { useSnackBarStore } from "@/stores/snackbar_store";

import { mdiUpload } from "@mdi/js";

const snackBarStore = useSnackBarStore();

const props = defineProps({
	disabled: Boolean,
	required: Boolean,
	name: { type: String, default: undefined },
	modelValue: {
		type: [Object, File, Array],
		default: null,
	},
	label: {
		type: String,
		default: null,
	},
	icon: {
		type: String,
		default: mdiUpload,
	},
	accept: {
		type: String,
		default: "image/*",
	},
	pdf: {
		type: Boolean,
		default: false,
	},
	color: {
		type: String,
		default: "fipu_blue",
	},
	isRoundIcon: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const root = ref(null);

const file = ref(props.modelValue);
const dragging = ref(false);
const dropError = ref("");

function selectPdf(files) {
	dragging.value = false;
	if (props.disabled || !files?.length) return;
	if (files.length > 1) {
		dropError.value = "Odaberite samo jednu PDF datoteku za ovo polje.";
		return;
	}
	dropError.value = "";
	emit("update:modelValue", files[0]);
}

function removePdf() {
	dropError.value = "";
	emit("update:modelValue", null);
}

const showFilename = computed(() => !props.isRoundIcon && file.value);

const modelValueProp = computed(() => props.modelValue);

watch(modelValueProp, (value) => {
	file.value = value;

	if (!value) {
		if (root.value) root.value.value = "";
	}
});

const upload = async (event) => {
	const selectedFiles = event.target.files || event.dataTransfer.files;
	if (!selectedFiles || selectedFiles.length === 0) return;

	const selectedFile = selectedFiles[0];
	const maxFileSize = 2 * 1024 * 1024;
	const maxDimensions = { width: 1024, height: 1024 };

	if (selectedFile.size > maxFileSize) {
		snackBarStore.pushMessage("Veličina datoteke ne može premašiti 2MB.", "danger");
		return;
	}

	const img = new Image();
	const objectUrl = URL.createObjectURL(selectedFile);

	img.src = objectUrl;

	img.onload = () => {
		URL.revokeObjectURL(objectUrl);

		if (img.width > maxDimensions.width || img.height > maxDimensions.height) {
			snackBarStore.pushMessage("Dimenzije slike ne smiju biti veće od 1024x1024px.", "danger");
			return;
		}

		file.value = selectedFile;
		emit("update:modelValue", file.value);
	};
};
</script>

<template>
	<component :is="fieldContext ? Primitive : FieldRoot" as-child>
		<div v-if="pdf">
			<label
class="relative flex items-center justify-center rounded-lg border-2 border-dashed p-4 focus-within:ring-2 focus-within:ring-fipu_blue"
				:class="dragging ? 'border-fipu_blue bg-sky-50 dark:bg-slate-800' : 'border-gray-300 dark:border-slate-600'"
				@dragover.prevent="dragging = !disabled" @dragleave="dragging = false" @drop.prevent="selectPdf($event.dataTransfer.files)">
				{{ modelValue ? "Odaberite ili ispustite zamjenski PDF" : "Odaberite ili ispustite PDF ovdje" }}
				<FieldControl as-child :name="name" :disabled="disabled" :aria-required="required">
					<input
type="file" accept=".pdf,application/pdf" class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						@change="selectPdf($event.target.files); $event.target.value = ''" />
				</FieldControl>
			</label>
			<p v-if="dropError" role="alert" class="mt-1 text-sm text-red-600">{{ dropError }}</p>
			<div v-if="modelValue" class="mt-2 flex items-center gap-3">
				<span class="min-w-0 break-all">{{ modelValue.name }}</span>
				<button type="button" class="shrink-0 underline" :disabled="disabled" :aria-label="`Ukloni ${modelValue.name}`" @click="removePdf">Ukloni</button>
			</div>
		</div>
		<div v-else class="relative flex items-stretch justify-start rounded focus-within:ring focus-within:ring-fipu_blue">
			<label class="inline-flex">
				<BaseButton as="a" :class="{ 'h-12 w-12': isRoundIcon, 'rounded-r-none': showFilename }" :icon-size="isRoundIcon ? 24 : undefined" :label="isRoundIcon ? null : label" :icon="icon" :color="color" :rounded-full="isRoundIcon" />
				<FieldControl as-child :name="name" :required="required" :disabled="disabled">
					<input ref="root" type="file" class="absolute left-0 top-0 -z-1 h-full w-full cursor-pointer opacity-0 outline-none" :accept="accept" @input="upload" />
				</FieldControl>
			</label>
			<div v-if="showFilename" class="rounded-r border border-gray-200 bg-gray-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
				<span class="line-clamp-1 text-ellipsis">
					{{ file.name }}
				</span>
			</div>
		</div>
	</component>
</template>
