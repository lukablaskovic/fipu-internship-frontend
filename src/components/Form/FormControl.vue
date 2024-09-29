<script setup>
import { mdiUnfoldMoreHorizontal, mdiAlertCircle, mdiCheckCircle, mdiAsterisk, mdiLockOff, mdiContentCopy } from "@mdi/js";
import FormControlListbox from "@/components/Premium/FormControlListbox.vue";
import FormControlIcon from "@/components/Premium/FormControlIcon.vue";
import FormFieldHelp from "@/components/Premium/FormFieldHelp.vue";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import SearchOptions from "@/components/SearchOptions.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { controlTextColor } from "@/colorsPremium.js";
import TipTag from "@/components/Premium/TipTag.vue";
import { snackBarStore, mainStore } from "@/main";
import { getButtonColor } from "@/colors.js";

const props = defineProps({
	firstAddon: Boolean,
	middleAddon: Boolean,
	lastAddon: Boolean,
	expanded: Boolean,
	inputW: { type: String, default: "w-full" },
	help: String,
	name: String,
	id: String,
	min: [String, Number],
	max: [String, Number],
	required: Boolean,
	autocomplete: String,
	placeholder: String,
	iconLeft: String,
	iconRight: String,
	error: [Boolean, String],
	success: [Boolean, String],
	options: Array,
	type: { type: String, default: "text" },
	modelValue: { type: [String, Number, Boolean, Array, Object], default: "" },
	buttonLabel: String,
	buttonIcon: String,
	buttonColor: { type: String, default: "white" },
	buttonOutline: Boolean,
	borderless: Boolean,
	tipLeft: String,
	tipRight: String,
	ctrlKFocus: Boolean,
	searchBar: Boolean,
	transparent: Boolean,
	readonly: Boolean,
	copyable: { type: Boolean, default: false },
	disabled: Boolean,
});

const emit = defineEmits(["update:modelValue", "right-icon-click"]);

const passwordIsOpen = ref(false);
const inputEl = ref(null);

const computedValue = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

const showSearchBar = computed(() => props.searchBar);
const computedType = computed(() => {
	if (props.options && props.type !== "list") return "select";
	if (props.buttonLabel || props.buttonIcon) return "button";
	return props.type === "password" && passwordIsOpen.value ? "text" : props.type;
});

const borderColor = computed(() => (props.error ? "border-red-600" : props.success ? "border-green-600" : "border-gray-700"));
const textColor = computed(() => controlTextColor(props.error, props.success));
const placeholderColor = computed(() => (props.error ? "placeholder-red-600" : props.success ? "placeholder-green-600" : null));
const wrapperBorder = computed(() => computedType.value !== "textarea");
const upperWrapperClass = computed(() => (props.expanded ? "grow shrink" : ""));

const wrapperClass = computed(() => {
	const base = [];
	if (props.searchBar) base.push("rounded");
	if (computedType.value === "button") {
		base.push(getButtonColor(props.buttonColor, props.buttonOutline, true));
	} else {
		base.push(borderColor.value, "dark:bg-slate-800", props.borderless ? "bg-gray-50" : "");
		if (wrapperBorder.value) base.push("border-t border-b", !props.firstAddon && !props.lastAddon && !props.middleAddon ? "rounded border-l border-r" : "");
		if (props.firstAddon) base.push("rounded-l border-l");
		if (props.lastAddon) base.push("rounded-r border-r");
	}
	return base;
});

const inputElClass = computed(() => {
	const base = ["px-3 py-2 max-w-full focus:ring focus:ring-fipu_blue focus:outline-none", props.inputW, computedType.value === "textarea" ? "h-24" : "h-12", wrapperBorder.value ? "border-0" : "border"];
	base.push(textColor.value, placeholderColor.value || "placeholder-gray-500", computedIconLeft.value && "pl-10", computedIconRight.value && "pr-10");
	if (!props.firstAddon && !props.lastAddon && !props.middleAddon) base.push("rounded");
	return base;
});

const computedIconLeft = computed(() => props.iconLeft || null);
const computedIconRight = computed(() => {
	if (props.error) return mdiAlertCircle;
	if (props.success) return mdiCheckCircle;
	if (props.iconRight) return props.iconRight;
	if (props.type === "password") return passwordIsOpen.value ? mdiLockOff : mdiAsterisk;
	return props.type === "list" ? mdiUnfoldMoreHorizontal : null;
});

const controlIconH = computed(() => (props.type === "textarea" ? "h-full" : "h-12"));

const openPasswordToggle = (e) => {
	if (props.type === "password") {
		passwordIsOpen.value = !passwordIsOpen.value;
		emit("right-icon-click", e);
	}
};

const copyToClipboard = async () => {
	if (props.copyable) {
		try {
			await navigator.clipboard.writeText(props.modelValue);
			snackBarStore.pushMessage("Kopirano u međuspremnik.", "success");
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	}
};

if (props.ctrlKFocus) {
	const fieldFocusHook = (e) => {
		if (e.ctrlKey && e.key === "k") {
			e.preventDefault();
			inputEl.value.focus();
		} else if (e.key === "Escape") {
			inputEl.value.blur();
		}
	};

	onMounted(() => {
		if (!mainStore.isFieldFocusRegistered) {
			window.addEventListener("keydown", fieldFocusHook);
			mainStore.isFieldFocusRegistered = true;
		}
	});

	onBeforeUnmount(() => {
		window.removeEventListener("keydown", fieldFocusHook);
		mainStore.isFieldFocusRegistered = false;
	});
}
</script>

<template>
	<div :class="upperWrapperClass">
		<div class="relative" :class="wrapperClass">
			<!-- Static Field -->
			<div v-if="computedType === 'static'" :class="inputElClass" class="inline-flex items-center whitespace-nowrap">{{ modelValue }}</div>

			<!-- Search Bar -->
			<div v-if="showSearchBar && mainStore.userAdmin" class="relative" :class="wrapperClass">
				<SearchOptions />
			</div>

			<!-- Listbox -->
			<FormControlListbox v-else-if="computedType === 'list'" v-model="computedValue" :readonly="readonly" :options="options" :button-class="inputElClass" />

			<!-- Select Dropdown -->
			<select v-else-if="computedType === 'select'" :id="id" v-model="computedValue" :readonly="readonly" :name="name" :class="inputElClass" :disabled="disabled">
				<option v-for="option in options" :key="option.id ?? option" :value="option">{{ option.label ?? option }}</option>
			</select>

			<!-- Textarea -->
			<textarea v-else-if="computedType === 'textarea'" :id="id" v-model="computedValue" :class="inputElClass" :name="name" :readonly="readonly" :placeholder="placeholder" :required="required" :disabled="disabled" />

			<!-- Button -->
			<button v-else-if="computedType === 'button'" :class="inputElClass" :disabled="disabled">
				<BaseIcon v-if="buttonIcon" :path="buttonIcon" w="w-8" h="h-8" size="20" />
				<span v-if="buttonLabel" :class="{ 'ml-1': buttonIcon }">{{ buttonLabel }}</span>
			</button>

			<!-- Input Field -->
			<input v-else :id="id" ref="inputEl" v-model="computedValue" :name="name" :autocomplete="autocomplete" :required="required" :readonly="readonly" :placeholder="placeholder" :type="computedType" :min="min" :max="max" :class="[inputElClass, computedType == 'date' ? 'dark:input' : '']" :disabled="disabled" />

			<!-- Icons and Tip Tags -->
			<FormControlIcon v-if="computedIconLeft" :icon="computedIconLeft" :h="controlIconH" :text-color="textColor" />
			<FormControlIcon v-if="computedIconRight || props.copyable" :icon="props.copyable ? mdiContentCopy : computedIconRight" :h="controlIconH" :text-color="textColor" :clickable="rightIconClickable || props.copyable" is-right @icon-click="props.copyable ? copyToClipboard() : openPasswordToggle()" />
			<TipTag v-if="tipLeft" :tip="tipLeft" left />
			<TipTag v-if="tipRight" :tip="tipRight" right />
		</div>
		<FormFieldHelp :help="help" :error="error" :success="success" class="mt-1" />
	</div>
</template>

<style>
.copy-icon {
	transition: opacity 0.2s;
}
.input {
	color-scheme: dark;
}
</style>
