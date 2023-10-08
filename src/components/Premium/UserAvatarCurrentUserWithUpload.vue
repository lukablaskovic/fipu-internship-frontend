<script setup>
import { ref, watch } from "vue";
import UserAvatarCurrentUser from "@/components/User/UserAvatarCurrentUser.vue";
import { mdiCamera } from "@mdi/js";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";
import { mainStore } from "@/main.js";
import { snackBarStore } from "@/main.js";
import Utils from "@/helpers/utils";
import { User } from "@/services/gateway_api";

const uploadedAvatar = ref(null);

watch(uploadedAvatar, async (newFile) => {
	if (newFile) {
		try {
			mainStore.avatarChanging = true;
			console.log("mainStore.userAdmin", mainStore.userAdmin);
			let result = null;
			if (mainStore.userAdmin === false) {
				result = await mainStore.updateAvatarStudent(mainStore.currentUser.JMBAG, newFile);
				mainStore.avatarChanging = false;
			} else if (mainStore.userAdmin === true) {
				result = await mainStore.updateAvatarAdmin(newFile);

				if (result.status_code === 200) {
					let result2 = await User.updateAdminAvatarInPostgres(mainStore.currentUser.username, result.data.url);
					mainStore.avatarChanging = false;

					if (!result2) return;
				}
			} else return;

			if (result.status_code === 200) {
				await mainStore.fetchCurrentUser();
				snackBarStore.pushMessage("Avatar uspješno promijenjen!", "success");
				await Utils.wait(3);
				location.reload();
			} else {
				snackBarStore.pushMessage("Greška prilikom promjene avatara!", "danger");
				await Utils.wait(3);
				location.reload();
			}
		} catch (error) {
			console.error("Failed to upload avatar:", error);
		}
	}
});
</script>

<template>
	<UserAvatarCurrentUser class="relative">
		<div class="absolute right-0 bottom-0">
			<FormFilePicker v-model="uploadedAvatar" :icon="mdiCamera" is-round-icon />
		</div>
	</UserAvatarCurrentUser>
</template>
