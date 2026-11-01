<script setup>
import { inject } from "vue";
const fieldLabelId = inject("formFieldLabelId", undefined);
import {
	DatePickerRoot,
	DatePickerField,
	DatePickerInput,
	DatePickerTrigger,
	DatePickerContent,
	DatePickerCalendar,
	DatePickerHeader,
	DatePickerHeading,
	DatePickerPrev,
	DatePickerNext,
	DatePickerGrid,
	DatePickerGridHead,
	DatePickerGridBody,
	DatePickerGridRow,
	DatePickerHeadCell,
	DatePickerCell,
	DatePickerCellTrigger,
	PopoverPortal,
} from "reka-ui";
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
	<DatePickerRoot
		:id="id"
		v-model="selected"
		:aria-labelledby="fieldLabelId"
		:name="name"
		locale="hr-HR"
		:week-starts-on="1"
		:disabled="disabled"
		:readonly="readonly"
		:required="required"
		:min-value="date(min)"
		:max-value="date(max)"
		close-on-select>
		<DatePickerField v-slot="{ segments }" :class="inputClass" class="form-control-surface flex items-center border-gray-700 bg-white dark:bg-slate-800">
			<DatePickerInput v-for="item in segments" :key="item.part" :part="item.part" class="rounded focus:bg-fipu_blue/20 focus:outline-none">{{ item.value }}</DatePickerInput>
			<DatePickerTrigger :disabled="disabled || readonly" aria-label="Otvori kalendar" class="ml-auto rounded px-2 focus-visible:ring focus-visible:ring-fipu_blue">▦</DatePickerTrigger>
		</DatePickerField>
		<PopoverPortal>
			<DatePickerContent :side-offset="4" class="z-[10000] rounded border border-gray-200 bg-white p-3 text-gray-700 shadow-lg dark:bg-slate-800 dark:text-white">
				<DatePickerCalendar v-slot="{ grid, weekDays }">
					<DatePickerHeader class="mb-2 flex items-center justify-between gap-3">
						<DatePickerPrev aria-label="Prethodni mjesec" class="rounded p-2 hover:bg-gray-100 focus-visible:ring">‹</DatePickerPrev>
						<DatePickerHeading class="font-semibold" />
						<DatePickerNext aria-label="Sljedeći mjesec" class="rounded p-2 hover:bg-gray-100 focus-visible:ring">›</DatePickerNext>
					</DatePickerHeader>
					<DatePickerGrid v-for="month in grid" :key="month.value.toString()" class="date-grid">
						<DatePickerGridHead
							><DatePickerGridRow
								><DatePickerHeadCell v-for="day in weekDays" :key="day" class="p-1 text-xs font-normal text-gray-500">{{ day }}</DatePickerHeadCell></DatePickerGridRow
							></DatePickerGridHead
						>
						<DatePickerGridBody>
							<DatePickerGridRow v-for="(week, index) in month.rows" :key="index">
								<DatePickerCell v-for="day in week" :key="day.toString()" :date="day">
									<DatePickerCellTrigger
										:day="day"
										:month="month.value"
										class="flex h-9 w-9 items-center justify-center rounded data-[disabled]:pointer-events-none data-[selected]:bg-fipu_blue data-[today]:font-bold data-[outside-view]:text-gray-400 data-[selected]:text-white data-[disabled]:opacity-30 hover:bg-gray-100 focus-visible:ring focus-visible:ring-fipu_blue" />
								</DatePickerCell>
							</DatePickerGridRow>
						</DatePickerGridBody>
					</DatePickerGrid>
				</DatePickerCalendar>
			</DatePickerContent>
		</PopoverPortal>
	</DatePickerRoot>
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
