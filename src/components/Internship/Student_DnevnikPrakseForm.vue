<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { mdiLaptop, mdiBallot, mdiNotebook, mdiClipboardCheck } from "@mdi/js";

import SectionMain from "@/components/Section/SectionMain.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import { mainStore, snackBarStore, studentStore } from "@/main.js";

import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadioGroup from "@/components/Form/FormCheckRadioGroup.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";

const allocated_assignment = ref(null);

onMounted(async () => {
  await studentStore.getInstanceInfo(
    mainStore.currentUser.internship_process.id
  );

  if (studentStore.allocated_assignment == null) {
    let result = await studentStore.getAssignmentDetails(
      studentStore.student_process_instance_data.variables["Alocirani_zadatak"]
    );
    studentStore.allocated_assignment = result.data.results[0];

    allocated_assignment.value = result.data.results[0];
    console.log(allocated_assignment);
  } else {
    allocated_assignment.value = studentStore.allocated_assignment;
    console.log("allocated_assignment.value", allocated_assignment.value);
  }
});

const Layout = computed(() => {
  if (userAuthenticated.value) {
    return LayoutAuthenticated;
  } else {
    return LayoutGuest;
  }
});

const userAuthenticated = computed(() => mainStore.userAuthenticated);

///////////////////////////////////////////////////////////////////////////////

//ispunjavanje_prijavnice_student
const form = reactive({
  potvrda_attachment: null,
  dnevnik_attachment: null,
  nastavak_radnog_odnosa: null,
  prijavljen_rok: null,
});

async function submit_diary_form() {
  console.log(form);
  await studentStore.submitDiaryForm(form);
}

const formErrorHasError = ref(false);

const formErrorSubmit = () => {
  formErrorHasError.value = true;

  setTimeout(() => {
    formErrorHasError.value = false;
  }, 2000);
};

//////////////////////////////////////////////////////////////////////
</script>

<template>
  <component :is="Layout">
    <SectionMain v-if="allocated_assignment != null">
      <SectionTitleLineWithButton :icon="mdiLaptop" title="Moja praksa" main>
      </SectionTitleLineWithButton>
      <p><b>Akademska godina:</b> 2023/2024</p>
      <p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheck"
        main
        title="Izvođenje prakse u tijeku"
      ></SectionTitleLineWithButton>
      <CardboxAllocation
        v-if="allocated_assignment != null"
        :data="allocated_assignment"
      ></CardboxAllocation>

      <br />
      <hr />

      <br />
      <SectionTitleLineWithButton
        :icon="mdiNotebook"
        main
        title="Dnevnik prakse"
      ></SectionTitleLineWithButton>
      <p>
        Nakon što se završili praksu i ispunili sve vaše obaveze, predajete
        dnevnik prakse skupa s ispunjenom potvrdom o obavljenoj praksi.
      </p>
      <p>
        Potvrdu ispunjava vaš mentor, vi predajete PDF sken ispunjene potvrde.
      </p>
      <p>Dnevnik prakse je potrebno predati prije prijave ispitnog roka.</p>
      <br />
      <p>
        📓Template za dnevnik prakse možete preuzeti
        <a
          href="https://bit.ly/fipu-praksa-template"
          target="_blank"
          class="text-fipu_blue cursor-pointer"
          >ovdje</a
        >.
      </p>
      <br />
      <hr />

      <div class="grid grid-cols-1 gap-6 mb-6">
        <CardBox
          :icon="mdiBallot"
          class="mb-6 lg:mb-0 lg:col-span-2 xl:col-span-3"
          is-form
          @submit.prevent="submit_diary_form"
        >
          <CardBoxComponentTitle title="📓 Dnevnik prakse" />

          <FormField
            label="PDF dnevnika prakse"
            help="obavezno PDF format"
            horizontal
          >
            <FormFilePicker v-model="form.dnevnik_attachment" label="Prenesi" />
          </FormField>

          <FormField
            label="PDF sken ispunjene potvrde o obavljenoj praksi"
            help="Dostaviti voditelju prakse ili tajnici u fizičkom obliku"
            horizontal
          >
            <FormFilePicker v-model="form.potvrda_attachment" label="Prenesi" />
          </FormField>

          <BaseDivider />

          <FormField label="Datum ispitnog roka" horizontal>
            <FormControl v-model="form.prijavljen_rok" type="date" required />
          </FormField>

          <FormField horizontal>
            <FormCheckRadio
              v-model="form.nastavak_radnog_odnosa"
              name="sample-checkbox-two"
              :options="checkboxOptions"
              label="Označi ako nastavljaš i dalje raditi u tvrtci ili ćeš ubrzo početi raditi honorarno."
              is-column
              required
            />
          </FormField>

          <BaseDivider />

          <FormField horizontal grouped>
            <BaseButton label="Predaj" type="submit" color="fipu_blue" />
          </FormField>
        </CardBox>
      </div>
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
