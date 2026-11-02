<script setup>
import { appConfig } from "@/config";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import { mdiNumeric, mdiClipboardTextOutline, mdiLaptop } from "@mdi/js";
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

import { ref, computed, onMounted, watch } from "vue";
import { DEFAULT_COMPANY_LOGO, fetchCompanyForAssignment, findCompanyForAssignment, getCompanyLogoKey, getCompanyLogoUrl, rememberCompany } from "@/helpers/company-logo.js";
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
const companiesLoaded = ref(false);
const companyLogoCache = ref({});
const loadingCompanyLogoKeys = new Set();

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

onMounted(async () => {
	mainStore.allCompanies = await mainStore.fetchCompanies();
	companiesLoaded.value = true;
	loadCompanyLogos(checkedAssignments.value);
});

watch(
	() => checkedAssignments.value.length,
	(newLength) => {
		if (newLength === 3 && !hasScrolledForFirstTime.value) {
			vas_odabir.value?.$el.scrollIntoView({ behavior: "smooth" });
			hasScrolledForFirstTime.value = true;
		}
	},
);

const getCompanyLogo = (assignment) => {
	const key = getCompanyLogoKey(assignment);

	return (key && companyLogoCache.value[key]) || getCompanyLogoUrl(findCompanyForAssignment(assignment, mainStore.allCompanies)) || DEFAULT_COMPANY_LOGO;
};

const loadCompanyLogo = async (assignment) => {
	const key = getCompanyLogoKey(assignment);

	if (!key || companyLogoCache.value[key] || loadingCompanyLogoKeys.has(key)) {
		return;
	}

	if (!companiesLoaded.value && !mainStore.allCompanies.length) {
		return;
	}

	const cachedLogo = getCompanyLogoUrl(findCompanyForAssignment(assignment, mainStore.allCompanies));
	if (cachedLogo) {
		companyLogoCache.value[key] = cachedLogo;
		return;
	}

	loadingCompanyLogoKeys.add(key);
	try {
		const company = await fetchCompanyForAssignment(mainStore, assignment);
		rememberCompany(mainStore, company);
		companyLogoCache.value[key] = getCompanyLogoUrl(company) || DEFAULT_COMPANY_LOGO;
	} finally {
		loadingCompanyLogoKeys.delete(key);
	}
};

const loadCompanyLogos = (assignments) => {
	assignments.forEach((assignment) => loadCompanyLogo(assignment));
};

watch(checkedAssignments, loadCompanyLogos, { immediate: true, deep: true });
watch(() => mainStore.allCompanies, () => loadCompanyLogos(checkedAssignments.value), { deep: true });

const getDefaultImage = (index) => {
	const defaultImages = ["/select_task_1.svg", "/select_task_2.svg", "/select_task_3.svg"];
	return defaultImages[index] || "path/to/fallback.png";
};

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

const moveAssignment = (index, offset) => {
	const assignments = [...checkedAssignments.value];
	const [assignment] = assignments.splice(index, 1);
	assignments.splice(index + offset, 0, assignment);
	checkedAssignments.value = assignments;
};
</script>

<template>
	<component :is="Layout">
		<SectionMain class="relative">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main />

			<p><b>Akademska godina:</b> {{ appConfig.academicYear }}</p>
			<p><b>Voditelj:</b> {{ appConfig.voditelj_prakse }}</p>

			<img src="/illustrations/selection.svg" class="absolute right-0 top-0 mr-6 mt-4 hidden w-1/4 max-w-full md:block" />

			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardTextOutline" main title="Dostupni zadaci" />
			<p>U tablici označite tri zadatka koja želite odraditi. Njihov redoslijed možete zatim urediti u odjeljku „Vaš odabir”.</p>
			<br />
			<p>Molimo da <b>ne prijavljujete</b> zadatke gdje su poslodavci naveli ime i prezime studenta u <b>Preferencijama za studenta</b>.</p>
			<br />
			<p><b>Napomena:</b> Da biste prijavili preferencije, morate biti prijavljeni u aplikaciji!</p>
			<br />
			<CardBox has-table>
				<TableAvailableAssignments v-model="checkedAssignments" checkable />
			</CardBox>
			<hr />
			<br />
			<SectionTitleLineWithButton ref="vas_odabir" :icon="mdiNumeric" main title="Vaš odabir" class="mt-22" />
			<p class="mb-1 font-semibold" role="status">Odabrano {{ checkedAssignments.length }} od 3</p>
			<p class="mb-4">{{ isDraggableEnabled ? "Na prvo mjesto stavite zadatak koji najviše želite. Redoslijed promijenite povlačenjem kartice ili strelicama." : "Označite zadatke u tablici iznad. Nakon trećeg odabira možete urediti redoslijed." }}</p>

			<draggable v-model="assignmentsForDrag" :disabled="!isDraggableEnabled" item-key="id" handle=".rank-card" class="grid max-w-2xl grid-cols-3 gap-2">
				<template #item="{ element, index }">
					<div class="min-w-0 rounded-lg border p-2 text-center" :class="{ 'border-dashed': isEmptySlot(element) }">
						<div class="rank-card" :class="{ 'cursor-grab active:cursor-grabbing': isDraggableEnabled }">
							<p class="text-sm font-semibold">{{ index + 1 }}. izbor</p>
							<UserAvatar v-if="isAssignment(element)" class="my-2 h-12 w-12" :avatar="getCompanyLogo(element)" :username="element.Poslodavac?.[0]?.value || 'Poslodavac'" />
							<img v-else class="mx-auto my-2 h-12 w-12" :src="getDefaultImage(index)" alt="" />
							<p class="break-words text-sm">{{ isAssignment(element) ? element.id_zadatak : "Slobodno mjesto" }}</p>
						</div>
						<div v-if="isDraggableEnabled" class="mt-2 flex flex-wrap justify-center gap-1">
							<button type="button" class="rank-arrow" :disabled="index === 0" :aria-label="`Pomakni zadatak ${element.id_zadatak} na više mjesto`" @click="moveAssignment(index, -1)">←</button>
							<button type="button" class="rank-arrow" :disabled="index === 2" :aria-label="`Pomakni zadatak ${element.id_zadatak} na niže mjesto`" @click="moveAssignment(index, 1)">→</button>
						</div>
					</div>
				</template>
			</draggable>

			<div v-if="isDraggableEnabled" class="mt-6">
				<FormField class="lg:mt-4" label="Napomena (nije obavezno)">
					<FormControl v-model="napomena" type="textarea" placeholder="Slobodno dodaj napomenu za voditelja prakse." />
				</FormField>
				<BaseButtons class="mb-16 mt-6 items-center justify-center space-y-2">
					<BaseButton type="submit" color="fipu_light_blue" label="Prijavi preferencije" :loading="isLoading" @click="modalConfirmPreferences = true" />
				</BaseButtons>
			</div>

			<CardBoxModal v-model="modalConfirmPreferences" title="Molimo potvrdite vaš odabir" button-label="Potvrđujem" has-cancel @confirm="registerPreferences">
				<p>Provjerite još jednom odabrane zadatke i njihov redoslijed:</p>
				<p v-for="(assignment, index) in checkedAssignments" :key="assignment.id_zadatak">
					<b>Odabir {{ index + 1 }}:</b> {{ assignment.id_zadatak }}
				</p>
				<p class="mb-2"><b>Napomena:</b> {{ napomena || "Nema napomene." }}</p>
			</CardBoxModal>
		</SectionMain>
	</component>
</template>

<style scoped>
.rank-arrow {
	@apply rounded border px-2 py-1 leading-none enabled:hover:bg-gray-100 disabled:opacity-30 dark:enabled:hover:bg-slate-700;
}
</style>
