<script setup>
import { useCompanyLogos } from "@/composables/useCompanyLogos.js";
import InternshipPageHeader from "@/components/Internship/InternshipPageHeader.vue";
import StudentWithdrawAction from "@/components/Internship/StudentWithdrawAction.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import { mdiNumeric, mdiClipboardTextOutline } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";

import { ref, computed, nextTick, watch } from "vue";
import draggable from "vuedraggable";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const snackBarStore = useSnackBarStore();

const Layout = computed(() => (mainStore.userAuthenticated ? LayoutAuthenticated : LayoutGuest));

const checkedAssignments = ref([]);
const modalConfirmPreferences = ref(false);
const isLoading = ref(false);
const napomena = ref(null);
const vas_odabir = ref(null);
const hasScrolledForFirstTime = ref(false);

const registerPreferences = async () => {
	if (isLoading.value) return;
	isLoading.value = true;
	if (!mainStore.userAuthenticated) {
		snackBarStore.pushMessage("Morate biti prijavljeni da biste prijavili preferencije.", "warning");
		isLoading.value = false;
		return;
	}
	let saved = false;
	try {
		const result = await studentStore.registerPreferences(checkedAssignments.value, napomena.value);
		if (result?.status !== "OK") throw new Error("Submission failed");
		saved = true;
		snackBarStore.pushMessage("Uspješno ste prijavili svoje preferencije.", "success");
		await studentStore.getPendingUserTask(mainStore.currentUser.internship_process.id);
	} catch (error) {
		snackBarStore.pushMessage(saved ? "Podaci su spremljeni, ali stanje prakse nije osvježeno. Ponovno otvorite Moju praksu." : "Podaci nisu poslani. Molimo pokušajte ponovno ili kontaktirajte voditelja prakse.", "danger");
	} finally {
		isLoading.value = false;
	}
};


watch(
	() => checkedAssignments.value.length,
	(newLength) => {
		if (newLength === 3 && !hasScrolledForFirstTime.value) {
			vas_odabir.value?.$el.scrollIntoView({ behavior: "smooth" });
			hasScrolledForFirstTime.value = true;
		}
	},
);

const { getCompanyLogo } = useCompanyLogos(checkedAssignments);


const getDefaultImage = (index) => {
	const defaultImages = ["/select_task_1.svg", "/select_task_2.svg", "/select_task_3.svg"];
	return defaultImages[index] || "path/to/fallback.png";
};

const isDragging = ref(false);
const reorderAnimation = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
const isDraggableEnabled = computed(() => checkedAssignments.value.length === 3);
const isEmptySlot = (element) => element.id?.startsWith("empty");
const isAssignment = (element) => element && !isEmptySlot(element);

const assignmentsForDrag = computed({
	get() {
		const assignments = checkedAssignments.value.slice(0, 3).map((assignment) => ({
			...assignment,
			id: assignment.id_zadatak || assignment.id || `assignment-${assignment.id_zadatak}`,
		}));
		const emptySlots = new Array(3 - assignments.length).fill(null).map((_, idx) => ({ id: `empty-${idx}` }));
		return [...assignments, ...emptySlots];
	},
	set(newVal) {
		checkedAssignments.value = newVal.filter((item) => !isEmptySlot(item));
	},
});

const moveAssignment = async (index, offset, button) => {
	const card = button.closest("[data-draggable]");
	const neighbor = offset < 0 ? card.previousElementSibling : card.nextElementSibling;
	const movingCards = [card, neighbor];
	const positions = movingCards.map(item => item.getBoundingClientRect().left);
	const assignments = [...checkedAssignments.value];
	const [assignment] = assignments.splice(index, 1);
	assignments.splice(index + offset, 0, assignment);
	checkedAssignments.value = assignments;
	await nextTick();
	if (reorderAnimation) {
		movingCards.forEach((item, i) => {
			const distance = positions[i] - item.getBoundingClientRect().left;
			item.animate([{ transform: `translateX(${distance}px)` }, { transform: "none" }], { duration: reorderAnimation, easing: "ease-out" });
		});
	}
	const nextButton = button.disabled ? card.querySelector("button:enabled") : button;
	nextButton.focus({ preventScroll: true });
	card.animate([{ outline: "2px solid var(--rank-accent)", outlineOffset: "2px" }, { outline: "2px solid transparent", outlineOffset: "2px" }], 750);
};
</script>

<template>
	<component :is="Layout">
		<SectionMain class="assignment-picker relative">
			<div class="flex items-start gap-6">
				<div class="assignment-intro min-w-0 flex-1">
					<InternshipPageHeader />

					<br />
					<SectionTitleLineWithButton :icon="mdiClipboardTextOutline" main title="Dostupni zadaci" />
					<p>U tablici označite tri zadatka koja želite odraditi. Njihov redoslijed možete zatim urediti u odjeljku <a href="#vas-odabir" class="text-fipu_blue underline" @click.prevent="vas_odabir?.$el.scrollIntoView({ behavior: 'smooth' })">Vaš odabir</a>.</p>
					<br />
					<p>Molimo da <b>ne prijavljujete</b> zadatke gdje su poslodavci naveli ime i prezime studenta u <b>Preferencijama za studenta</b>.</p>
					<br />
					<p><b>Napomena:</b> Da biste prijavili preferencije, morate biti prijavljeni u aplikaciji!</p>
					<br />
				</div>
				<img src="/illustrations/selection.svg" alt="" class="hidden h-auto w-1/4 shrink-0 md:block" />
			</div>
			<CardBox has-table>
				<TableAvailableAssignments v-model="checkedAssignments" checkable />
			</CardBox>
			<hr />
			<br />
			<SectionTitleLineWithButton id="vas-odabir" ref="vas_odabir" :icon="mdiNumeric" main title="Vaš odabir" class="mt-22" />
			<p class="mb-1 font-semibold" role="status">Odabrano {{ checkedAssignments.length }} od 3</p>
			<p class="mb-4">{{ isDraggableEnabled ? "Na prvo mjesto stavite zadatak koji najviše želite." : "Označite zadatke u tablici iznad. Nakon trećeg odabira možete urediti redoslijed." }}</p>

			<div v-if="isDraggableEnabled" class="mb-3 inline-flex items-center gap-3 rounded-lg border-l-4 border-fipu_blue bg-white px-3 py-2 text-sm dark:bg-neutral-900">
				<img src="/swipe-horizontal.png" alt="" class="swipe-hand h-7 w-7 shrink-0 object-contain dark:invert" :class="{ 'is-dragging': isDragging }" />
				<span role="status">{{ isDragging ? "Otpustite karticu na označenom mjestu." : "Povucite karticu lijevo ili desno ili upotrijebite strelice." }}</span>
			</div>
			<div class="mb-1 grid max-w-2xl grid-cols-3 gap-2 text-center text-sm font-semibold" aria-hidden="true">
				<span v-for="rank in 3" :key="rank">{{ rank }}. izbor</span>
			</div>
			<draggable v-model="assignmentsForDrag" :disabled="!isDraggableEnabled" item-key="id" handle=".rank-card" :animation="reorderAnimation" ghost-class="rank-destination" class="grid max-w-2xl grid-cols-3 gap-2" @start="isDragging = true" @end="isDragging = false">
				<template #item="{ element, index }">
					<div class="relative min-w-0 rounded-lg border p-2 text-center" :class="{ 'border-dashed': isEmptySlot(element) }">
						<button v-if="isEmptySlot(element)" type="button" class="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-fipu_blue" :aria-label="`${index + 1}. izbor: Odaberite zadatak u tablici`" @click="snackBarStore.pushMessage('Odaberite zadatak u tablici', 'warning')" />
						<div class="rank-card" :class="{ 'cursor-grab active:cursor-grabbing': isDraggableEnabled }">
							<span class="sr-only">{{ index + 1 }}. izbor</span>
							<UserAvatar v-if="isAssignment(element)" class="my-2 h-12 w-12" :avatar="getCompanyLogo(element)" :username="element.Poslodavac?.[0]?.value || 'Poslodavac'" />
							<img v-else class="mx-auto my-2 h-12 w-12 dark:brightness-0 dark:invert" :src="getDefaultImage(index)" alt="" />
							<p class="wrap-break-word text-sm">{{ isAssignment(element) ? element.id_zadatak : "Slobodno mjesto" }}</p>
						</div>
						<div v-if="isDraggableEnabled" class="mt-2 flex flex-wrap justify-center gap-1">
							<button type="button" class="rank-arrow" :disabled="index === 0" :aria-label="`Pomakni zadatak ${element.id_zadatak} na više mjesto`" @click="moveAssignment(index, -1, $event.currentTarget)">←</button>
							<button type="button" class="rank-arrow" :disabled="index === 2" :aria-label="`Pomakni zadatak ${element.id_zadatak} na niže mjesto`" @click="moveAssignment(index, 1, $event.currentTarget)">→</button>
						</div>
						<span class="drop-label" aria-hidden="true">Otpustite ovdje</span>
					</div>
				</template>
			</draggable>

			<div v-if="isDraggableEnabled" class="mt-6">
				<FormField class="lg:mt-4" label="Napomena (nije obavezno)">
					<FormControl v-model="napomena" type="textarea" placeholder="Slobodno dodaj napomenu za voditelja prakse." />
				</FormField>
				<BaseButtons class="mb-16 mt-6 items-center justify-center space-y-2">
					<BaseButton type="submit" color="fipu_blue" class="dark:bg-fipu_blue! hover:bg-fipu_blue! text-neutral-900! hover:underline" label="Prijavi preferencije" :loading="isLoading" @click="modalConfirmPreferences = true" />
				</BaseButtons>
			</div>

			<CardBoxModal v-model="modalConfirmPreferences" title="Molimo potvrdite vaš odabir" button-label="Potvrđujem" has-cancel @confirm="registerPreferences">
				<p>Provjerite još jednom odabrane zadatke i njihov redoslijed:</p>
				<p v-for="(assignment, index) in checkedAssignments" :key="assignment.id_zadatak">
					<b>Odabir {{ index + 1 }}:</b> {{ assignment.id_zadatak }}
				</p>
				<p class="mb-2"><b>Napomena:</b> {{ napomena || "Nema napomene." }}</p>
			</CardBoxModal>
			<StudentWithdrawAction />
		</SectionMain>
	</component>
</template>

<style scoped>
@reference "../../css/main.css";
.assignment-picker {
	--rank-accent: theme("colors.fipu_blue");
}
@media (max-width: 639px) {
	.assignment-picker {
		padding: 16px 12px;
	}
	.assignment-intro {
		padding-bottom: 16px;
		font-size: 14px;
		line-height: 1.5;
	}
	.assignment-intro > br {
		display: none;
	}
	.assignment-intro > p {
		margin-top: 8px;
	}
	.assignment-intro :deep(section) {
		margin: 16px 0 12px;
	}
	.assignment-intro :deep(section:first-child) {
		margin-top: 0;
	}
	.assignment-intro :deep(h1) {
		font-size: 24px;
	}
}
.drop-label {
	display: none;
}
.rank-destination {
	@apply border-2 border-dashed border-fipu_blue bg-white dark:bg-neutral-900;
}
.rank-destination > div {
	visibility: hidden;
}
.rank-destination .drop-label {
	@apply absolute inset-0 grid place-items-center p-1 text-sm font-semibold;
}
@media (prefers-reduced-motion: no-preference) {
	.swipe-hand:not(.is-dragging) {
		animation: swipe-hint 1.6s ease-in-out 3;
	}
	@keyframes swipe-hint {
		50% { transform: translateX(5px) rotate(8deg); }
	}
}
.rank-arrow {
	@apply rounded-sm border px-2 py-1 leading-none enabled:hover:bg-gray-100 disabled:opacity-30 focus-visible:outline-fipu_blue dark:enabled:hover:bg-neutral-700;
}
</style>
