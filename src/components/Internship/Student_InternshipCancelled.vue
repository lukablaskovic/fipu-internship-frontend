<script setup>
import StudentWithdrawAction from "@/components/Internship/StudentWithdrawAction.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import { useStudentStore } from "@/stores/student_store";
import { mdiCancel } from "@mdi/js";
import { computed } from "vue";

const studentStore = useStudentStore();
const state = computed(() => studentStore.student_process_instance_data.state);
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiCancel" title="Odustajanje od prakse" main />
			<template v-if="state === 'cancelled'">
				<p>Odustali ste od prakse. Ovaj proces je završen i nema daljnjih zadataka.</p>
				<BaseButton to="/odabir-procesa" label="Započni novi proces prakse" color="info" class="mt-4" />
			</template>
			<p v-else-if="state === 'failed'" role="alert">Evidentiranje odustajanja nije uspjelo. Proces je zaustavljen. Pokušajte ponovno pomoću gumba za ponovno evidentiranje ili se obratite voditelju prakse.</p>
			<p v-else role="status">Odustajanje se evidentira…</p>
			<StudentWithdrawAction />
		</SectionMain>
	</LayoutAuthenticated>
</template>
2
