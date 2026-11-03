<script setup>
import InternshipPageHeader from "@/components/Internship/InternshipPageHeader.vue";
import StudentWithdrawAction from "@/components/Internship/StudentWithdrawAction.vue";
import { computed, ref, watch } from "vue";
import { mdiAlphaSBox, mdiCheckDecagram, mdiClipboardCheck } from "@mdi/js";
import { Student } from "@/services/baserow_client_api";
import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const process = computed(() => studentStore.student_process_instance_data);
const finished = computed(() => process.value.state === "finished");
const assignmentId = computed(() => {
	const value = process.value.variables?.Alocirani_zadatak;
	return Array.isArray(value) ? value[0] : value;
});
const assignment = computed(() => studentStore.allocated_assignment?.id_zadatak === assignmentId.value ? studentStore.allocated_assignment : null);

watch(assignmentId, async (id) => {
	if (!id || assignment.value) return;
	const response = await studentStore.getAssignmentDetails(id);
	if (assignmentId.value === id) studentStore.allocated_assignment = response?.data?.results?.find(row => row.id_zadatak === id) ?? null;
}, { immediate: true });

const diaryId = computed(() => process.value.variables?.id_dnevnik_prakse);
const diary = ref();
const documents = {
	ispunjena_potvrda_upload: "Preuzmi potvrdu o obavljenoj praksi",
	dnevnik_prakse_upload: "Preuzmi dnevnik prakse",
};

async function loadDiary(id) {
	diary.value = undefined;
	const result = id ? await Student.fetchPDF(id) : null;
	if (diaryId.value === id) diary.value = result?.data?.results?.[0] ?? null;
}
watch(diaryId, loadDiary, { immediate: true });
</script>

<template>
	<component :is="mainStore.userAuthenticated ? LayoutAuthenticated : LayoutGuest">
		<SectionMain class="relative">
			<InternshipPageHeader />

			<img :src="finished ? '/illustrations/success.svg' : '/illustrations/finish.svg'" alt="" class="absolute right-0 top-0 mr-6 mt-4 hidden max-w-full md:block" :class="finished ? 'w-1/5' : 'w-1/6'" />
			<SectionTitleLineWithButton class="mt-4" :icon="finished ? mdiCheckDecagram : mdiAlphaSBox" :title="finished ? 'Praksa gotova!' : 'Ocjenjivanje u tijeku'" main />
			<template v-if="finished">
				<p>Vaš proces prakse je završio. Profesor je potvrdio unos ocjene u Studomat.</p>
				<p class="mt-4">Nadamo se da vam je kolegij bio od koristi i da ste puno toga naučili! Sretno u daljnjem studiranju! 🎓</p>
			</template>
			<template v-else>
				<p>Vaš proces prakse je završio. Nakon što vam profesor pregleda potvrdu i odobri dnevnik prakse, ocjena će vam biti unesena u Studomat.</p>
				<p>Ako čekate više od 7 dana, molimo vas da se obratite voditelju prakse.</p>
			</template>

			<div class="my-4">
				<p v-if="diary === undefined" role="status">Učitavanje dokumenata…</p>
				<p v-else-if="!diary">
					Dokumenti nisu dostupni.
					<button v-if="diaryId" type="button" class="text-fipu_blue underline" @click="loadDiary(diaryId)">Pokušaj ponovno</button>
				</p>
				<template v-else>
					<p v-for="(label, field) in documents" :key="field">
						<a v-if="diary[field]?.[0]?.url" :href="diary[field][0].url" target="_blank" rel="noopener" class="text-fipu_blue underline">{{ label }}</a>
						<span v-else>{{ label }} – dokument nije dostupan.</span>
					</p>
				</template>
			</div>
			<hr />
			<SectionTitleLineWithButton class="mt-4" :icon="mdiClipboardCheck" main title="Odrađeni zadatak" />
			<CardBoxAllocation v-if="assignment" :key="assignment.id_zadatak" :data="assignment" />
			<p v-else>{{ assignmentId }}</p>
			<StudentWithdrawAction />
		</SectionMain>
	</component>
</template>
