<script setup>
import { DatePicker, Popover } from "reka-ui/namespaced";
import { parseDate } from "@internationalized/date";
import { computed } from "vue";
const props = defineProps({
	modelValue: { type: String, default: "" },
	id: { type: String, default: undefined },
	name: { type: String, default: undefined },
	inputClass: { type: [String, Array], default: undefined },
	min: { type: [String, Number], default: undefined },
	max: { type: [String, Number], default: undefined },
	disabled: Boolean,
	readonly: Boolean,
	required: Boolean,
});
const emit = defineEmits(["update:modelValue"]);
function date(value) {
	if (!value) return undefined;
	try {
		return parseDate(String(value));
	} catch {
		return undefined;
	}
}
const selected = computed({
	get: () => date(props.modelValue),
	set: (value) => emit("update:modelValue", value?.toString() ?? ""),
});
</script>
<template>
	<DatePicker.Root :id="id" v-model="selected" :name="name" locale="hr-HR" :week-starts-on="1" :disabled="disabled" :readonly="readonly" :required="required" :min-value="date(min)" :max-value="date(max)" close-on-select>
		<DatePicker.Field v-slot="{ segments }" :class="inputClass" class="form-control-surface flex items-center border-gray-700 bg-white dark:bg-slate-800">
			<DatePicker.Input v-for="item in segments" :key="item.part" :part="item.part" class="rounded focus:bg-fipu_blue/20 focus:outline-none">{{ item.value }}</DatePicker.Input>
			<DatePicker.Trigger :disabled="disabled || readonly" aria-label="Otvori kalendar" class="ml-auto rounded px-2 focus-visible:ring focus-visible:ring-fipu_blue">▦</DatePicker.Trigger>
		</DatePicker.Field>
		<Popover.Portal>
			<DatePicker.Content :side-offset="4" class="reka-animated z-[10000] rounded border border-gray-200 bg-white p-3 text-gray-700 shadow-lg dark:bg-slate-800 dark:text-white">
				<DatePicker.Calendar v-slot="{ grid, weekDays }">
					<DatePicker.Header class="mb-2 flex items-center justify-between gap-3">
						<DatePicker.Prev aria-label="Prethodni mjesec" class="rounded p-2 hover:bg-gray-100 focus-visible:ring">‹</DatePicker.Prev>
						<DatePicker.Heading class="font-semibold" />
						<DatePicker.Next aria-label="Sljedeći mjesec" class="rounded p-2 hover:bg-gray-100 focus-visible:ring">›</DatePicker.Next>
					</DatePicker.Header>
					<DatePicker.Grid v-for="month in grid" :key="month.value.toString()" class="date-grid">
						<DatePicker.GridHead
							><DatePicker.GridRow
								><DatePicker.HeadCell v-for="day in weekDays" :key="day" class="p-1 text-xs font-normal text-gray-500">{{ day }}</DatePicker.HeadCell></DatePicker.GridRow
							></DatePicker.GridHead
						>
						<DatePicker.GridBody>
							<DatePicker.GridRow v-for="(week, index) in month.rows" :key="index">
								<DatePicker.Cell v-for="day in week" :key="day.toString()" :date="day">
									<DatePicker.CellTrigger
										:day="day"
										:month="month.value"
										class="flex h-9 w-9 items-center justify-center rounded data-[disabled]:pointer-events-none data-[selected]:bg-fipu_blue data-[today]:font-bold data-[outside-view]:text-gray-400 data-[selected]:text-white data-[disabled]:opacity-30 hover:bg-gray-100 focus-visible:ring focus-visible:ring-fipu_blue" />
								</DatePicker.Cell>
							</DatePicker.GridRow>
						</DatePicker.GridBody>
					</DatePicker.Grid>
				</DatePicker.Calendar>
			</DatePicker.Content>
		</Popover.Portal>
	</DatePicker.Root>
</template>

<style scoped>
/* Keep the calendar grid independent of the dashboard's responsive data tables. */
.date-grid { width: auto; }
.date-grid :deep(thead) { display: table-header-group; }
.date-grid :deep(tr) { display: table-row; border: 0; background: transparent; }
.date-grid :deep(td) { display: table-cell; border: 0; padding: 0; vertical-align: middle; }
.date-grid :deep(td::before) { display: none; }
.date-grid :deep(th) { padding: 0.25rem; text-align: center; }
</style>
