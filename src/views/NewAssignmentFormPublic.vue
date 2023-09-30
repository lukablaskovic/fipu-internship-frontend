<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  mdiBallot,
  mdiEmail,
  mdiClipboardCheck,
  mdiLaptop,
  mdiDomain,
  mdiMapMarker,
  mdiClipboardTextClockOutline,
  mdiAccountGroup,
  mdiSchool,
  mdiTextLong,
  mdiXml,
  mdiThumbsUpDown,
  mdiClockTimeFiveOutline,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import FooterBar from "@/components/FooterBar.vue";
import SnackBar from "@/components/Premium/SnackBar.vue";
import BaseButton from "@/components/Base/BaseButton.vue";

import CardBox from "@/components/Cardbox/CardBox.vue";

import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import FormCombobox from "@/components/Form/FormCombobox.vue";
import FormCheckRadioGroup from "@/components/Form/FormCheckRadioGroup.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";

import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { getFirstErrorForField, isUnipuEmail } from "@/helpers/validators";

import Utils from "@/helpers/utils";

import { mainStore, snackBarStore } from "@/main.js";

const form = reactive({
  Poslodavac: "",
  Poslodavac_novi_naziv: "",
  poslodavac_email: "",
  opis_zadatka: "",
  preferirane_tehnologije: "",
  broj_studenata: "",
  preferencije_za_studenta: "",
  potrebno_imati: "",
  trajanje_sati: "",
  lokacija: "",
  zeljeno_okvirno_vrijeme_pocetka: "",
  angazman_selekcija: false,
  angazman_fipu: "",
  napomena: "",
  selekcija: false,
  proces_selekcije: "",
});
const greaterThanZero = (value) => value > 0;

const rules = {
  Poslodavac: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
  Poslodavac_novi_naziv: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
  poslodavac_email: {
    required: helpers.withMessage("Polje je obavezno", required),
    email: helpers.withMessage("Molimo unesite ispravnu e-mail adresu", email),
  },
  opis_zadatka: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
  preferirane_tehnologije: {},
  broj_studenata: {
    required: helpers.withMessage("Polje je obavezno", required),
    maxValue: helpers.withMessage("Minimalno 1 student", greaterThanZero),
  },
  preferencije_za_studenta: {},
  potrebno_imati: {},
  trajanje_sati: {
    required: helpers.withMessage("Polje je obavezno", required),
    maxValue: helpers.withMessage("Mora biti veće od 0", greaterThanZero),
  },
  lokacija: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
  zeljeno_okvirno_vrijeme_pocetka: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
  angazman_selekcija: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
  angazman_fipu: {},
  napomena: {},
  selekcija: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
  proces_selekcije: {},
};

const v$ = useVuelidate(rules, form);

async function onSubmit() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  }
  console.log("form", form);
  console.log("Submitted!");
  snackBarStore.pushMessage("Uspješno ste prijavili zadatak!", "success");
}

const allCompanies = ref([]);
const mappedCompanies = ref([]);

const angazmanSelect = { true: "Da", false: "Ne" };
const selectionSelect = { true: "Da", false: "Ne" };

onMounted(async () => {
  let result = await mainStore.fetchCompanies();
  allCompanies.value = result.data.results;

  mappedCompanies.value = allCompanies.value.map((items, index) => ({
    id: index + 1,
    label: items.naziv,
  }));
});
</script>

<template>
  <div>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiLaptop" title="FIPU Praksa" main>
        <a href="" target="_blank">
          <img
            src="FIPU_praksa_logo_transparent.svg"
            class="max-h-14 object-contain"
          />
        </a>
      </SectionTitleLineWithButton>
      <p><b>Akademska godina:</b> 2023/2024</p>
      <p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheck"
        main
        title="Prijava novog zadatka"
      ></SectionTitleLineWithButton>
      <p>
        Ova prijavnica je namijenjena <u>poduzećima i organizacijama</u> koje
        žele provoditi studentsku praksu u suradnji s Fakultetom informatike u
        Puli. Na temelju ovog upitnika odredit će se idealni studenti za
        provođenje prakse u Vašem poduzeću.
      </p>
      <br />

      <p>
        Studentima je ovo izborni kolegij i oni koji su prijavljeni, motivirani
        su i spremni za rad!
      </p>
      <br />
      <p>
        <b>Važna napomena:</b> Pojedina organizacija može prijaviti i više
        zadataka. Molimo da za svaki zadatak zasebno popunite prijavnicu (isti
        link) te zatražite broj studenata koji može na njemu raditi (npr. može
        biti 2 zadataka, na prvom 3 studenta, na drugom 4).
      </p>
      <p>
        Za sve dodatne informacije slobodno kontaktirajte voditelja stručne
        prakse:
      </p>
      <p>doc. dr. sc. Nikola Tanković</p>
      <p>+385 98 30 56 73</p>
      <p>nikola.tankovic@unipu.hr</p>
      <br />
      <hr />

      <div class="grid grid-cols-1 gap-6 mb-6">
        <CardBox
          :icon="mdiBallot"
          class="mb-6 lg:mb-0 lg:col-span-2 xl:col-span-3"
          is-form
          @submit.prevent="onSubmit"
        >
          <CardBoxComponentTitle
            class="text-center"
            title="💼Prijava projekta za studentsku praksu "
          />

          <FormField
            label="Poduzeće partner"
            help="Ako niste partner, unesite naziv poduzeća ispod"
            horizontal
          >
            <FormCombobox
              v-model="form.Poslodavac"
              :options="mappedCompanies"
              placeholder="Odaberite poduzeće ako ste postojeći partner"
            />
          </FormField>

          <FormField label="Naziv poduzeća" horizontal>
            <FormControl
              v-model="form.Poslodavac_novi_naziv"
              :icon-left="mdiDomain"
              help="Naziv poduzeća ako ste novi partner"
              :error="getFirstErrorForField('Poslodavac_novi_naziv')"
              placeholder="Naziv poduzeća ako ste novi partner"
            />
          </FormField>

          <FormField label="Kontakt email" horizontal>
            <FormControl
              v-model="form.poslodavac_email"
              :icon-left="mdiEmail"
              type="email"
              :error="getFirstErrorForField('poslodavac_email')"
              help="E-mail adresa pri kojoj će se student obratiti oko dogovora za izvođenje studentske prakse ili provedbu selekcije. Ne mora nužno biti budući mentor."
              placeholder="Email"
            />
          </FormField>

          <BaseDivider />
          <FormField label="Detaljan opis zadatka" horizontal>
            <FormControl
              v-model="form.opis_zadatka"
              type="textarea"
              :error="getFirstErrorForField('opis_zadatka')"
              :icon-left="mdiTextLong"
              help="Opis zadataka koji bi student izvršavao. Može biti: mala (web, mobilna, desktop) aplikacija, program za obradu podataka, analiza podataka, poboljšanje postojećeg koda (engl. code refactoring), pomoć pri održavanju računalne ili aplikacijske infrastrukture - DevOps poslovi, ... Preporuča se što detaljniji opis kako bi mogli alocirati idealnog kandidata."
            />
          </FormField>

          <FormField
            label="Preferirane tehnologije/platforme
"
            horizontal
          >
            <FormControl
              v-model="form.preferirane_tehnologije"
              type="textarea"
              :error="getFirstErrorForField('preferirane_tehnologije')"
              :icon-left="mdiXml"
              help="Što sve koristi vaša tvrtka ili na čemu će se temeljiti rad studenta? Npr. PHP, Laravel, Python, Django, JavaScript, Vue.js, Unity, WordPress, TensorFlow...
"
            />
          </FormField>

          <FormField label="Broj studenata" horizontal>
            <FormField addons>
              <FormControl
                v-model="form.broj_studenata"
                type="number"
                :icon-left="mdiAccountGroup"
                :error="getFirstErrorForField('broj_studenata')"
                :min="1"
                placeholder="Maksimalni broj studenata"
                help="Koliko studenata možete primiti u rješavanju ovog zadatka? Studenti mogu raditi odvojeno ili u timu. Ako imate više zadataka, možete ponovno popuniti formu za svaki zadatak posebno."
                expanded
              />
            </FormField>
          </FormField>

          <FormField
            label="Preferencije pri odabiru studenta
"
            horizontal
          >
            <FormControl
              v-model="form.preferencije_za_studenta"
              type="textarea"
              :error="getFirstErrorForField('preferencije_za_studenta')"
              :icon-left="mdiThumbsUpDown"
              help="U koliko smatrate važnim, opišite odlike poželjnog kandidata na praksi."
            />
          </FormField>

          <FormField
            label="Potrebna infrastruktura koju student mora posjedovati"
            horizontal
          >
            <FormControl
              v-model="form.potrebno_imati"
              :error="getFirstErrorForField('potrebno_imati')"
              :icon-left="mdiDomain"
              help="Potrebna infrastruktura koju student mora posjedovati"
              placeholder="Potrebna infrastruktura koju student mora posjedovati"
            />
          </FormField>

          <FormField label="Željeno trajanje prakse" horizontal>
            <FormField addons>
              <FormControl
                v-model="form.trajanje_sati"
                type="number"
                :error="getFirstErrorForField('trajanje_sati')"
                :icon-left="mdiClockTimeFiveOutline"
                placeholder="Preporuča se između 90 i 150 radnih sati"
                help="Preporučeno trajanje studentske prakse je između 90 i 150 radnih sati. U dogovoru sa studentom može se kasnije taj angažman produljiti. Dogovor kako će se izvršiti tih 90-150 sati je između vas i studenta (npr. koncentrirano u 2-3 tjedna ili par puta tjedno kroz dulje vrijeme).
"
                expanded
              />
            </FormField>
          </FormField>

          <FormField label="Lokacija" horizontal>
            <FormControl
              v-model="form.lokacija"
              help="Moguća je 'remote' praksa"
              :error="getFirstErrorForField('lokacija')"
              :icon-left="mdiMapMarker"
              placeholder="Lokacija održavanja studentske prakse"
            />
          </FormField>

          <FormField label="Željeno okvirno vrijeme početka" horizontal>
            <FormControl
              v-model="form.zeljeno_okvirno_vrijeme_pocetka"
              :icon-left="mdiClipboardTextClockOutline"
              :error="getFirstErrorForField('zeljeno_okvirno_vrijeme_pocetka')"
              help="Praksa se mora obaviti najkasnije do 1. rujna sljedeće godine."
            />
          </FormField>

          <FormField
            label="Angažman nastavnika s FIPU"
            help="Po želji, nastavno osoblje FIPU-a može pomoći pri izvođenju prakse na način da oni dijelom (ili u potpunosti) mentoriraju studenta. Moguće je čak da student u našem laboratoriju obavlja s praksom, te povremeno dolazi prezentirati učinjeno."
            horizontal
          >
            <FormCheckRadioGroup
              v-model="form.angazman_selekcija"
              :error="getFirstErrorForField('angazman_selekcija')"
              name="angazman_selection"
              type="radio"
              :options="angazmanSelect"
              component-class="check-radio-warning"
            />
          </FormField>

          <FormField
            label="Opis angažmana nastavnika"
            help="Molimo da navedete Vaše potrebe angažmana."
            horizontal
          >
            <FormControl
              v-model="form.angazman_fipu"
              :error="getFirstErrorForField('angazman_fipu')"
              type="textarea"
              :icon-left="mdiSchool"
              :disabled="form.angazman_selekcija === false"
            />
          </FormField>

          <FormField label="Dodatna napomena" horizontal>
            <FormControl
              v-model="form.napomena"
              :error="getFirstErrorForField('napomena')"
              type="textarea"
            />
          </FormField>

          <FormField
            label="Selekcijski postupak"
            help="Želimo provesti dodatnu selekciju kandidata koji se jave na praksu
"
            horizontal
          >
            <FormCheckRadioGroup
              v-model="form.selekcija"
              name="selekcija_selection"
              :error="getFirstErrorForField('selekcija')"
              type="radio"
              :options="selectionSelect"
              component-class="check-radio-warning"
            />
          </FormField>

          <FormField label="Proces selekcije" horizontal>
            <FormControl
              v-model="form.proces_selekcije"
              :error="getFirstErrorForField('proces_selekcije')"
              type="textarea"
              :disabled="form.selekcija === false"
              help="Ako se provodi selekcija, kratko opišite postupak, da studenti otprilike znaju što očekivati."
            />
          </FormField>

          <FormField horizontal grouped>
            <BaseButton label="Pošalji" type="submit" color="fipu_blue" />
          </FormField>
        </CardBox>
      </div>
    </SectionMain>
    <FooterBar
      ><br />Made with <span style="color: #e25555">&#9829;</span> at
      FIPU.lab</FooterBar
    >
    <SnackBar />
  </div>
</template>
