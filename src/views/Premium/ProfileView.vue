<script setup>
import { reactive, ref } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccount,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiCreditCardOutline,
  mdiCreditCard,
  mdiCheckDecagram,
  mdiMapMarker,
  mdiAccountCircle,
  mdiDomain,
  mdiPencil,
  mdiInformation,
  mdiPlusCircle,
  mdiAccountCreditCard,
  mdiCloudLock,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import UserAvatarCurrentUserWithUpload from "@/components/Premium/UserAvatarCurrentUserWithUpload.vue";
import PillTag from "@/components/PillTag.vue";
import PillTagPlain from "@/components/PillTagPlain.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import UserCardProfileNumber from "@/components/Premium/UserCardProfileNumber.vue";
import SectionBannerProfile from "@/components/Premium/SectionBannerProfile.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBoxBillingItem from "@/components/Premium/CardBoxBillingItem.vue";
import CardBoxPaymentMethod from "@/components/Premium/CardBoxPaymentMethod.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";

const mainStore = useMainStore();

const profileForm = reactive({
  name: mainStore.userName,
  email: mainStore.userEmail,
});

const passwordForm = reactive({
  password_current: "",
  password: "",
  password_confirmation: "",
});

const submitProfile = () => {
  mainStore.setUser(profileForm);
};

const submitPass = () => {
  //
};

const date = new Date();

const dateOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};

const firstDayOfNextMonth = new Date(
  date.getFullYear(),
  date.getMonth() + 1,
  1
).toLocaleDateString("en-US", dateOptions);

const firstDayOfThisMonth = new Date(
  date.getFullYear(),
  date.getMonth(),
  1
).toLocaleDateString("en-US", dateOptions);

const billingHistory = [
  {
    id: 1,
    amount: 24.99,
    date: firstDayOfThisMonth,
  },
  {
    id: 2,
    amount: 24.99,
    date: new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    ).toLocaleDateString("en-US", dateOptions),
  },
  {
    id: 3,
    amount: 24.99,
    date: new Date(
      date.getFullYear(),
      date.getMonth() - 2,
      1
    ).toLocaleDateString("en-US", dateOptions),
  },
];

const paymentMethods = [
  {
    id: 1,
    cardType: "mc",
    cardNumber: "4575",
    cardExpires: "04/24",
    cardOwner: "john doe",
    isPrimary: true,
  },
  {
    id: 2,
    cardType: "visa",
    cardNumber: "0785",
    cardExpires: "06/26",
    cardOwner: "john doe",
    isPrimary: false,
  },
];

const apiStatusEnabled = ref(true);

const twoFactorEnabled = ref(true);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main>
        <BaseButton
          href="https://justboil.me/tailwind-admin-templates/vue-dashboard/"
          label="Buy dashboard"
          :icon="mdiCreditCardOutline"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <CardBox flex="flex-row" class="items-center">
          <div class="flex justify-start items-start">
            <UserAvatarCurrentUserWithUpload
              class="w-24 h-24 md:w-36 md:h-36 mr-6"
            />
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <div class="flex justify-start items-center mb-3">
                  <h1 class="text-2xl mr-1.5">
                    {{ mainStore.userName }}
                  </h1>
                  <BaseIcon
                    :path="mdiCheckDecagram"
                    :size="22"
                    class="text-blue-400"
                  />
                </div>
                <BaseButton
                  :icon="mdiPencil"
                  color="lightDark"
                  small
                  rounded-full
                />
              </div>

              <BaseButtons class="text-gray-500">
                <PillTagPlain label="Developer" :icon="mdiAccountCircle" />
                <PillTagPlain label="Kiehn-Green" :icon="mdiDomain" />
                <PillTagPlain label="Emelyside" :icon="mdiMapMarker" />
              </BaseButtons>
              <BaseButtons class="mt-6" class-addon="mr-9 last:mr-0 mb-3">
                <UserCardProfileNumber :number="499" label="Likes" />
                <UserCardProfileNumber :number="128" label="Posts" />
                <UserCardProfileNumber :number="256" label="Media" />
                <UserCardProfileNumber :number="384" label="Links" />
                <UserCardProfileNumber :number="512" label="Files" />
              </BaseButtons>
            </div>
          </div>
        </CardBox>

        <SectionBannerProfile />
      </div>

      <SectionTitleLineWithButton
        :icon="mdiAccountCreditCard"
        title="Billing overview"
      />

      <CardBox class="mb-6">
        <NotificationBar color="info" :icon="mdiInformation">
          <b>Payment date</b> is approaching soon.
          <template #right>
            <BaseButton label="See details" small rounded-full />
          </template>
        </NotificationBar>
        <div class="md:flex md:justify-between md:items-center">
          <div class="md:flex md:items-center">
            <div class="mb-6 text-center md:mr-6 md:mb-0 md:text-left">
              <p class="text-gray-500">Next payment on</p>
              <h1 class="text-xl font-semibold">{{ firstDayOfNextMonth }}</h1>
            </div>
            <div class="mb-6 text-center md:mb-0 md:text-left">
              <p class="text-gray-500">Last billed on</p>
              <h1 class="text-xl">{{ firstDayOfThisMonth }}</h1>
            </div>
          </div>
          <div class="text-center md:text-right">
            <p class="text-gray-500">Amount due</p>
            <h1 class="text-2xl font-semibold">$24.99</h1>
          </div>
        </div>
      </CardBox>

      <CardBoxBillingItem
        v-for="billingHistoryItem in billingHistory"
        :key="billingHistoryItem.id"
        :amount="billingHistoryItem.amount"
        :date="billingHistoryItem.date"
      />

      <SectionTitleLineWithButton :icon="mdiCreditCard" title="Payment methods">
        <BaseButton label="Add card" color="info" :icon="mdiPlusCircle" small />
      </SectionTitleLineWithButton>

      <CardBoxPaymentMethod
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.id"
        :card-type="paymentMethod.cardType"
        :card-number="paymentMethod.cardNumber"
        :card-expires="paymentMethod.cardExpires"
        :card-owner="paymentMethod.cardOwner"
        :is-primary="paymentMethod.isPrimary"
      />

      <!-- <BaseButtons>
        <BaseButton label="Show more" color="info" class="flex-1" outline />
      </BaseButtons> -->

      <SectionTitleLineWithButton
        :icon="mdiCloudLock"
        title="Security options"
      />

      <CardBox class="mb-6">
        <div class="flex items-center justify-between">
          <p>
            Last login <b>{{ firstDayOfThisMonth }}</b> from IP
            <b>192.168.100.99</b>
          </p>
          <BaseButton label="Manage sessions" color="lightDark" small />
        </div>
        <BaseDivider />
        <div class="flex items-center justify-between">
          <p class="mr-3 leading-none">
            API status <b>{{ apiStatusEnabled ? "enabled" : "disabled" }}</b>
          </p>
          <FormCheckRadio
            v-model="apiStatusEnabled"
            type="switch"
            name="api-status"
            :input-value="true"
          />
        </div>
        <BaseDivider />
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start">
            <p class="mr-3 leading-none">2-factor authentication</p>
            <PillTag
              :color="twoFactorEnabled ? 'info' : 'danger'"
              :label="twoFactorEnabled ? 'enabled' : 'disabled'"
              small
            />
          </div>

          <FormCheckRadio
            v-model="twoFactorEnabled"
            type="switch"
            name="two-factor"
            :input-value="true"
          />
        </div>
        <BaseDivider />
        <div class="flex items-center justify-between">
          <p>
            Password changed
            <b>long time ago</b>
          </p>
          <BaseButton label="Change password" color="lightDark" small />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiAccount" title="Manage profile" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardBox is-form @submit.prevent="submitProfile">
          <FormField label="Avatar" help="Max 500kb">
            <FormFilePicker label="Upload" />
          </FormField>

          <FormField label="Name" help="Required. Your name">
            <FormControl
              v-model="profileForm.name"
              :icon="mdiAccount"
              name="username"
              required
              autocomplete="username"
            />
          </FormField>
          <FormField label="E-mail" help="Required. Your e-mail">
            <FormControl
              v-model="profileForm.email"
              :icon="mdiMail"
              type="email"
              name="email"
              required
              autocomplete="email"
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Submit" />
              <BaseButton color="info" label="Options" outline />
            </BaseButtons>
          </template>
        </CardBox>
        <CardBox is-form @submit.prevent="submitPass">
          <FormField
            label="Current password"
            help="Required. Your current password"
          >
            <FormControl
              v-model="passwordForm.password_current"
              :icon="mdiAsterisk"
              name="password_current"
              type="password"
              required
              autocomplete="current-password"
            />
          </FormField>

          <BaseDivider />

          <FormField label="New password" help="Required. New password">
            <FormControl
              v-model="passwordForm.password"
              :icon="mdiFormTextboxPassword"
              name="password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <FormField
            label="Confirm password"
            help="Required. New password one more time"
          >
            <FormControl
              v-model="passwordForm.password_confirmation"
              :icon="mdiFormTextboxPassword"
              name="password_confirmation"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Submit" />
              <BaseButton color="info" label="Options" outline />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
