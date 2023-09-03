<script setup>
import { reactive, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { mdiAccount, mdiHome } from "@mdi/js";
import SectionFormScreen from "@/components/Premium/SectionFormScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioPicker from "@/components/FormCheckRadioGroup.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import ButtonTextLink from "@/components/Premium/ButtonTextLink.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

const form = reactive({
  login: "johndoe",
  pass: "secret",
  remember: ["remember"],
});

const hasTip = ref(false);

setTimeout(() => {
  hasTip.value = true;
}, 750);

const hasError = ref(false);

const cardClassAddon = computed(() => (hasError.value ? "animate-shake" : ""));

const submit = () => {
  hasError.value = true;
  hasTip.value = false;

  setTimeout(() => {
    hasError.value = false;
    passShowHideClicked.value = false;
  }, 2000);
};

const passShowHideClicked = ref(true);
</script>

<template>
  <LayoutGuest>
    <SectionFormScreen v-slot="{ cardClass }" bg="purplePink" has-promo>
      <CardBox
        :class="[cardClass, cardClassAddon]"
        is-form
        @submit.prevent="submit"
      >
        <FormField
          label="Login"
          :error="hasError"
          help="Please enter your login"
        >
          <FormControl
            v-model="form.login"
            :error="hasError"
            :icon-right="mdiAccount"
            name="login"
            placeholder="user@example.com"
            autocomplete="username"
          />
        </FormField>

        <FormField
          label="Password"
          :error="hasError"
          help="Click icon to show/hide"
        >
          <FormControl
            v-model="form.pass"
            :error="hasError"
            :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
            type="password"
            name="password"
            placeholder="Password"
            autocomplete="current-password"
            @right-icon-click="passShowHideClicked = true"
          />
        </FormField>

        <BaseLevel mobile>
          <FormCheckRadioPicker
            v-model="form.remember"
            name="remember"
            :options="{ remember: 'Remember' }"
            spaced
          />
          <RouterLink to="/remind" class="text-sm">
            Forgot password?
          </RouterLink>
        </BaseLevel>

        <template #footer>
          <BaseLevel mobile>
            <BaseButtons>
              <BaseButton
                label="Login"
                type="submit"
                color="info"
                :tip="hasTip ? 'Click to see error state' : null"
              />
              <BaseButton label="Sign up" to="/signup" color="info" outline />
            </BaseButtons>
            <ButtonTextLink to="/" :icon="mdiHome" label="Home" small />
          </BaseLevel>
        </template>
      </CardBox>
    </SectionFormScreen>
  </LayoutGuest>
</template>
