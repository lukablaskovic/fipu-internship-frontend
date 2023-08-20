<script setup>
import { useMainStore } from "@/stores/main_store.js";
import UserAvatar from "@/components/UserAvatar.vue";

const mainStore = useMainStore();
</script>

<template>
  <UserAvatar
    :username="mainStore.currentUser.username"
    :avatar="mainStore.currentUser.avatar"
  >
    <slot />
  </UserAvatar>
</template>
