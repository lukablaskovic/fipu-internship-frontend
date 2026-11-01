<script setup>
import { FieldControl, FieldRoot, Primitive, injectFieldRootContext } from "reka-ui";
const fieldContext = injectFieldRootContext(null);
import BaseButton from "@/components/Base/BaseButton.vue";
import { computed, ref, watch } from "vue";
import { snackBarStore } from "@/main";
import { mdiUpload } from "@mdi/js";

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
	<component :is="fieldContext ? Primitive : FieldRoot" as-child>
		<div class="relative flex items-stretch justify-start rounded focus-within:ring focus-within:ring-fipu_blue">
			<label class="inline-flex">
				<BaseButton as="a" :class="{ 'h-12 w-12': isRoundIcon, 'rounded-r-none': showFilename }" :icon-size="isRoundIcon ? 24 : undefined" :label="isRoundIcon ? null : label" :icon="icon" :color="color" :rounded-full="isRoundIcon" />
				<FieldControl as-child :name="name" :required="required" :disabled="disabled">
					<input ref="root" type="file" class="absolute left-0 top-0 -z-1 h-full w-full cursor-pointer opacity-0 outline-none" :accept="pdf ? 'application/pdf' : accept" @input="upload" />
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
