<script setup>
import { ref } from "vue";
import { mdiMessageBadge } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import FormField from "@/components/Premium/FormField.vue";
import FormControl from "@/components/Premium/FormControl.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { useSnackBarStore } from "../../stores/snackBar";

const snackBarColor = ref("info");

const snackBarMessage = ref("Hello! This is demo message...");

const snackBarLifetime = ref(3000);

const snackBarPush = () => {
  useSnackBarStore().pushMessage(
    snackBarMessage.value,
    snackBarColor.value,
    snackBarLifetime.value
  );
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionTitle>SnackBar Toasts</SectionTitle>

    <SectionMain>
      <CardBox
        class="md:w-7/12 lg:w-5/12 xl:w-4/12 md:mx-auto"
        is-form
        @submit.prevent="snackBarPush"
      >
        <FormField label="SnackBar text">
          <FormControl
            v-model="snackBarMessage"
            placeholder="Message"
            help="Message text"
            required
          />
        </FormField>
        <FormField label="SnackBar lifetime (ms)">
          <FormControl
            v-model="snackBarLifetime"
            placeholder="3000"
            help="Lifetime value in milliseconds. Use `0` for infinite."
            type="number"
            min="0"
            required
          />
        </FormField>
        <FormField label="SnackBar color">
          <FormCheckRadioGroup
            v-model="snackBarColor"
            name="snack-bar-color"
            type="radio"
            :options="{
              contrast: 'Contrast',
              info: 'Info',
              success: 'Success',
              warning: 'Warning',
              danger: 'Danger',
            }"
            is-column
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton
              class="flex-1"
              type="submit"
              label="Push"
              :icon="mdiMessageBadge"
              :color="snackBarColor"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
