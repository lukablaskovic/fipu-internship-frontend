<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Popover, Progress } from "reka-ui/namespaced";
import { mdiCheck } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { getInternshipProgress } from "@/helpers/internship-stages";
import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import { useUiStore } from "@/stores/ui_store";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const uiStore = useUiStore();
const open = ref(false);
let closeTimer;
const process = computed(() => studentStore.student_process_instance_data);
const progress = computed(() => {
	if (mainStore.userAdmin || !mainStore.currentUser.internship_process.id || process.value.id !== mainStore.currentUser.internship_process.id || process.value.state === "cancelled" || process.value.active_event === "odustajanje_od_prakse") return null;
	return getInternshipProgress(mainStore.currentUser.model_prakse, process.value);
});
const status = computed(() => {
	if (progress.value?.value === 100) return "Praksa je završena";
	return progress.value?.stages[progress.value.currentIndex]?.name || "Obrada podataka o praksi";
});

watch(() => mainStore.currentUser.internship_process.id, (id) => {
	open.value = false;
	if (!mainStore.userAdmin && id && process.value.id !== id) studentStore.getInstanceInfo(id);
}, { immediate: true });

function show(event) {
	if (event.pointerType === "touch") return;
	clearTimeout(closeTimer);
	open.value = true;
}
function close(event) {
	if (event.pointerType === "touch") return;
	clearTimeout(closeTimer);
	closeTimer = setTimeout(() => { open.value = false; }, 150);
}
onBeforeUnmount(() => clearTimeout(closeTimer));
</script>

<template>
	<div v-if="progress" class="sticky top-14 z-20 w-full bg-gray-50 dark:bg-slate-800">
		<Popover.Root v-model:open="open">
			<Popover.Trigger as-child>
				<button type="button" :aria-label="`Napredak prakse: ${status}. Prikaži faze prakse.`" class="block min-h-[44px] w-full py-4 outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-700 dark:focus-visible:ring-fipu_blue" @pointerenter="show" @pointerleave="close">
					<Progress.Root :model-value="progress.value" :get-value-label="() => status" aria-label="Napredak stručne prakse" class="relative h-2 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
						<Progress.Indicator class="h-full bg-fipu_blue motion-safe:transition-transform motion-safe:duration-500" :style="{ transform: `translateX(-${100 - (progress.value ?? 0)}%)` }" />
						<span aria-hidden="true" class="pointer-events-none absolute inset-0 flex">
							<span v-for="stage in progress.stages" :key="stage._id" class="flex-1 border-r-2 border-gray-50 last:border-r-0 dark:border-slate-800" />
						</span>
					</Progress.Root>
				</button>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content side="bottom" :side-offset="0" :collision-padding="12" :class="{ dark: uiStore.darkMode }" class="reka-animated z-40 max-h-(--reka-popover-content-available-height) w-xl max-w-[calc(100vw-24px)] overflow-y-auto rounded-xl outline-hidden" aria-label="Faze stručne prakse" @open-auto-focus.prevent @close-auto-focus.prevent @pointerenter="show" @pointerleave="close">
					<div class="rounded-xl bg-white p-5 text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-100">
						<div class="mb-4 flex items-start justify-between gap-4">
							<div>
								<p class="font-semibold">Tvoja praksa · Model {{ mainStore.currentUser.model_prakse }}</p>
								<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ status }}</p>
							</div>
							<span v-if="progress.value !== null" class="text-lg font-semibold tabular-nums rounded-md bg-fipu_blue px-2 text-slate-900 dark:bg-transparent dark:text-fipu_blue">{{ progress.value }}%</span>
						</div>
						<ol class="space-y-1">
							<li v-for="(stage, index) in progress.stages" :key="stage._id" :aria-current="index === progress.currentIndex ? 'step' : undefined" class="flex items-center gap-3 rounded-md px-2 py-2 text-sm" :class="index === progress.currentIndex ? 'bg-fipu_blue/10 font-semibold text-slate-900 dark:bg-cyan-950 dark:text-cyan-100' : 'text-slate-600 dark:text-slate-300'">
								<span aria-hidden="true" class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs tabular-nums" :class="index < progress.completed ? 'bg-fipu_blue text-slate-900' : index === progress.currentIndex ? 'border-2 border-fipu_blue' : 'border border-slate-300 dark:border-slate-600'">
									<BaseIcon v-if="index < progress.completed" :path="mdiCheck" :size="14" />
									<span v-else>{{ index + 1 }}</span>
								</span>
								<span class="flex-1">{{ stage.form_title }}</span>
								<span class="text-xs">{{ index < progress.completed ? 'Dovršeno' : index === progress.currentIndex ? 'U tijeku' : 'Nije započeto' }}</span>
							</li>
						</ol>
						<p class="mt-4 text-xs text-slate-500 dark:text-slate-400">Napredak po fazama procesa, ne po trajanju prakse.</p>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</div>
</template>
