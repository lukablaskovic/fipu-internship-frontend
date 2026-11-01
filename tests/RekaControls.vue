<script setup>
import SelectProcessButton from "../src/components/SelectProcessButton.vue";
import BaseTooltip from "../src/components/Base/Tooltip.vue";
import { Tooltip } from "reka-ui/namespaced";
import Select from "../src/components/Premium/FormControlListbox.vue";
import Group from "../src/components/Form/FormCheckRadioGroup.vue";
import DatePicker from "../src/components/Form/FormDatePicker.vue";
import Modal from "../src/components/Cardbox/CardBoxModal.vue";
import Combobox from "../src/components/Form/FormCombobox.vue";
import BaseButton from "../src/components/Base/BaseButton.vue";
import Check from "../src/components/Form/FormCheckRadio.vue";
import Menu from "../src/components/Premium/ButtonMenu.vue";
import "../src/css/main.css";
import { ref } from "vue";
const options = [
	{ id: 1, label: "Prva" },
	{ id: 2, label: "Druga" },
	{ id: 3, label: "Nedostupna", unavailable: true },
];
const selectedProcess = ref("");
const selected = ref({ ...options[0] }),
	checks = ref([]),
	radio = ref("a"),
	date = ref("2026-11-15"),
	open = ref(false),
	combo = ref(""),
	empty = ref(""),
	action = ref(null),
	clicks = ref(0),
	cancels = ref(0);
</script>
<template>
	<Tooltip.Provider :delay-duration="1000"><main style="max-width: 640px; margin: auto; padding: 24px">
		<SelectProcessButton button="A" :selected-process="selectedProcess" @click="selectedProcess = 'A'" />
		<BaseButton label="Disabled link" href="#bad" disabled @click="clicks++" />
		<BaseButton label="Loading" loading />
		<output data-testid="clicks">{{ clicks }}</output>
		<form>
			<Select id="required-select" v-model="empty" name="required-choice" :options="['', 'Vrijednost']" button-class="h-12 w-full rounded border px-3" required />
			<Select id="select" v-model="selected" name="choice" :options="options" button-class="h-12 w-full rounded border px-3" required />
			<output data-testid="selected">{{ selected.id }}</output>
			<Check v-model="checks" type="switch" name="switch" input-value="one" label="Obavijesti" />
			<Check v-model="checks" name="check" input-value="two" label="Potvrda" />
			<output data-testid="checks">{{ JSON.stringify(checks) }}</output>
			<Group v-model="radio" type="radio" name="radio" :options="{ a: 'A', b: 'B' }" />
			<output data-testid="radio">{{ radio }}</output>
			<DatePicker v-model="date" name="date" min="2026-11-10" max="2026-11-20" input-class="h-12 rounded border px-3" />
			<output data-testid="date">{{ date }}</output>
		</form>
		<Combobox v-model="combo" :list="options" label-name="label" emit-name="label" />
		<output data-testid="combo">{{ combo }}</output>
		<Menu
			label="Akcije"
			:options="[
				[
					{ id: 1, label: 'Uredi' },
					{ id: 2, label: 'Zabrana', disabled: true },
				],
			]"
			@update:model-value="action = $event" />
		<output data-testid="action">{{ action?.id }}</output>
		<BaseButton label="Otvori modal" @click="open = true" />
		<Modal v-model="open" title="Test modal" has-cancel @cancel="cancels++"><input aria-label="Modal input" /><Select v-model="selected" :options="options" button-class="w-full border" /></Modal>
		<output data-testid="cancels">{{ cancels }}</output>
	<BaseTooltip content="Pomoć za praksu"><button type="button">Tooltip test</button></BaseTooltip>
</main></Tooltip.Provider>
</template>
