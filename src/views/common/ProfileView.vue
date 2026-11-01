<script setup>
import { computed, ref } from "vue";
import { Popover } from "reka-ui/namespaced";
import { mainStore } from "@/main.js";
import { mdiAccountCircle, mdiDomain, mdiLaptop, mdiCameraOutline } from "@mdi/js";
import UserAvatarCurrentUser from "@/components/User/UserAvatarCurrentUser.vue";
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

const editing = ref(false);
const avatarUrl = ref("");
const previewLoaded = ref(false);
const saving = ref(false);
const message = ref("");
const error = ref("");
const previewUrl = computed(() => {
	try {
		const url = new URL(avatarUrl.value.trim());
		return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
	} catch {
		return "";
	}
});

function updatePreviewStatus(status) {
	previewLoaded.value = status === "loaded";
	if (status === "error") error.value = "Sliku nije moguće učitati. Provjerite poveznicu.";
}

function editAvatar(open) {
	editing.value = open;
	if (!open) return;
	avatarUrl.value = mainStore.currentUser.avatar || "";
	previewLoaded.value = false;
	message.value = "";
	error.value = "";
}

async function saveAvatar() {
	if (!previewUrl.value || !previewLoaded.value || saving.value) return;
	saving.value = true;
	error.value = "";
	try {
		const response = await Student.updateAvatar(previewUrl.value, mainStore.currentUser.email);
		mainStore.currentUser.avatar = response.avatar;
		editing.value = false;
		message.value = "Profilna slika je spremljena.";
	} catch (cause) {
		error.value = cause.response?.status === 401
			? "Prijava je istekla. Odjavite se i ponovno prijavite za promjenu slike."
			: "Slika nije spremljena. Pokušajte ponovno.";
	} finally {
		saving.value = false;
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
						<UserAvatarCurrentUser class="profile-avatar h-full w-full" />
						<Popover.Root :open="editing" @update:open="editAvatar">
							<Popover.Trigger as-child>
								<BaseButton
									:icon="mdiCameraOutline"
									:icon-size="22"
									color="fipu_blue"
									class="avatar-edit-button absolute bottom-0 right-0 h-11 w-14 border-0"
									aria-label="Promijeni avatar"
									title="Promijeni avatar"
									:disabled="saving" />
							</Popover.Trigger>
							<Popover.Portal>
								<Popover.Content
									align="start"
									:side-offset="8"
									:collision-padding="16"
									class="reka-animated z-[10000] max-h-[var(--reka-popover-content-available-height)] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
									@escape-key-down="saving && $event.preventDefault()"
									@interact-outside="saving && $event.preventDefault()">
									<form id="avatar-editor" @submit.prevent="saveAvatar">
										<FormField :error="error || (avatarUrl && !previewUrl ? 'Unesite valjanu HTTPS poveznicu.' : null)" label="URL profilne slike" help="Unesite javno dostupnu HTTPS poveznicu na sliku.">
											<FormControl
												v-model="avatarUrl"
												type="url"
												maxlength="2048"
												required
												:disabled="saving"
												placeholder="https://…"
												@update:model-value="
													previewLoaded = false;
													error = '';
												" />
										</FormField>
										<UserAvatar v-if="previewUrl" :key="previewUrl" :avatar="previewUrl" username="Pregled nove profilne slike" referrer-policy="no-referrer" class="mb-3 h-16 w-16" @loading-status-change="updatePreviewStatus" />
										<div class="flex gap-2">
											<BaseButton type="submit" label="Spremi sliku" color="info" small :loading="saving" :disabled="!previewLoaded || !previewUrl" />
											<BaseButton label="Odustani" small :disabled="saving" @click="editing = false" />
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

				<p v-if="message" role="status" class="mt-3 text-sm text-green-700 dark:text-green-400">{{ message }}</p>

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
