<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { getButtonColor } from "@/colors.js";
import { RouterLink } from "vue-router";
import { Primitive, RovingFocusItem } from "reka-ui";
import { computed, inject } from "vue";

const inButtonGroup = inject("buttonRovingFocus", false);

const props = defineProps({
	label: {
		type: [String, Number],
		default: null,
	},
	icon: {
		type: String,
		default: null,
	},
	iconRight: {
		type: String,
		default: null,
	},
	iconSize: {
		type: [String, Number],
		default: null,
	},
	href: {
		type: String,
		default: null,
	},
	target: {
		type: String,
		default: null,
	},
	to: {
		type: [String, Object],
		default: null,
	},
	type: {
		type: String,
		default: null,
	},
	color: {
		type: String,
		default: "white",
	},
	as: {
		type: String,
		default: null,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	small: Boolean,
	outline: Boolean,
	active: Boolean,
	disabled: Boolean,
	roundedFull: Boolean,
});

const is = computed(() => {
	if (props.as) {
		return props.as;
	}

	if (props.to) {
		return RouterLink;
	}

	if (props.href) {
		return "a";
	}

	return "button";
});

const computedType = computed(() => {
	if (is.value === "button") {
		return props.type ?? "button";
	}

	return null;
});

function blockDisabledClick(event) {
	if (props.disabled || props.loading) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}

const labelClass = computed(() => (props.small && props.icon ? "px-1" : "px-2"));

const componentClass = computed(() => {
	const base = [
		"inline-flex",
		"justify-center",
		"items-center",
		"whitespace-nowrap",
		"focus:outline-hidden",
		"transition-colors",
		"focus:ring-3 focus:ring-fipu_blue",
		"duration-150",
		"border",
		props.disabled ? "cursor-not-allowed" : "cursor-pointer",
		props.roundedFull ? "rounded-full" : "rounded-sm",
		getButtonColor(props.color, props.outline, !props.disabled, props.active),
	];

	if (!props.label && props.icon) {
		base.push("p-1");
	} else if (props.small) {
		base.push("text-sm", props.roundedFull ? "px-3 py-1" : "p-1");
	} else {
		base.push("py-2", props.roundedFull ? "px-6" : "px-3");
	}

	if (props.disabled) {
		base.push(props.outline ? "opacity-50" : "opacity-70");
	}

	return base;
});
</script>

<template>
	<component
		:is="inButtonGroup ? RovingFocusItem : Primitive"
		:as="is"
		:aria-busy="loading || undefined"
		:aria-disabled="disabled || loading || undefined"
		:tabindex="(disabled || loading) && is !== 'button' ? -1 : undefined"
		:class="componentClass"
		v-bind="{ ...(to ? {} : { href }), ...(inButtonGroup ? { focusable: !disabled && !loading } : {}) }"
		:type="computedType"
		:to="to"
		:target="target"
		:disabled="disabled || loading"
		@click.capture="blockDisabledClick">
		<svg v-if="loading" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" class="spinner_aj0A" fill="currentColor" />
		</svg>

		<BaseIcon v-if="icon && !loading" :path="icon" :size="iconSize" />
		<span v-if="label" :class="loading ? 'sr-only' : labelClass">{{ label }}</span>
		<BaseIcon v-if="iconRight && !loading" :path="iconRight" :size="iconSize" aria-hidden="true" />
	</component>
</template>
<style>
.spinner_aj0A {
	transform-origin: center;
	animation: spinner_KYSC 0.75s infinite linear;
}
@keyframes spinner_KYSC {
	100% {
		transform: rotate(360deg);
	}
}
</style>
