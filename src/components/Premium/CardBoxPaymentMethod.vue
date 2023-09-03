<script setup>
import { mdiTrashCan, mdiCreditCardEdit, mdiCreditCardCheck } from "@mdi/js";
import { computed } from "vue";
import CardBox from "../CardBox.vue";
import BaseButtons from "../BaseButtons.vue";
import BaseButton from "../BaseButton.vue";
import PillTag from "../PillTag.vue";
import CreditCardLogo from "./CreditCardLogo.vue";

const props = defineProps({
  cardType: {
    type: String,
    required: true,
    validator: (value) => ["mc", "visa"].indexOf(value) > -1,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  cardExpires: {
    type: String,
    required: true,
  },
  cardOwner: {
    type: String,
    required: true,
  },
  isPrimary: Boolean,
});

const cardTypeNames = {
  mc: "MasterCard",
  visa: "Visa",
};

const cardTypeName = computed(() => cardTypeNames[props.cardType]);
</script>

<template>
  <CardBox class="mb-6">
    <div class="md:flex md:justify-between md:items-center">
      <div class="flex justify-start items-center mb-6 md:mb-0">
        <CreditCardLogo class="mr-6" :card-type="cardType" />
        <div class="mr-6">
          <h2 class="text-xl font-semibold">
            {{ cardTypeName }} {{ cardNumber }}
          </h2>
          <p class="text-gray-500 text-sm uppercase">
            {{ cardExpires }} {{ cardOwner }}
          </p>
        </div>
        <PillTag
          v-if="isPrimary"
          color="info"
          :icon="mdiCreditCardCheck"
          label="Primary"
          small
        />
      </div>
      <BaseButtons type="justify-end md:justify-start">
        <BaseButton :icon="mdiCreditCardEdit" color="lightDark" />
        <BaseButton :icon="mdiTrashCan" color="lightDark" />
      </BaseButtons>
    </div>
  </CardBox>
</template>
