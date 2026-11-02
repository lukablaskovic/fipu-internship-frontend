<script setup>
import { computed } from "vue";
import { mdiCancel } from "@mdi/js";
import { useStudentStore } from "@/stores/student_store";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

const studentStore = useStudentStore();
const state = computed(() => studentStore.student_process_instance_data.state);
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiCancel" title="Odustajanje od prakse" main />
			<template v-if="state === 'cancelled'">
				<p>Odustali ste od prakse. Ovaj proces je završen i nema daljnjih zadataka.</p>
				<p class="mt-3">Podaci i povijest prakse ostaju sačuvani.</p>
				<RouterLink to="/odabir-procesa" class="mt-4 inline-block font-semibold text-fipu_blue underline">Odaberi novu praksu</RouterLink>
			</template>
			<p v-else-if="state === 'failed'" role="alert">Evidentiranje odustajanja nije uspjelo. Proces je zaustavljen. Pokušajte ponovno pomoću gumba iznad ili se obratite voditelju prakse.</p>
			<p v-else role="status">Odustajanje se evidentira…</p>
		</SectionMain>
	</LayoutAuthenticated>
</template>
