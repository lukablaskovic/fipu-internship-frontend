<script setup>
import { ref, reactive } from "vue";
import { useMainStore } from "@/stores/main.js";
import {
  mdiBallot,
  mdiBallotOutline,
  mdiAccount,
  mdiMail,
  mdiCheck,
  mdiProgressCheck,
  mdiReload,
  mdiCreditCardOutline,
} from "@mdi/js";
import { buttonMenuOptions } from "@/sampleButtonMenuOptions.js";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormField from "@/components/Premium/FormField.vue";
import FormControl from "@/components/Premium/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import BaseButton from "@/components/BaseButton.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBoxComponentTitle from "../../components/CardBoxComponentTitle.vue";

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

const checkboxOptions = { lorem: "Lorem", ipsum: "Ipsum", dolore: "Dolore" };
const radioOptions = { one: "One", two: "Two" };
const switchOptions = { one: "One", two: "Two" };

const form = reactive({
  name: "John Doe",
  email: "john.doe@example.com",
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

const mainStore = useMainStore();

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
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        title="Advanced forms example"
        main
      >
        <BaseButton
          href="https://justboil.me/tailwind-admin-templates/vue-dashboard/"
          label="Buy dashboard"
          :icon="mdiCreditCardOutline"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 mb-6 xl:grid-cols-4">
        <CardBox
          :icon="mdiBallot"
          class="mb-6 lg:mb-0 lg:col-span-2 xl:col-span-3"
          is-form
          @submit.prevent="submit"
        >
          <CardBoxComponentTitle
            title="Horizontal fields layout and advanced controls"
            class="mb-12"
          />
          <FormField label="Fields" horizontal>
            <FormControl
              v-model="form.name"
              :icon-left="mdiAccount"
              help="Your full name"
              placeholder="Name"
            />
            <FormControl
              v-model="form.email"
              :icon-left="mdiMail"
              :icon-right="mdiCheck"
              type="email"
              help="Your e-mail"
              placeholder="Email"
            />
          </FormField>

          <FormField
            label="*** Show/hide"
            help="Show/hide by clicking icon on the right"
            horizontal
          >
            <FormControl
              v-model="form.pass"
              type="password"
              name="password"
              placeholder="Password"
              :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
              @right-icon-click="passShowHideClicked = true"
            />
          </FormField>

          <FormField
            label="With addons"
            help="Field with prefix & suffix"
            horizontal
          >
            <FormField addons>
              <FormControl type="static" model-value="+44 (0)" first-addon />
              <FormControl
                v-model="form.phone"
                type="tel"
                placeholder="Your phone number"
                expanded
                middle-addon
              />
              <FormControl type="static" model-value="UK" last-addon />
            </FormField>
          </FormField>

          <FormField help="Static prefix with dropdown at the end" horizontal>
            <FormField addons>
              <FormControl type="static" model-value="$" first-addon />
              <FormControl
                v-model="form.amount"
                type="number"
                placeholder="Amount"
                expanded
                middle-addon
              />
              <FormControl
                v-model="form.currency"
                :options="['USD', 'CAD', 'AUD']"
                input-w="w-24"
                last-addon
              />
            </FormField>
          </FormField>

          <FormField help="Static prefix with button at the end" horizontal>
            <FormField addons>
              <FormControl type="static" model-value="IPv6:" first-addon />
              <FormControl
                v-model="form.ipv6"
                type="text"
                placeholder="Link-local"
                expanded
                middle-addon
              />
              <FormControl
                button-color="info"
                button-label="Fetch"
                last-addon
              />
            </FormField>
          </FormField>

          <FormField help="Button and text field" horizontal>
            <FormField addons>
              <FormControl
                button-color="success"
                :button-icon="mdiReload"
                first-addon
              />
              <FormControl
                v-model="form.ipv4"
                type="text"
                placeholder="IPv4"
                expanded
                last-addon
              />
            </FormField>
          </FormField>

          <FormField
            label="Custom dropdown"
            help="Customized dropdown component"
            horizontal
          >
            <FormControl
              v-model="form.person"
              type="list"
              :options="listBoxOptions"
            />
          </FormField>

          <FormField label="Dropdown" help="Classic select" horizontal>
            <FormControl
              v-model="form.department"
              :options="selectFieldOptions"
            />
          </FormField>

          <BaseDivider />

          <FormField label="Date" horizontal>
            <FormControl type="date" help="Date picker" />
          </FormField>

          <BaseDivider />

          <FormField
            label="Textarea"
            help="Your question. Max 255 characters"
            horizontal
          >
            <FormControl
              v-model="form.question"
              type="textarea"
              placeholder="Explain how we can help you"
            />
          </FormField>

          <BaseDivider />

          <FormField label="Checkbox" help="Vertical layout" horizontal>
            <FormCheckRadioGroup
              v-model="form.checkboxTwo"
              name="sample-checkbox-two"
              :options="checkboxOptions"
              is-column
            />
          </FormField>

          <BaseDivider />

          <FormField
            label="Success"
            help="Horizontal layout with color"
            horizontal
          >
            <FormCheckRadioGroup
              v-model="form.checkboxTwo"
              name="sample-checkbox-two"
              :options="checkboxOptions"
              component-class="check-radio-success"
            />
          </FormField>

          <BaseDivider />

          <FormField label="Radio" help="Vertical layout" horizontal>
            <FormCheckRadioGroup
              v-model="form.radioTwo"
              name="sample-radio-two"
              type="radio"
              :options="radioOptions"
              is-column
            />
          </FormField>

          <BaseDivider />

          <FormField
            label="Warning"
            help="Horizontal layout with color"
            horizontal
          >
            <FormCheckRadioGroup
              v-model="form.radioTwo"
              name="sample-radio-two-warning"
              type="radio"
              :options="radioOptions"
              component-class="check-radio-warning"
            />
          </FormField>

          <BaseDivider />

          <FormField label="Switch" help="Vertical layout" horizontal>
            <FormCheckRadioGroup
              v-model="form.switchTwo"
              name="sample-switch-two"
              type="switch"
              :options="switchOptions"
              is-column
            />
          </FormField>

          <BaseDivider />

          <FormField
            label="Danger"
            help="Horizontal layout with color"
            horizontal
          >
            <FormCheckRadioGroup
              v-model="form.switchTwo"
              name="sample-switch-two"
              type="switch"
              :options="switchOptions"
              component-class="check-radio-danger"
            />
          </FormField>

          <BaseDivider />

          <FormField label="File" horizontal>
            <FormFilePicker v-model="form.file" label="Upload" />
          </FormField>

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
        </CardBox>

        <CardBox class="lg:col-span-2 xl:col-span-1">
          <FormField label="Checkbox" multiline>
            <FormCheckRadioGroup
              v-model="form.checkboxOne"
              name="sample-checkbox-one"
              :options="checkboxOptions"
            />
          </FormField>

          <BaseDivider />

          <FormField label="Radio" multiline>
            <FormCheckRadioGroup
              v-model="form.radioOne"
              name="sample-radio-one"
              type="radio"
              :options="radioOptions"
            />
          </FormField>

          <BaseDivider />

          <FormField label="Switch" multiline>
            <FormCheckRadioGroup
              v-model="form.switchOne"
              name="sample-switch-one"
              type="switch"
              :options="switchOptions"
            />
          </FormField>

          <BaseDivider />

          <FormField label="File">
            <FormFilePicker v-model="form.file" label="Upload" />
          </FormField>
        </CardBox>
      </div>

      <SectionTitleLineWithButton
        :icon="mdiProgressCheck"
        title="Layout & state examples"
      />

      <CardBox>
        <FormField label="Fields">
          <FormControl
            v-model="formLower.name"
            :icon-left="mdiAccount"
            help="Your full name"
            placeholder="Name"
          />
          <FormControl
            v-model="formLower.email"
            success
            :icon-left="mdiMail"
            type="email"
            help="Field in success state"
            placeholder="Email"
          />
          <FormControl
            v-model="formLower.email"
            error="Field in error state"
            :icon-left="mdiMail"
            type="email"
            help="Your e-mail"
            placeholder="Email"
          />
        </FormField>

        <FormField label="Fields">
          <FormControl
            v-model="formLower.person"
            type="list"
            :options="listBoxOptions"
          />
          <FormControl
            v-model="formLower.department"
            :options="selectFieldOptions"
          />
        </FormField>

        <FormField
          error="Textarea in error state"
          label="Textarea"
          help="Your question. Max 255 characters"
        >
          <FormControl
            v-model="formLower.question"
            error
            type="textarea"
            placeholder="Explain how we can help you"
          />
        </FormField>
      </CardBox>

      <SectionTitle>Form with error example</SectionTitle>

      <CardBox
        class="md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl md:mx-auto"
        :class="{ 'animate-shake': formErrorHasError }"
        is-form
        @submit.prevent="formErrorSubmit"
      >
        <FormField label="Fields" :error="formErrorHasError">
          <FormControl
            v-model="form.name"
            :icon-left="mdiAccount"
            help="Your full name"
            placeholder="Name"
            :error="formErrorHasError ? 'Oops, this is error' : null"
          />
        </FormField>

        <template #footer>
          <BaseButton
            label="Trigger"
            type="submit"
            :color="formErrorHasError ? 'danger' : 'info'"
            :tip="formErrorHasError ? null : 'Click to trigger'"
          />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
