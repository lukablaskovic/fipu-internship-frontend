<script setup>
import { useMainStore } from "@/stores/main";
import { useUserStore } from "@/stores/user";
import UserAvatar from "@/components/UserAvatar.vue";

const mainStore = useMainStore();
const userStore = useUserStore();
</script>

<template>
  <UserAvatar
    :username="userStore.currentUser.username"
    :avatar="userStore.currentUser.avatar"
  >
    <slot />
  </UserAvatar>
</template>
