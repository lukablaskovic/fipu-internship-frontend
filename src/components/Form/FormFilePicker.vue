<script setup>
import { mdiUpload } from "@mdi/js";
import { computed, ref, watch } from "vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { snackBarStore } from "@/main";

const props = defineProps({
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

const showFilename = computed(() => !props.isRoundIcon && file.value);

const modelValueProp = computed(() => props.modelValue);

watch(modelValueProp, (value) => {
	file.value = value;

	if (!value) {
		root.value.input.value = null;
	}
});

const upload = async (event) => {
	const selectedFiles = event.target.files || event.dataTransfer.files;
	if (!selectedFiles || selectedFiles.length === 0) return;

	const selectedFile = selectedFiles[0];
	const maxFileSize = 2 * 1024 * 1024;
	const maxDimensions = { width: 1024, height: 1024 };

	// Check file size only if pdf prop is false
	if (!props.pdf && selectedFile.size > maxFileSize) {
		snackBarStore.pushMessage("Veličina datoteke ne može premašiti 2MB.", "danger");
		return;
	}

	// Process image file
	if (!props.pdf) {
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
	} else {
		file.value = selectedFile;
		emit("update:modelValue", file.value);
	}
};
</script>

<template>
	<div class="flex items-stretch justify-start relative">
		<label class="inline-flex">
			<BaseButton as="a" :class="{ 'w-12 h-12': isRoundIcon, 'rounded-r-none': showFilename }" :icon-size="isRoundIcon ? 24 : undefined" :label="isRoundIcon ? null : label" :icon="icon" :color="color" :rounded-full="isRoundIcon" />
			<input ref="root" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 outline-none cursor-pointer -z-1" :accept="pdf ? 'application/pdf' : accept" @input="upload" />
		</label>
		<div v-if="showFilename" class="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-r">
			<span class="text-ellipsis line-clamp-1">
				{{ file.name }}
			</span>
		</div>
	</div>
</template>
