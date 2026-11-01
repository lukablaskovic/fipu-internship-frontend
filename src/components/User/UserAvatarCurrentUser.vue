<script setup>
import UserAvatar from "@/components/User/UserAvatar.vue";
import small_loading_gif from "/small_loading_gif.gif";
import { useMainStore } from "@/stores/main_store";

const mainStore = useMainStore();

</script>

<template>
	<UserAvatar :username="`${mainStore.currentUser.ime} ${mainStore.currentUser.prezime}`" :avatar="mainStore.avatarChanging ? small_loading_gif : mainStore.currentUser.avatar">
		<slot />
	</UserAvatar>
</template>
