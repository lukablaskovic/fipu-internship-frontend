<script setup>
import Tooltip from "@/components/Base/Tooltip.vue";
import { computed, onBeforeUnmount, ref } from "vue";
import { Popover } from "reka-ui/namespaced";
import { useMainStore } from "@/stores/main_store";

import { mdiAccountCircle, mdiDomain, mdiLaptop, mdiCameraOutline } from "@mdi/js";
import UserAvatar from "@/components/User/UserAvatar.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import PillTagPlain from "@/components/PillTag/PillTagPlain.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import { StudentMappings } from "@/helpers/maps.js";

import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import { Student } from "@/services/baserow_client_api";

const mainStore = useMainStore();

const editing = ref(false);
const avatarUrl = ref("");
const avatarFile = ref(null);
const filePreview = ref("");
const dragging = ref(false);

function clearFile() {
	if (filePreview.value) URL.revokeObjectURL(filePreview.value);
	filePreview.value = "";
	avatarFile.value = null;
}
onBeforeUnmount(clearFile);

function selectFile(files) {
	dragging.value = false;
	if (saving.value || !files?.length) return;
	clearFile();
	avatarUrl.value = "";
	error.value = "";
	const file = files[0];
	if (files.length !== 1 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
		error.value = "Odaberite jednu JPG, PNG ili WebP sliku.";
		return;
	}
	if (!file.size || file.size > 2 * 1024 * 1024) {
		error.value = "Slika mora biti veća od 0 bajtova i manja ili jednaka 2 MB.";
		return;
	}
	avatarFile.value = file;
	filePreview.value = URL.createObjectURL(file);
}
const loadedAvatar = ref("");
const savedAvatar = ref(null);
const pendingAction = ref("");
const saving = computed(() => !!pendingAction.value);

const error = ref("");
const previewUrl = computed(() => {
	if (filePreview.value) return filePreview.value;
	try {
		const url = new URL(avatarUrl.value.trim());
		return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
	} catch {
		return "";
	}
});

const displayedAvatar = computed(() => (editing.value && previewUrl.value) || mainStore.currentUser.avatar);
const previewLoaded = computed(() => !!previewUrl.value && loadedAvatar.value === previewUrl.value);

function updateAvatarStatus(status) {
	loadedAvatar.value = status === "loaded" ? displayedAvatar.value : "";
	if (status === "error" && displayedAvatar.value) error.value = editing.value
		? "Sliku nije moguće učitati. Odaberite drugu sliku ili provjerite poveznicu."
		: "Slika je spremljena, ali je nije moguće prikazati.";
}

function editAvatar(open) {
	editing.value = open;
	clearFile();
	dragging.value = false;
	if (!open) return;
	avatarUrl.value = mainStore.currentUser.avatar || "";
	savedAvatar.value = null;
	error.value = "";
}

async function saveAvatar(remove = false) {
	if (saving.value || (remove ? !mainStore.currentUser.avatar : !previewLoaded.value)) return;
	pendingAction.value = remove ? "remove" : "save";
	error.value = "";
	try {
		const response = remove ? await Student.removeAvatar() : await Student.updateAvatar(avatarFile.value || previewUrl.value);
		if (remove ? response?.avatar !== "" : !response?.avatar) throw new Error("Missing saved avatar");
		mainStore.currentUser.avatar = response.avatar;
		savedAvatar.value = response.avatar;
		editAvatar(false);
	} catch (cause) {
		error.value = cause.response?.status === 401
			? "Prijava je istekla. Odjavite se i ponovno prijavite za promjenu slike."
			: cause.response?.status === 413
				? "Slika ne smije biti veća od 2 MB."
				: remove ? "Slika nije uklonjena. Pokušajte ponovno." : "Slika nije spremljena. Pokušajte ponovno.";
	} finally {
		pendingAction.value = "";
	}
}

const details = computed(() => [
	["Ime", mainStore.currentUser.ime],
	["Prezime", mainStore.currentUser.prezime],
	["E-mail", mainStore.currentUser.email],
	...(!mainStore.userAdmin ? [
		["JMBAG", mainStore.currentUser.JMBAG],
		["Godina studija", StudentMappings.getGodinaStudija(mainStore.currentUser.godina_studija)],
	] : []),
]);
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<h1 class="sr-only">Moj profil</h1>
			<CardBox class="rounded-lg">
				<div class="flex items-center gap-4">
					<div class="relative h-28 w-28 shrink-0">
						<Popover.Root :open="editing" @update:open="editAvatar">
							<Popover.Anchor as-child>
								<div class="h-full w-full">
									<UserAvatar :key="displayedAvatar" :avatar="displayedAvatar" :username="mainStore.currentUser.ime" referrer-policy="no-referrer" class="profile-avatar h-full w-full" @loading-status-change="updateAvatarStatus" />
								</div>
							</Popover.Anchor>
							<Tooltip content="Promijeni avatar">
								<Popover.Trigger as-child>
									<BaseButton
										:icon="mdiCameraOutline"
										:icon-size="22"
										color="fipu_blue"
										class="avatar-edit-button absolute bottom-0 right-0 h-11 w-14 border-0"
										aria-label="Promijeni avatar"
										:disabled="saving" />
								</Popover.Trigger>
							</Tooltip>
							<Popover.Portal>
								<Popover.Content
									aria-label="Promjena profilne slike"
									align="start"
									:side-offset="8"
									:collision-padding="16"
									class="reka-animated z-[10000] max-h-[var(--reka-popover-content-available-height)] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
									@escape-key-down="saving && $event.preventDefault()"
									@interact-outside="saving && $event.preventDefault()">
									<form id="avatar-editor" @submit.prevent="saveAvatar()" @dragover.prevent="!saving && (dragging = true)" @dragleave.prevent="dragging = false" @drop.prevent="selectFile($event.dataTransfer.files)">
										<FormField :error="error || (avatarUrl && !previewUrl ? 'Unesite valjanu HTTPS poveznicu.' : null)" label="Poveznica na sliku">
											<FormControl
												v-model="avatarUrl"
												type="url"
												maxlength="2048"
												:required="!avatarFile"
												:disabled="saving"
												placeholder="https://…"
												@update:model-value="
													clearFile();
													error = '';
												" />
										</FormField>
										<label class="mb-4 block cursor-pointer rounded-lg border-2 border-dashed p-4 text-center text-sm focus-within:ring-2 focus-within:ring-fipu_blue" :class="dragging ? 'border-fipu_blue bg-sky-50 dark:bg-slate-700' : 'border-gray-300 dark:border-slate-600'">
											<span class="block font-medium">Ili odaberite datoteku</span>
											<span id="avatar-file-help" class="mt-1 block text-xs text-gray-500 dark:text-gray-400">Povucite JPG, PNG ili WebP ovdje (do 2 MB)</span>
											<input type="file" class="sr-only" accept="image/jpeg,image/png,image/webp" aria-label="Odaberite profilnu sliku" aria-describedby="avatar-file-help" :disabled="saving" @change="selectFile($event.target.files); $event.target.value = ''" />
											<span v-if="avatarFile" class="mt-2 block break-all">{{ avatarFile.name }}</span>
										</label>
										<div class="flex items-center justify-center gap-2">
											<BaseButton type="submit" label="Spremi sliku" color="info" :loading="pendingAction === 'save'" :disabled="saving || !previewLoaded" />
											<BaseButton label="Odustani" :disabled="saving" @click="editAvatar(false)" />
										</div>
										<div v-if="mainStore.currentUser.avatar" class="mt-4 flex justify-center border-t border-gray-200 pt-3 dark:border-slate-700">
											<BaseButton type="button" label="Ukloni sliku" color="danger" outline small :loading="pendingAction === 'remove'" :disabled="saving" @click="saveAvatar(true)" />
										</div>
									</form>
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
					</div>
					<div class="min-w-0">
						<h2 class="break-words text-xl font-semibold">{{ mainStore.currentUser.ime }} {{ mainStore.currentUser.prezime }}</h2>
						<div class="mt-1 flex flex-wrap gap-2 text-sm text-fipu_gray dark:text-gray-300">
							<PillTagPlain :reverse-dark="true" :label="mainStore.userAdmin ? 'Admin' : 'Student'" :icon="mdiAccountCircle" />
							<PillTagPlain :reverse-dark="true" label="FIPU" :icon="mdiDomain" />
						</div>
					</div>
				</div>

				<p v-if="savedAvatar === ''" role="status" class="mt-3 text-sm">Profilna slika je uklonjena.</p>
				<p v-else-if="savedAvatar" role="status" class="mt-3 text-sm">
					{{ loadedAvatar === savedAvatar ? "Profilna slika je spremljena." : error || "Učitavanje spremljene slike…" }}
				</p>

				<dl class="my-5 grid grid-cols-1 gap-x-6 gap-y-4 border-y border-gray-100 py-5 dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-3">
					<div v-for="[label, value] in details" :key="label" class="min-w-0">
						<dt class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</dt>
						<dd class="mt-1 break-words font-medium">{{ value || "—" }}</dd>
					</div>
				</dl>

				<div v-if="!mainStore.userAdmin" class="flex flex-wrap gap-2">
					<BaseButton to="/moja-praksa" :icon="mdiLaptop" label="Moja praksa" small />
					<BaseButton to="/stanje-procesa" :icon="mdiLaptop" label="Stanje procesa" small />
				</div>
			</CardBox>
		</SectionMain>
	</LayoutAuthenticated>
</template>

<style scoped>
.profile-avatar,
.profile-avatar :deep(img),
.profile-avatar :deep([role="img"]) {
	border-radius: 1.5rem;
}

.avatar-edit-button {
	@apply text-fipu_gray;
	border-radius: 1rem 0 1.5rem 0;
}
</style>
