<script setup>
import { buttonMenuOptions } from "@/sampleButtonMenuOptions.js";
import { mdiDotsVertical } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import PillTag from "@/components/PillTag.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import BaseButtons from "@/components/BaseButtons.vue";

defineProps({
  product: {
    type: Object,
    required: true,
    validate: (value) =>
      value.name &&
      value.date &&
      value.adjective &&
      value.material &&
      value.price,
  },
});
</script>

<template>
  <CardBox class="mb-6 last:mb-0" is-hoverable>
    <BaseLevel>
      <BaseLevel type="justify-start">
        <UserAvatar
          class="w-12 h-12 md:mr-6"
          api="bottts"
          bg=""
          :username="product.name"
        />
        <div class="text-center md:text-left">
          <h4 class="text-xl">
            {{ product.name }}
          </h4>
          <p class="text-gray-500">
            {{ product.date }}
          </p>
        </div>
      </BaseLevel>

      <BaseLevel type="justify-end">
        <BaseButtons class-addon="mr-1.5 last:mr-0 mb-3">
          <PillTag color="success" :label="product.adjective" small />
          <PillTag color="info" :label="product.material" small />
          <PillTag color="warning" :label="product.product" small />
        </BaseButtons>
        <h4 class="text-xl md:mx-6">${{ product.price }}</h4>
        <ButtonMenu
          :options="buttonMenuOptions"
          :icon="mdiDotsVertical"
          small
        />
      </BaseLevel>
    </BaseLevel>
  </CardBox>
</template>
