<script setup>
import { ref, computed } from "vue";

const props = defineProps({ labelName: { type: String, default: "" }, emitName: { type: String, default: "" }, list: { type: Array, default: () => [] }, l: Boolean, disabled: Boolean, important: Boolean, help: { type: String, default: "" } });
const model = defineModel({ type: [String, Object], default: "" });

function update(value) {
	model.value = value;
}
const computedList = computed(() => {

  if (props.list.length === 0) return props.list;

  const modelValue = model.value ? model.value.toLowerCase().replace(/\s+/g, '') : '';

  const itemExists = props.list.findIndex((item) =>
    item[props.labelName] && item[props.labelName] === model.value
  ) !== -1;

  return itemExists
    ? props.list
    : props.list.filter((item) =>
        item[props.labelName] &&
        item[props.labelName].toLowerCase().replace(/\s+/g, '').includes(modelValue)
      );
});


const pfo = ref(false);
async function preventFocusOut() {
	pfo.value = true;
	setTimeout(() => {
		pfo.value = false;
	}, "100");
}
function checkFocusOut() {
	if (pfo.value) return;
	if (props.list.findIndex((l) => l[props.labelName] == model.value) == -1) model.value = "";
}
</script>

<template>
	<div class="flex flex-col gap-2" :class="disabled ? 'pointer-events-none opacity-75 contrast-[0.9]' : ''">
		<div class="group relative w-full">
			<div class="rounded border" :class="important ? 'border-red-500' : 'border-gray-700'">
				<input
					v-model="model"
					class="peer relative block w-full max-w-full cursor-text overflow-hidden rounded border-0 bg-transparent bg-white p-3 text-left hover:border-cyan-700 focus:outline-none focus:ring focus:ring-fipu_blue"
					@input="show = true"
					@focusout="
						!focus ? (show = false) : '';
						checkFocusOut();
					"
					@click="show = !show" />
			</div>

			<div class="absolute right-1.5 top-0 flex h-full items-center justify-center px-1" @focusout="!focus ? (show = false) : ''" @click="show = !show">
				<div class="aspect-square absolute mr-4 flex h-fit w-fit items-center justify-center bg-white px-0.5">
					<i class="fa-solid fa-caret-down cursor-pointer transition-all duration-300" :class="[show ? '-scale-100' : '', important ? 'text-red-500' : 'text-gray-700']"></i>
				</div>
			</div>

			<div :class="show ? 'h-fit max-h-64 opacity-100' : 'h-0 opacity-0'" class="fipu_vertical_scrollbar absolute z-50 mt-2 w-full overflow-hidden overflow-y-auto rounded bg-gray-50 drop-shadow-lg transition-opacity duration-300" @mouseleave="focus = false" @mouseenter="focus = true">
				<ul class="z-50 w-full text-left" aria-labelledby="drop-shadow-lg" @mousedown="preventFocusOut()">
					<div
						v-for="(v, id) in computedList"
						:key="id"
						class="z-50 block cursor-pointer whitespace-nowrap px-2"
						:class="[(labelName ? v[labelName] : v) == model ? 'bg-fipu_blue font-bold text-gray-50 hover:bg-opacity-80' : 'text-gray-950 hover:bg-gray-200 hover:font-bold hover:text-gray-700', l ? 'py-2 text-sm' : 'py-4']"
						@click="
							show = false;
							update(emitName ? v[emitName] : v);
						">
						{{ labelName ? v[labelName] : v }}
					</div>
				</ul>
			</div>
		</div>
    <div class="text-xs -mt-1" :class="important ? 'text-red-500' : 'text-gray-500'">{{important ? 'Polje je obavezno' : help}}</div>
	</div>
</template>

<script>
export default {
	name: "FormCombobox",
	data() {
		return {
			show: false,
			focus: false,
		};
	},
};
</script>
