<script setup>
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { useMainStore } from "@/stores/main.js";
import { mdiAccount } from "@mdi/js";
import SectionFormScreen from "@/components/Premium/SectionFormScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

const form = reactive({
  login: "johndoe",
});

const mainStore = useMainStore();

const submit = () => {
  mainStore.pushMessage("Submitted. Demo only", "contrast");
};
</script>

<template>
  <LayoutGuest>
    <SectionFormScreen v-slot="{ cardClass }" bg="redYellow">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Username" help="Please enter your username">
          <FormControl
            v-model="form.login"
            :icon-right="mdiAccount"
            name="login"
            placeholder="johndoe"
            autocomplete="username"
          />
        </FormField>

        <template #footer>
          <BaseLevel mobile>
            <BaseButton label="Remind" type="submit" color="info" />
            <RouterLink to="/login" class="text-sm"> Back to login </RouterLink>
          </BaseLevel>
        </template>
      </CardBox>
    </SectionFormScreen>
  </LayoutGuest>
</template>
