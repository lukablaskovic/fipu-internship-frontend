<script setup>
import { useSnackBarStore } from "@/stores/snackBar";
import SnackBarItem from "@/components/Premium/SnackBarItem.vue";

const snackBarStore = useSnackBarStore();

const cancelMessage = (timestamp) => {
  snackBarStore.cancelMessage(timestamp);
};
</script>

<template>
  <div
    class="fixed inset-0 flex flex-col-reverse p-9 overflow-hidden z-100 pointer-events-none"
  >
    <SnackBarItem
      v-for="message in snackBarStore.messages"
      :key="message.timestamp"
      :timestamp="message.timestamp"
      :lifetime="message.lifetime"
      :text="message.text"
      :color="message.color"
      @cancel="cancelMessage"
    />
  </div>
</template>
