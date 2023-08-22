<script setup>
import { mainStore } from "@/main.js";
import UserAvatar from "@/components/UserAvatar.vue";
</script>

<template>
  <UserAvatar
    :username="mainStore.currentUser.username"
    :avatar="mainStore.currentUser.avatar"
  >
    <slot />
  </UserAvatar>
</template>
