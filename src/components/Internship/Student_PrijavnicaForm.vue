<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import {
  mdiFileDocumentEdit,
  mdiLaptop,
  mdiBallot,
  mdiAccount,
  mdiMail,
  mdiCheck,
  mdiReload,
  mdiClipboardCheck,
  mdiCardAccountDetails,
} from "@mdi/js";

import SectionMain from "@/components/Section/SectionMain.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import { mainStore, studentStore } from "@/main.js";

import { buttonMenuOptions } from "@/sampleButtonMenuOptions.js";
import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadioGroup from "@/components/Form/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";

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

const selectFieldOptions = [
  { id: 1, label: "Business development" },
  { id: 2, label: "Marketing" },
  { id: 3, label: "Sales" },
];

const listBoxOptions = [
  { id: 1, label: "Howell Hand", unavailable: false },
  { id: 2, label: "Hope Howe", unavailable: false },
  { id: 3, label: "Nelson Jerde", unavailable: false },
  { id: 4, label: "Kim Weimann (disabled)", unavailable: true },
  { id: 5, label: "Lenna Smitham", unavailable: false },
];

const checkboxOptions = {
  alokacija_potvrda:
    "Nastavnik mi je odobrio i alocirao me na ovu tvrtku. Što se i vidi na Alokacije.",
  kontakt_potvrda:
    "Potvrđujem da sam kontaktirao poslodavca i dogovorio detalje koji su ovdje uneseni.",
};
const nacinIzvrsavanjeRadioOptions = {
  one: "On-site",
  two: "Remote",
  three: "Hybrid",
};

const form = reactive({
  ime: mainStore.currentUser.ime,
  prezime: mainStore.currentUser.prezime,
  name: "John Doe",
  OIB: "",
  email: mainStore.currentUser.email,
  poduzece:
    studentStore.student_process_instance_data.variables["poslodavac_naziv"],
  mentor_ime: "",
  mentor_prezime: "",
  mentor_email: studentStore.allocated_assignment["poslodavac_email"],
  detaljan_opis: "",
  dogovoreni_broj_sati: "",
  pass: "secret",
  phone: "",
  amount: 1024,
  ipv6: "fe80::/10",
  ipv4: "127.0.0.1",
  currency: "USD",
  department: selectFieldOptions[0],
  person: listBoxOptions[0],
  question: "Textarea",
  subject: "",
  checkboxOne: ["lorem"],
  checkboxTwo: ["lorem"],
  radioOne: "one",
  radioTwo: "one",
  switchOne: ["one"],
  switchTwo: ["one"],
  file: null,
});

const formLower = reactive({
  name: "John Doe",
  email: "john.doe@example.com",
  department: selectFieldOptions[0],
  person: listBoxOptions[0],
  question: "Error state",
});

const passShowHideClicked = ref(false);

const submit = () => {
  mainStore.pushMessage("Done! Demo only...", "contrast");
};

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
        :icon="mdiFileDocumentEdit"
        main
        title="Prijavnica"
      ></SectionTitleLineWithButton>
      <p>
        <b>Važno!</b> Prijavnica se popunjava nakon što nastavnik odobri kontakt
        određenom poduzeću i nakon što student s tim poduzećem dogovir praksu.
      </p>
      <p>Popunjenu prijavnicu šaljemo poduzeću na odobrenje i potpis.</p>
      <br />
      <hr />

      <div class="grid grid-cols-1 gap-6 mb-6 xl:grid-cols-4">
        <CardBox
          :icon="mdiBallot"
          class="mb-6 lg:mb-0 lg:col-span-2 xl:col-span-3"
          is-form
          @submit.prevent="submit"
        >
          <CardBoxComponentTitle title="Ispunite prijavnicu ovdje" />
          <FormField label="Ime i prezime" horizontal>
            <FormControl
              v-model="form.ime"
              :icon-left="mdiAccount"
              help="Vaše ime"
              placeholder="Vaše ime"
              required
            />
            <FormControl
              v-model="form.prezime"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              help="Vaše prezime"
              placeholder="Vaše prezime"
              required
            />
          </FormField>

          <FormField label="UNIPU email" horizontal>
            <FormControl
              v-model="form.email"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              type="email"
              help="Vaša UNIPU email adresa"
              placeholder="Email"
            />
          </FormField>

          <FormField
            label="Broj mobitela"
            help="Neće se trajno pohraniti. Samo za slučajeve brzog dogovora."
            horizontal
          >
            <FormField addons>
              <FormControl type="static" model-value="+385 (0)" first-addon />
              <FormControl
                v-model="form.phone"
                type="tel"
                placeholder="Vaš broj mobitela"
                expanded
                middle-addon
              />
              <FormControl type="static" model-value="HR" last-addon />
            </FormField>
          </FormField>

          <FormField label="OIB" horizontal>
            <FormControl
              v-model="form.OIB"
              :icon-left="mdiCardAccountDetails"
              :icon-right="mdiCheck"
              type="number"
              help="Za potrebe prijave osiguranja"
              placeholder="OIB"
            />
          </FormField>

          <FormField label="Poduzeće" horizontal>
            <FormControl
              v-model="form.poduzece"
              :icon-left="mdiCardAccountDetails"
              :icon-right="mdiCheck"
              readonly
              help="Odabrano poduzeće"
              placeholder="Odabrano poduzeće"
            />
          </FormField>

          <FormField label="Ime i prezime mentora" horizontal>
            <FormControl
              v-model="form.mentor_ime"
              :icon-left="mdiAccount"
              help="Ime mentora"
              placeholder="Ime mentora"
            />
            <FormControl
              v-model="form.mentor_prezime"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              help="Prezime mentora"
              placeholder="Prezime mentora"
            />
          </FormField>

          <FormField label="Email mentora" horizontal>
            <FormControl
              v-model="form.mentor_email"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              type="email"
              help="Email vašeg mentora"
              placeholder="Email mentora"
            />
          </FormField>

          <FormField label="Detaljan opis zadatka" horizontal>
            <FormControl
              v-model="form.detaljan_opis"
              type="textarea"
              placeholder="Detaljno opišite zadatak koji će se izvršavati na praksi."
            />
          </FormField>

          <FormField
            label="Dogovoreni broj sati"
            help="Mora biti u rasopnu od 90 do 150 sati."
            horizontal
          >
            <FormField addons>
              <FormControl type="static" model-value="Sati" first-addon />
              <FormControl
                v-model="form.dogovoreni_broj_sati"
                type="number"
                placeholder="Dogovoreni broj sati"
                expanded
                middle-addon
              />
              <FormControl type="static" model-value="[90 - 150]" last-addon />
            </FormField>
          </FormField>

          <FormField label="Datum početka" horizontal>
            <FormControl type="date" />
          </FormField>

          <FormField label="Datum završetka" horizontal>
            <FormControl type="date" />
          </FormField>

          <BaseDivider />

          <BaseDivider />

          <FormField label="Praksu ću izvršavati" horizontal>
            <FormCheckRadioGroup
              v-model="form.radioTwo"
              name="sample-radio-two"
              type="radio"
              :options="nacinIzvrsavanjeRadioOptions"
              is-column
            />
          </FormField>

          <BaseDivider />

          <FormField label="Potvrde" horizontal>
            <FormCheckRadioGroup
              v-model="form.checkboxTwo"
              name="sample-checkbox-two"
              :options="checkboxOptions"
              is-column
            />
          </FormField>

          <BaseDivider />

          <!--
          <template #footer>
            <FormField horizontal grouped>
              <BaseButton label="Submit" type="submit" color="info" />
              <ButtonMenu
                :options="buttonMenuOptions"
                label="Options"
                color="info"
                outline
                left
              />
            </FormField>
          </template>
          -->
        </CardBox>
      </div>
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheck"
        main
        title="Alocirani zadatak"
      ></SectionTitleLineWithButton>
      <CardboxAllocation
        v-if="allocated_assignment != null"
        :data="allocated_assignment"
      ></CardboxAllocation>
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
