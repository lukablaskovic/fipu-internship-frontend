<script setup>
import { computed } from "vue";
import { mdiCreditCardOutline } from "@mdi/js";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import IconRounded from "@/components/IconRounded.vue";
import { ActivityEventMappings } from "@/helpers/maps";
import moment from "@/moment-setup";

const props = defineProps({
  student: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  // eslint-disable-next-line vue/prop-name-casing
  JMBAG: {
    type: String,
    required: true,
  },
});

const momentDate = computed(() => {
  let date = moment(props.date);
  return date.fromNow();
});

const icon = computed(() => {
  const eventMapping = ActivityEventMappings.getEvent(props.type);

  if (eventMapping) {
    return {
      icon: eventMapping.icon,
      type: eventMapping.type,
    };
  }

  return {
    icon: mdiCreditCardOutline,
    type: "info",
  };
});
</script>

<template>
  <CardBox class="mb-6 last:mb-0" is-hoverable>
    <BaseLevel>
      <BaseLevel type="justify-start">
        <IconRounded :icon="icon.icon" :color="icon.type" class="md:mr-6" />
        <div class="text-center space-y-1 md:text-left md:mr-6">
          <h4 class="text-xl">{{ student }}</h4>
          <p class="text-gray-500 dark:text-slate-400">
            <b>JMBAG: {{ JMBAG }}</b>
          </p>
        </div>
      </BaseLevel>
      <div class="text-center md:text-right space-y-2">
        <p class="text-sm text-gray-500">
          {{ momentDate }}
        </p>
        <div>
          <PillTag
            :color="icon.type"
            :label="ActivityEventMappings.getEvent(type).message"
            small
          />
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
