<script setup>
import { ref, onMounted } from "vue";
import { mdiAccountTie, mdiAccount, mdiClipboardCheck } from "@mdi/js";
import Utils from "@/helpers/utils.js";
import { useRoute } from "vue-router";
import { router } from "@/router";

import { adminStore, studentStore, snackBarStore } from "@/main.js";
import { StudentMappings } from "@/helpers/maps";
import { UserTaskMappings } from "@/helpers/maps";

import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import FooterBar from "@/components/FooterBar.vue";
import FormDynamic from "@/components/Form/FormDynamic.vue";
import SnackBar from "@/components/Premium/SnackBar.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const process_instance_id = ref(null);

const assignemntDetails = ref(null);
const instanceInfo = ref(null);
const pendingTaskInfo = ref(null);
const route = useRoute();

let assignment = ref(null);
let studentInfo = ref(null);

onMounted(async () => {
  process_instance_id.value = route.params.process_instance_id;

  instanceInfo.value = await studentStore.getInstanceInfo(
    process_instance_id.value
  );

  assignemntDetails.value = await studentStore.getAssignmentDetails(
    instanceInfo.value.variables["Alocirani_zadatak"]
  );
  assignment.value = assignemntDetails.value.data.results[0];
  console.log(instanceInfo.value);

  pendingTaskInfo.value = await adminStore.getTaskInfo(
    process_instance_id.value,
    instanceInfo.value.pending[0]
  );
  console.log("pendingTaskInfo", pendingTaskInfo.value);
  studentInfo.value = {
    student_ime: instanceInfo.value.variables["student_ime"],
    student_prezime: instanceInfo.value.variables["student_prezime"],
    student_email: instanceInfo.value.variables["student_email"],
    student_godina_studija:
      instanceInfo.value.variables["student_godina_studija"],
  };
});
const formDynamicValues = ref({});
const isLoading = ref(false);

async function handleNewInstance() {
  isLoading.value = true;

  adminStore.handleNewInstance(
    process_instance_id.value,
    instanceInfo.value.pending[0],
    formDynamicValues.value
  );

  if (
    UserTaskMappings.getTaskProperty(
      instanceInfo.value.pending[0],
      "snackbar_msg"
    )
  ) {
    snackBarStore.pushMessage(
      UserTaskMappings.getTaskProperty(
        instanceInfo.value.pending[0],
        "snackbar_msg"
      ),
      UserTaskMappings.getTaskProperty(
        instanceInfo.value.pending[0],
        "snackbar_color"
      )
    );
  }
  await Utils.wait(2);
  isLoading.value = false;

  router.push("/");
}
const disabledCondition = ref(true);

const updateDisabledCondition = (allFilled) => {
  disabledCondition.value = !allFilled;
};
</script>

<template>
  <div>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAccountTie"
        title="Evaluacija kandidata"
        main
      >
        <a href="" target="_blank">
          <img
            :src="FIPU_praksa_logo_transparent"
            class="max-h-14 object-contain"
          /> </a
      ></SectionTitleLineWithButton>

      <p class="mb-4">
        Molimo da nakon što evaluirate studenta (bilo to kroz intervju, tehnički
        ispit ili pak bez procesa selekcije) potvrdite prihvaćate li studenta za
        obavljanje prakse u Vašem poduzeću.
      </p>

      <FormDynamic
        v-if="pendingTaskInfo != null"
        v-model="formDynamicValues"
        class="mb-4"
        :form-fields="pendingTaskInfo.form_fields"
        :variables="instanceInfo.variables"
        :documentation="pendingTaskInfo.documentation"
        @all-fields-filled="updateDisabledCondition"
      />

      <BaseButton
        class="mb-4"
        label="Potvrdi"
        :loading="isLoading"
        color="fipu_blue"
        @disabled="disabledCondition"
        @click="handleNewInstance()"
      />

      <SectionTitleLineWithButton :icon="mdiAccount" title="Student" main>
      </SectionTitleLineWithButton>

      <div
        v-if="instanceInfo != null"
        class="sm:flex sm:justify-between sm:gap-4"
      >
        <div class="mb-4">
          <h1 class="text-lg font-bold sm:text-2xl">
            {{ studentInfo.student_ime }} {{ studentInfo.student_prezime }}
          </h1>
          <h3 class="text-base font-bold">
            {{ studentInfo.student_email }}
          </h3>

          <p class="mt-1 text-small font-medium text-gray-600">
            {{
              StudentMappings.getGodinaStudija(
                studentInfo.student_godina_studija
              )
            }}
          </p>
        </div>
      </div>

      <SectionTitleLineWithButton
        :icon="mdiClipboardCheck"
        title="Alocirani zadatak"
        main
      >
      </SectionTitleLineWithButton>
      <CardBoxAllocation
        v-if="assignment != null"
        :data="assignment"
      ></CardBoxAllocation>
    </SectionMain>
    <FooterBar
      ><br />Made with <span style="color: #e25555">&#9829;</span> at
      FIPU.lab</FooterBar
    >
    <SnackBar />
  </div>
</template>
