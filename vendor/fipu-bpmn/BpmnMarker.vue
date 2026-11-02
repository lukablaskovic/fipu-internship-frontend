<script setup>
import { mdiAccountOutline, mdiCogOutline, mdiEmail, mdiEmailOutline, mdiHandBackLeftOutline, mdiClockOutline, mdiCircle, mdiPlus, mdiClose } from '@mdi/js';

defineProps({ type: { type: String, required: true } });
const paths = {
  userTask: mdiAccountOutline, serviceTask: mdiCogOutline, sendTask: mdiEmail, manualTask: mdiHandBackLeftOutline,
  intermediateCatchEvent: mdiEmailOutline, timerCatch: mdiClockOutline, terminateEnd: mdiCircle,
  parallelGateway: mdiPlus, exclusiveGateway: mdiClose,
};
</script>

<template>
  <svg v-if="paths[type]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path :d="paths[type]" /></svg>
</template>
