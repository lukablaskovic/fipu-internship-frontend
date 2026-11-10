<script setup>
import { onMounted, ref } from "vue";
import { mdiSecurity } from "@mdi/js";
import { Admin } from "@/services/baserow_client_api";
import { useMainStore } from "@/stores/main_store";
import { useSnackBarStore } from "@/stores/snackbar_store";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon, PlusIcon } from "@lucide/vue";

const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();
const emails = ref();
const newEmail = ref("");
const removingEmail = ref("");
const confirmingRemoval = ref(false);
const saving = ref(false);
const error = ref("");

async function saveAdministrator(remove = false) {
	if (saving.value || !mainStore.canViewAdministrators) return;
	const email = (remove ? removingEmail.value : newEmail.value).trim().toLowerCase();
	error.value = "";
	if (!remove && (!/^[^\s@]+@(unipu\.hr|student\.unipu\.hr|fipu\.hr)$/.test(email))) {
		error.value = "Unesite institucionalnu e-mail adresu (@unipu.hr, @student.unipu.hr ili @fipu.hr).";
		return;
	}
	saving.value = true;
	try {
		emails.value = remove ? await Admin.removeAdministrator(email) : await Admin.addAdministrator(email);
		if (!remove) newEmail.value = "";
		snackBarStore.pushMessage(remove ? "Administratorski pristup je uklonjen." : "Administratorski pristup je dodan.", "success");
	} catch (failure) {
		error.value = failure.response?.status === 403
			? "Samo superadmin može upravljati administratorima. Superadmina nije moguće ukloniti."
			: failure.response?.status === 400
				? "Unesite valjanu institucionalnu e-mail adresu."
				: "Promjena nije potvrđena. Osvježite popis prije ponovnog pokušaja.";
	} finally {
		saving.value = false;
	}
}

function confirmRemoval(email) {
	removingEmail.value = email;
	confirmingRemoval.value = true;
}

onMounted(async () => { emails.value = await Admin.listAdministrators(); });
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiSecurity" title="Administratori" main />

			<p v-if="error" role="alert" class="mb-4 text-red-600 dark:text-red-400">{{ error }}</p>
			<p v-if="emails === undefined" role="status">Učitavanje administratora…</p>
			<p v-else-if="emails === null" role="alert">Dohvat administratora nije uspio.</p>
			<p v-else-if="!emails.length">Nema administratora.</p>
			<CardBox v-else has-table>
				<table aria-label="Administratori">
					<thead><tr><th scope="col">E-mail</th><th scope="col">Pristup</th></tr></thead>
					<tbody>
						<tr v-for="email in emails" :key="email">
							<td data-label="E-mail" class="break-all">{{ email }}</td>
							<td data-label="Pristup">
								<span v-if="email === 'lblaskovi@unipu.hr'">Superadmin</span>
								<BaseButton v-else-if="mainStore.canViewAdministrators" label="Ukloni" color="danger" outline :aria-label="`Ukloni administratora ${email}`" :disabled="saving" @click="confirmRemoval(email)" />
							</td>
						</tr>
					</tbody>
				</table>
			</CardBox>
			<CardBox v-if="mainStore.canViewAdministrators" class="mt-6 rounded-xl border border-slate-200 dark:border-slate-700">
				<section aria-labelledby="add-administrator-title">
					<h2 id="add-administrator-title" class="mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">Dodaj administratora</h2>
					<form class="max-w-3xl space-y-3" :aria-busy="saving" @submit.prevent="saveAdministrator()">
						<Label for="administrator-email" class="text-slate-700 dark:text-slate-200">E-mail novog administratora</Label>
						<div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
							<Input id="administrator-email" v-model="newEmail" type="email" name="administrator-email" autocomplete="off" placeholder="ime.prezime@unipu.hr" aria-describedby="administrator-email-help" required :disabled="saving" class="h-11 bg-white px-3 dark:bg-slate-900" />
							<Button type="submit" class="h-11 gap-2 bg-fipu_blue px-4 text-slate-950 hover:bg-fipu_light_blue focus-visible:border-fipu_blue focus-visible:ring-fipu_blue/40" :disabled="saving || !Array.isArray(emails) || !newEmail.trim()">
								<LoaderCircleIcon v-if="saving" class="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
								<PlusIcon v-else class="size-4" aria-hidden="true" />
								Dodaj administratora
							</Button>
						</div>
						<p id="administrator-email-help" class="text-sm leading-6 text-slate-600 dark:text-slate-400">Administrator se prijavljuje svojim Google računom. Novi pristup vidljiv je nakon ponovne prijave.</p>
					</form>
				</section>
			</CardBox>
		</SectionMain>
		<CardBoxModal v-model="confirmingRemoval" title="Ukloniti administratora?" button="danger" button-label="Ukloni pristup" has-cancel :disabled-condition="saving" @confirm="saveAdministrator(true)">
			<p>Račun <strong class="break-all">{{ removingEmail }}</strong> izgubit će administratorski pristup. Profil i postojeći podaci ostaju sačuvani.</p>
		</CardBoxModal>
	</LayoutAuthenticated>
</template>
