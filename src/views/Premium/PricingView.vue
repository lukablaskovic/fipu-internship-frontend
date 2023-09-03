<script setup>
import { ref, computed } from "vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import CardBoxPricing from "@/components/Premium/CardBoxPricing.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

const period = ref("monthly");

const pricing = {
  monthly: {
    beginner: 19,
    standard: 29,
    pro: 39,
  },
  yearly: {
    beginner: 199,
    standard: 299,
    pro: 399,
  },
};

const periodStr = computed(() => (period.value === "monthly" ? "mo" : "yr"));

const pricingCurrent = computed(() => pricing[period.value]);

const itemBeginner = {
  title: "Beginner",
  subTitle: "Essentials",
  label: "Good start",
  labelType: "contrast",
  options: [
    {
      main: "5",
      sub: "units",
    },
    {
      main: "100",
      sub: "minutes",
    },
    {
      main: "1",
      sub: "user",
    },
  ],
};

const itemStandard = {
  title: "Standard",
  subTitle: "Basic options",
  label: "Most popular",
  labelType: "info",
  options: [
    {
      main: "25",
      sub: "units",
    },
    {
      main: "1,000",
      sub: "minutes",
    },
    {
      main: "10",
      sub: "users",
    },
    {
      main: "Hosted",
      sub: "runners",
    },
  ],
};

const itemPro = {
  title: "Pro",
  subTitle: "All options",
  label: "For large projects",
  labelType: "contrast",
  options: [
    {
      main: "100",
      sub: "units",
    },
    {
      main: "10,000",
      sub: "minutes",
    },
    {
      main: "Unlimited",
      sub: "users",
    },
    {
      main: "Hosted",
      sub: "runners",
    },
    {
      main: "SLA",
      sub: "guaranteed",
    },
  ],
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionTitle custom>
      <h1 class="text-5xl lg:text-6xl font-black">Sample Pricing</h1>
      <h2 class="text-2xl">some catchy headline</h2>
      <BaseButtons type="justify-center" class="mt-12" glue no-wrap>
        <BaseButton
          label="Monthly"
          :outline="period !== 'monthly'"
          color="contrast"
          rounded-full
          no-focus-ring
          addon
          @click="period = 'monthly'"
        />
        <BaseButton
          label="Yearly"
          :outline="period !== 'yearly'"
          color="contrast"
          rounded-full
          no-focus-ring
          addon
          @click="period = 'yearly'"
        />
      </BaseButtons>
    </SectionTitle>

    <SectionMain>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CardBoxPricing
          :item="itemBeginner"
          :price="pricingCurrent.beginner"
          :period="periodStr"
          class="xl:ml-12"
        />

        <CardBoxPricing
          :item="itemStandard"
          :price="pricingCurrent.standard"
          :period="periodStr"
          is-main
        />

        <CardBoxPricing
          :item="itemPro"
          :price="pricingCurrent.pro"
          :period="periodStr"
          class="xl:mr-12"
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
