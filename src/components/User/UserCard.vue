<script setup>
import UserAvatarCurrentUser from "@/components/User/UserAvatarCurrentUser.vue";
import { mdiCheckDecagram, mdiSchool, mdiShieldAccount } from "@mdi/js";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import { mainStore } from "@/main.js";
import { computed, ref } from "vue";

import moment from "@/moment-setup";

const loggeddTimeAgo = computed(() => moment(mainStore.currentUser.loggedAt).fromNow());

const userSwitchVal = ref(false);
</script>

<template>
	<CardBox>
		<BaseLevel type="justify-around lg:justify-center">
			<UserAvatarCurrentUser class="h-64 w-64 lg:mx-12" />
			<div class="space-y-3 text-center md:text-left lg:mx-12">
				<h1 class="text-2xl">
					Hej,
					<b>{{ mainStore.currentUser.username || mainStore.currentUser.ime }}</b
					>!
				</h1>
				<p>
					Zadnja prijava <b>{{ loggeddTimeAgo }}</b> s IP adrese
					<b>127.0.0.1</b>
				</p>
				<div class="flex justify-center md:block">
					<PillTag v-if="mainStore.currentUser.account_type == 'admin'" label="Admin" color="danger" :icon="mdiShieldAccount" />
					<PillTag v-if="mainStore.currentUser.account_type == 'student'" label="Student" color="success" :icon="mdiSchool" />
					<PillTag label="Verified" color="info" :icon="mdiCheckDecagram" />
				</div>
			</div>
		</BaseLevel>
	</CardBox>
</template>
