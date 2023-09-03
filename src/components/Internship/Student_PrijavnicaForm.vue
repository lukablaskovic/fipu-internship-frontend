<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import {
  mdiFileDocumentEdit,
  mdiLaptop,
  mdiBallot,
  mdiAccount,
  mdiMail,
  mdiCheck,
  mdiClipboardCheck,
  mdiCardAccountDetails,
} from "@mdi/js";

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

const nacinIzvrsavanjeRadioOptions = {
  on_site: "on-site",
  remote: "remote",
  hybrid: "hybrid",
};

//ispunjavanje_prijavnice_student
const form = reactive({
  student_ime: mainStore.currentUser.ime,
  student_prezime: mainStore.currentUser.prezime,
  student_broj_mobitela: "",
  student_OIB: "",
  student_email: mainStore.currentUser.email,
  mentor_ime: "",
  mentor_prezime: "",
  mentor_email: studentStore.allocated_assignment["poslodavac_email"],
  detaljan_opis_zadatka: "",
  dogovoreni_broj_sati: null,
  pocetak_prakse: "",
  kraj_prakse: "",
  alokacija_potvrda: false,
  kontakt_potvrda: false,
  Poslodavac:
    studentStore.student_process_instance_data.variables["poslodavac_naziv"],
  mjesto_izvrsavanja: nacinIzvrsavanjeRadioOptions[0],
});

async function submit_application_form() {
  console.log(form);
  await studentStore.submitApplicationForm(form);
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
        title="Alocirani zadatak"
      ></SectionTitleLineWithButton>
      <CardboxAllocation
        v-if="allocated_assignment != null"
        :data="allocated_assignment"
      ></CardboxAllocation>

      <br />
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
      <p>
        Ispod možete pronaći prijavnicu za praksu. Neki podaci su već u sustavu
        te su samim time ispisani. Ostale podatke treba popuniti.
      </p>
      <p>Popunjenu prijavnicu šaljemo poduzeću na odobrenje i potpis.</p>
      <br />
      <hr />

      <div class="grid grid-cols-1 gap-6 mb-6">
        <CardBox
          :icon="mdiBallot"
          class="mb-6 lg:mb-0 lg:col-span-2 xl:col-span-3"
          is-form
          @submit.prevent="submit_application_form"
        >
          <CardBoxComponentTitle title="📃Prijavnica na praksu" />
          <FormField label="Ime i prezime" horizontal>
            <FormControl
              v-model="form.student_ime"
              :icon-left="mdiAccount"
              help="Vaše ime"
              placeholder="Vaše ime"
              required
            />
            <FormControl
              v-model="form.student_prezime"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              help="Vaše prezime"
              placeholder="Vaše prezime"
              required
            />
          </FormField>

          <FormField label="UNIPU email" horizontal>
            <FormControl
              v-model="form.student_email"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              type="email"
              help="Vaša UNIPU email adresa"
              placeholder="Email"
              required
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
                v-model="form.student_broj_mobitela"
                type="tel"
                placeholder="Vaš broj mobitela"
                expanded
                middle-addon
                required
              />
              <FormControl type="static" model-value="HR" last-addon />
            </FormField>
          </FormField>

          <FormField label="OIB" horizontal>
            <FormControl
              v-model="form.student_OIB"
              :icon-left="mdiCardAccountDetails"
              :icon-right="mdiCheck"
              type="number"
              help="Za potrebe prijave osiguranja"
              placeholder="OIB"
              required
            />
          </FormField>

          <BaseDivider />

          <FormField label="Poduzeće" horizontal>
            <FormControl
              v-model="form.Poslodavac"
              :icon-left="mdiCardAccountDetails"
              :icon-right="mdiCheck"
              readonly
              help="Odabrano poduzeće"
              placeholder="Odabrano poduzeće"
              required
            />
          </FormField>

          <FormField label="Ime i prezime mentora" horizontal>
            <FormControl
              v-model="form.mentor_ime"
              :icon-left="mdiAccount"
              help="Ime mentora"
              placeholder="Ime mentora"
              required
            />
            <FormControl
              v-model="form.mentor_prezime"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              help="Prezime mentora"
              placeholder="Prezime mentora"
              required
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
              required
            />
          </FormField>
          <BaseDivider />
          <FormField label="Detaljan opis zadatka" horizontal>
            <FormControl
              v-model="form.detaljan_opis_zadatka"
              type="textarea"
              placeholder="Detaljno opišite zadatak koji će se izvršavati na praksi."
              required
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
                required
              />
              <FormControl type="static" model-value="[90 - 150]" last-addon />
            </FormField>
          </FormField>

          <FormField label="Datum početka" horizontal>
            <FormControl v-model="form.pocetak_prakse" type="date" required />
          </FormField>

          <FormField label="Datum završetka" horizontal>
            <FormControl v-model="form.kraj_prakse" type="date" required />
          </FormField>

          <BaseDivider />

          <FormField label="Praksu ću izvršavati" horizontal>
            <FormCheckRadioGroup
              v-model="form.mjesto_izvrsavanja"
              name="sample-radio-two"
              type="radio"
              :options="nacinIzvrsavanjeRadioOptions"
              is-column
            />
          </FormField>

          <BaseDivider />

          <FormField label="Potvrde" horizontal>
            <FormCheckRadio
              v-model="form.alokacija_potvrda"
              name="sample-checkbox-two"
              :options="checkboxOptions"
              label="Nastavnik mi je odobrio i alocirao me na ovu tvrtku. Što se i vidi na Alokacije."
              is-column
              required
            />
          </FormField>
          <FormField horizontal>
            <FormCheckRadio
              v-model="form.kontakt_potvrda"
              name="sample-checkbox-two"
              :options="checkboxOptions"
              label="Potvrđujem da sam kontaktirao poslodavca i dogovorio detalje koji su ovdje uneseni."
              is-column
              required
            />
          </FormField>
          <BaseDivider />

          <FormField horizontal grouped>
            <BaseButton label="Pošalji" type="submit" color="fipu_blue" />
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
