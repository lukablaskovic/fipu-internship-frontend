<script setup>
import { mdiClipboardCheckOutline, mdiClipboardTextOutline, mdiLaptop, mdiAlertCircle, mdiCheckCircle, mdiAlert, mdiClose } from "@mdi/js";
import draggable from "vuedraggable";
import { ref, computed } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";

import { mainStore, guestStore, studentStore } from "@/main.js";
import Utils from "@/helpers/utils.js";

const Layout = computed(() => {
	if (mainStore.userAuthenticated) {
		return LayoutAuthenticated;
	} else {
		return LayoutGuest;
	}
});

const checkedAssignments = computed(() => guestStore.checkedAssignments);
numberBlocks: [null, null, null];

const numberBlocks = computed(() => {
	const assignments = checkedAssignments.value.slice(0, 3); // Get only up to 3 assignments
	const emptySlots = new Array(3 - assignments.length).fill(null); // Fill the rest with null
	return [...assignments, ...emptySlots]; // Merge the assignments and empty slots
});

const modalConfirmPreferences = ref(false);
const enabled = ref(true);
const vueDraggableDragging = ref(false);

const notificationBar = ref(null);
let notificationStatus = ref();
let notificationMessage = ref();

const notificationSettingsModel = ref([]);
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf("outline") > -1);

function showNotificationBar(type) {
	switch (type) {
		case "success":
			notificationBar.value.color = "success";
			notificationBar.value.icon = mdiCheckCircle;
			notificationStatus.value = "To je to!";
			notificationMessage.value = " Uspješno ste prijavili svoje preferencije.";
			break;
		case "warning":
			notificationBar.value.color = "warning";
			notificationBar.value.icon = mdiAlert;
			notificationStatus.value = "Upozorenje.";
			notificationMessage.value = "Morate biti prijavljeni da biste prijavili preferencije.";
			break;
		case "danger":
			notificationBar.value.color = "danger";
			notificationBar.value.icon = mdiAlertCircle;
			notificationStatus.value = "Greška!";
			notificationMessage.value = "Preferencije nisu prijavljene. Molimo pokušajte ponovno ili kontaktirajte profesora.";
			break;
	}
	notificationBar.value.show();
}

const isLoading = ref(false);

let napomena = ref(null);
const registerPreferences = async () => {
	isLoading.value = true;

	if (!mainStore.userAuthenticated) {
		showNotificationBar("warning");
		isLoading.value = false;
		return;
	} else {
		let result = await studentStore.registerPreferences(checkedAssignments.value, napomena.value);
		if (result && result.status == "OK") {
			showNotificationBar("success");
		} else {
			showNotificationBar("danger");
		}
		isLoading.value = false;

		await Utils.wait(2);
		location.reload();
	}
};

const getCompanyLogo = (assignment) => {
	const company = mainStore.allCompanies.find((c) => c.naziv === assignment["Poslodavac"][0].value);
	return company["logo"][0]["url"] ? company["logo"][0]["url"] : "No-Logo.png";
};

const getDefaultImage = (index) => {
	const defaultImages = ["/select_task_1.svg", "/select_task_2.svg", "/select_task_3.svg"];
	return defaultImages[index] || "path/to/fallback.png";
};

const vas_odabir = ref(null);

const isFadedOut = ref(false);

function fadeOutAnimation() {
	isFadedOut.value = true;
}

const isDraggableEnabled = computed(() => checkedAssignments.value.length === 3);
</script>

<template>
	<component :is="Layout">
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardTextOutline" main title="Dostupni zadaci za praksu"></SectionTitleLineWithButton>
			<p>Pogledajte zanimljive slobodne zadatke te odaberite i rasporedite 3 najdraža - (1. odabir | 2. odabir | 3. odabir).</p>
			<p><b>Napomena:</b> Da biste prijavili preferencije, morate biti prijavljeni u aplikaciji!</p>
			<br />
			<CardBox has-table>
				<TableAvailableAssignments checkable />
			</CardBox>
			<hr />
			<br />
			<SectionTitleLineWithButton ref="vas_odabir" :icon="mdiClipboardCheckOutline" main title="Vaš odabir"></SectionTitleLineWithButton>
			<p v-if="checkedAssignments.length === 3" class="mb-4">Zadatke možete rasporediti po vašim preferencijama.</p>

			<draggable :list="checkedAssignments" :disabled="!isDraggableEnabled" item-key="id" class="list-group flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0" ghost-class="ghost" @start="fadeOutAnimation" @end="!vueDraggableDragging">
				<template #item="{ element, index }">
					<div
						class="drag-handle list-group-item flex w-full space-x-2"
						:class="{
							'not-draggable': !enabled,
							'cursor-move': enabled,
						}"></div>
				</template>
			</draggable>
			<div class="flex w-full space-x-2">
				<div class="flex-1" v-for="(assignment, index) in numberBlocks" :key="index">
					<div
						class="aspect-w-1 aspect-h-1 relative flex items-center justify-center border-2 bg-gray-50"
						:class="{
							'hover:bg-gray-400': assignment,
							'transition-all': assignment,
						}"
						:style="{ filter: assignment ? 'none' : 'blur(0)' }">
						<transition name="image-fade">
							<img v-if="assignment" class="rounded-full p-22" :src="getCompanyLogo(assignment)" key="logo" />
							<img v-else class="p-22" :src="getDefaultImage(index)" alt="Default Task" key="default" />
						</transition>

						<!-- Show assignment ID only if there is an assignment and hover over it -->
						<div v-if="assignment" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-sm font-bold text-white opacity-0 transition-opacity hover:opacity-100">ID: {{ assignment["id_zadatak"] }}</div>
					</div>
				</div>
			</div>

			<div v-if="checkedAssignments.length == 3">
				<div class="animation bg-[url('/swipe-vertical.png')] bg-center bg-no-repeat dark:invert md:bg-[url('/swipe-horizontal.png')]" :class="{ 'fade-out': isFadedOut }" @click="fadeOutAnimation"></div>

				<FormField class="lg:mt-4" label="Napomena (nije obavezno)">
					<FormControl v-model="napomena" type="textarea" placeholder="Slobodno dodaj napomenu za voditelja prakse." />
				</FormField>
				<BaseButtons class="mb-16 mt-6 items-center justify-center space-y-2">
					<BaseButton type="submit" color="fipu_light_blue" label="Prijavi preferencije" :loading="isLoading" @click="modalConfirmPreferences = true" />
				</BaseButtons>
			</div>
			<div>
				<NotificationBar ref="notificationBar" class="animate__animated animate__fadeInUp" :outline="notificationsOutline">
					<b>{{ notificationStatus }}</b> {{ notificationMessage }}
					<template #right>
						<BaseButton :icon="mdiClose" :color="notificationsOutline ? 'success' : 'white'" :outline="notificationsOutline" rounded-full small />
					</template>
				</NotificationBar>
			</div>
			<CardBoxModal v-model="modalConfirmPreferences" title="Molimo potvrdite vaš odabir" button-label="Potvrđujem" has-cancel @confirm="registerPreferences()">
				<p>Provjerite još jednom odabrane zadatke i njihov redoslijed:</p>
				<br />
				<p v-for="(assignment, index) in checkedAssignments" :key="assignment['id_zadatak']">
					<b>Odabir {{ index + 1 }}: </b>{{ assignment["id_zadatak"] }}
				</p>
				<br />
				<p class="mb-2"><b>Napomena:</b> {{ napomena || "Nema napomene." }}</p></CardBoxModal
			>
		</SectionMain>
	</component>
</template>

<style scoped>
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

.aspect-w-1 {
	transition: background-color 0.3s ease;
}

/* Only apply the hover effect if assignment is present */
.hover-bg-dark:hover {
	background-color: #4a5568; /* Darker gray for hover */
	transition: background-color 0.3s ease;
}

.assignment-id {
	position: absolute;
	bottom: 8px;
	left: 8px;
	background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
	color: white;
	font-size: 0.875rem; /* Tailwind's text-sm */
	padding: 4px 8px;
	border-radius: 4px;
}
</style>
