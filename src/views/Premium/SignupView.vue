<script setup>
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { useMainStore } from "@/stores/main.js";
import { mdiAccount, mdiEmail } from "@mdi/js";
import SectionFormScreen from "@/components/Premium/SectionFormScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

const form = reactive({
  login: "johndoe",
  email: "john.doe@example.com",
  pass: "secret",
});

const mainStore = useMainStore();

const submit = () => {
  mainStore.pushMessage("Submitted. Demo only", "contrast");
};
</script>

<template>
  <LayoutGuest>
    <SectionFormScreen v-slot="{ cardClass }" bg="yellowRed" has-promo>
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Username" help="Please enter your new username">
          <FormControl
            v-model="form.login"
            :icon-right="mdiAccount"
            name="login"
            placeholder="johndoe"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="form.email"
            :icon-right="mdiEmail"
            name="login"
            type="email"
            placeholder="user@example.com"
            autocomplete="email"
          />
        </FormField>

        <FormField label="Password" help="Click icon to show/hide">
          <FormControl
            v-model="form.pass"
            type="password"
            name="password"
            placeholder="Password"
            autocomplete="new-password"
          />
        </FormField>

        <template #footer>
          <BaseLevel mobile>
            <BaseButton label="Signup" type="submit" color="info" />
            <RouterLink to="/login" class="text-sm">
              Have an account?
            </RouterLink>
          </BaseLevel>
        </template>
      </CardBox>
    </SectionFormScreen>
  </LayoutGuest>
</template>
