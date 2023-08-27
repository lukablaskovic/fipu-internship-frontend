<script setup>
import { computed } from "vue";
import {
  mdiRayStartArrow,
  mdiThumbsUpDownOutline,
  mdiContentSaveCheckOutline,
  mdiClipboardCheck,
  mdiCreditCardOutline,
} from "@mdi/js";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import IconRounded from "@/components/IconRounded.vue";

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
  jmbag: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
});

const momentDate = computed(() => {
  let date = moment(props.date);
  return date.fromNow();
});

const icon = computed(() => {
  if (props.type === "start_event_student") {
    return {
      icon: mdiRayStartArrow,
      type: "danger",
    };
  } else if (props.type === "odabiranje_zadatka_student") {
    return {
      icon: mdiThumbsUpDownOutline,
      type: "success",
    };
  } else if (props.type === "studentske_pref") {
    return {
      icon: mdiContentSaveCheckOutline,
      type: "warning",
    };
  } else if (props.type === "alociranje_profesor") {
    return {
      icon: mdiClipboardCheck,
      type: "warning",
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
            <b>JMBAG: {{ jmbag }}</b>
          </p>
        </div>
      </BaseLevel>
      <div class="text-center md:text-right space-y-2">
        <p class="text-sm text-gray-500">
          {{ momentDate }}
        </p>
        <div>
          <PillTag :color="icon.type" :label="type" small />
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
