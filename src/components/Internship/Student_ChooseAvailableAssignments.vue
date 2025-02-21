<script setup>
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import { mdiNumeric, mdiClipboardTextOutline, mdiLaptop } from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { mainStore, studentStore, snackBarStore } from "@/main.js";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import { ref, computed, onMounted } from "vue";
import Utils from "@/helpers/utils.js";
import draggable from "vuedraggable";

import AOS from "aos";

onMounted(() => {
	AOS.init();
});

const Layout = computed(() => (mainStore.userAuthenticated ? LayoutAuthenticated : LayoutGuest));

const checkedAssignments = computed(() => mainStore.checkedAssignments);
const modalConfirmPreferences = ref(false);
const vueDraggableDragging = ref(false);
const isLoading = ref(false);
const napomena = ref(null);
const isFadedOut = ref(false);

const registerPreferences = async () => {
	isLoading.value = true;
	if (!mainStore.userAuthenticated) {
		snackBarStore.pushMessage("Morate biti prijavljeni da biste prijavili preferencije.", "warning");
		isLoading.value = false;
		return;
	}
	const result = await studentStore.registerPreferences(checkedAssignments.value, napomena.value);
	const message = result?.status === "OK" ? "Uspješno ste prijavili svoje preferencije." : "Preferencije nisu prijavljene. Molimo pokušajte ponovno ili kontaktirajte profesora.";
	const type = result?.status === "OK" ? "success" : "danger";

	snackBarStore.pushMessage(message, type);
	isLoading.value = false;
	await Utils.wait(2);
	location.reload();
};

onMounted(async () => {
	mainStore.allCompanies = await mainStore.fetchCompanies();
});

const getCompanyLogo = (assignment) => {
	const company = mainStore.allCompanies.find((c) => c.naziv === assignment["Poslodavac"][0].value);
	return company?.logo?.[0]?.url || "No-Logo.png";
};

const getDefaultImage = (index) => {
	const defaultImages = ["/select_task_1.svg", "/select_task_2.svg", "/select_task_3.svg"];
	return defaultImages[index] || "path/to/fallback.png";
};

const fadeOutAnimation = () => {
	isFadedOut.value = true;
};

function handlePerPageChange(option) {
	perPage.value = option.value;
	currentPage.value = 0;
}

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
		mainStore.checkedAssignments = newVal.filter((item) => !isEmptySlot(item));
	},
});

const handleDragStart = () => {
	vueDraggableDragging.value = true;
	fadeOutAnimation();
};

const handleDragEnd = () => {
	vueDraggableDragging.value = false;
};
</script>

<template>
	<component :is="Layout">
		<SectionMain class="relative">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main />

			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>

			<img src="/illustrations/technologies.svg" class="absolute right-0 top-0 mr-6 mt-4 hidden w-1/5 max-w-full md:block" />

			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardTextOutline" main title="Dostupni zadaci" />
			<p>Pogledajte zanimljive slobodne zadatke te odaberite i rasporedite 3 najdraža, prema vašim preferencijama: (1. odabir | 2. odabir | 3. odabir) gdje 1. odabir predstavlja zadatak koji najviše želite odraditi.</p>
			<br />
			<p>Molimo da <b>ne prijavljujete</b> zadatke gdje su poslodavci naveli ime i prezime studenta u <b>Preferencijama za studenta</b>.</p>
			<br />
			<p><b>Napomena:</b> Da biste prijavili preferencije, morate biti prijavljeni u aplikaciji!</p>
			<br />
			<CardBox has-table>
				<TableAvailableAssignments checkable />
			</CardBox>
			<hr />
			<br />
			<SectionTitleLineWithButton ref="vas_odabir" :icon="mdiNumeric" main title="Vaš odabir" class="mt-22" />
			<p v-if="checkedAssignments.length != 3" class="mb-4">Potrebno je odabrati minimalno 3 zadatka za prijavu preferencija.</p>
			<p v-if="checkedAssignments.length === 3" class="mb-4">Zadatke možete rasporediti po vašim preferencijama.</p>

			<draggable v-model="assignmentsForDrag" :disabled="!isDraggableEnabled" item-key="id" class="list-group flex w-full space-x-2" @start="handleDragStart" @end="handleDragEnd">
				<template #item="{ element, index }">
					<div class="flex-1">
						<div
							class="draggable-item aspect-h-1 aspect-w-1 relative flex items-center justify-center border-2 bg-gray-50"
							:class="{ grab: isAssignment(element) && isDraggableEnabled, grabbing: vueDraggableDragging && isAssignment(element) && isDraggableEnabled }">
							<transition name="image-fade">
								<img data-aos="zoom-out" v-if="isAssignment(element)" class="rounded-full sm:p-22" :src="getCompanyLogo(element)" />
								<img v-else class="sm:p-22" :src="getDefaultImage(index)" alt="Default Task" />
							</transition>
							<div v-if="isAssignment(element)" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-sm font-bold text-white opacity-0 transition-opacity hover:opacity-100">ID: {{ element.id_zadatak }}</div>
						</div>
					</div>
				</template>
			</draggable>

			<div v-if="checkedAssignments.length === 3">
				<div class="animation bg-[url('/swipe-vertical.png')] bg-center bg-no-repeat dark:invert md:bg-[url('/swipe-horizontal.png')]" :class="{ 'fade-out': isFadedOut }" @click="fadeOutAnimation"></div>
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
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
.grab {
	cursor: grab !important;
}
.grabbing {
	cursor: grabbing !important;
}
@keyframes left-right {
	0% {
		left: -30px;
	}
	50% {
		left: 30px;
	}
	100% {
		left: -30px;
	}
}
.animation {
	position: relative;
	width: 115px;
	height: 143px;
	margin: auto;
	animation: left-right 1.8s ease-out infinite;
}
@keyframes fade-out-anim {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
.animation.fade-out {
	animation: fade-out-anim 0.5s ease 1;
	opacity: 0;
}
.image-fade-enter-active,
.image-fade-leave-active {
	transition:
		opacity 0.5s ease,
		transform 0.5s ease;
}
.image-fade-enter-from,
.image-fade-leave-to {
	opacity: 0;
	transform: scale(0.9);
}
.image-fade-enter-to,
.image-fade-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>
