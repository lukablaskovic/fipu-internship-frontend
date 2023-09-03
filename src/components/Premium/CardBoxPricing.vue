<script setup>
import { mdiCheck, mdiChevronUp, mdiChevronDown } from "@mdi/js";
import { ref, computed } from "vue";
import CardBox from "@/components/CardBox.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import PillTag from "@/components/PillTag.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import CardBoxComponentBody from "@/components/CardBoxComponentBody.vue";
import CardBoxComponentFooter from "@/components/CardBoxComponentFooter.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (value) => value.title && value.subTitle,
  },
  price: {
    type: [String, Number],
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  isMain: Boolean,
});

const isCollapsed = ref(true);

const isCollapsible = computed(() => !props.isMain);

const isCollapsedComputed = computed(
  () => isCollapsible.value && isCollapsed.value
);
</script>

<template>
  <CardBox
    :class="[isMain ? 'shadow-2xl' : 'lg:my-12']"
    rounded="rounded-2xl"
    has-component-layout
  >
    <header
      class="p-6 border-gray-50 dark:border-slate-800 border-b"
      @click.prevent="isCollapsed = !isCollapsed"
    >
      <BaseLevel mobile>
        <div>
          <BaseLevel type="justify-start" mobile>
            <h3 class="text-4xl">$</h3>
            <h1 class="text-5xl font-black">
              {{ price }}
            </h1>
            <h1 class="text-xl text-gray-500 dark:text-gray-400">
              /{{ period }}
            </h1>
          </BaseLevel>
          <PillTag
            :label="item.label"
            :color="item.labelType"
            class="mt-3"
            small
          />
        </div>

        <BaseLevel mobile>
          <div class="text-right">
            <h1 class="text-2xl">
              {{ item.title }}
            </h1>
            <h1 class="text-lg text-gray-500 dark:text-gray-400">
              {{ item.subTitle }}
            </h1>
          </div>
          <BaseIcon
            v-if="isCollapsible"
            :path="isCollapsedComputed ? mdiChevronUp : mdiChevronDown"
            size="48"
            w="w-16"
            h="h-16"
            class="ml-6 lg:hidden"
          />
        </BaseLevel>
      </BaseLevel>
    </header>

    <CardBoxComponentBody :class="{ 'hidden lg:block': isCollapsedComputed }">
      <div class="space-y-6">
        <div
          v-for="(option, index) in item.options"
          :key="index"
          class="flex items-center"
        >
          <BaseIcon :path="mdiCheck" size="24" w="w-8" h="h-8" />
          <span class="text-lg ml-3"
            ><b>{{ option.main }}</b> {{ option.sub }}</span
          >
        </div>
      </div>
    </CardBoxComponentBody>

    <CardBoxComponentFooter :class="{ 'hidden lg:block': isCollapsedComputed }">
      <BaseButtons>
        <BaseButton
          class="flex-1"
          color="info"
          label="Subscribe"
          :outline="!isMain"
        />
      </BaseButtons>
    </CardBoxComponentFooter>
  </CardBox>
</template>
