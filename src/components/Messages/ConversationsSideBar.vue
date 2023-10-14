<script setup>
import ConversationsGroupsNavbar from "@/components/Messages/ConversationsGroupsNavbar.vue";
import AddConversationButton from "@/components/Messages/AddConversationButton.vue";
import ConversationsSearch from "@/components/Messages/ConversationsSearch.vue";
import ConversationItem from "@/components/Messages/ConversationItem.vue";

import BaseIcon from "@/components/Base/BaseIcon.vue";
import { chatStore } from "@/main.js";
import { mdiMenuRightOutline, mdiMenuLeftOutline } from "@mdi/js";
</script>
<template>
	<div class="flex flex-row flex-shrink-0 bg-gray-100 dark:bg-gray-900 p-4 absolute lg:relative h-full min-w-[256px] w-64 sm:w-80 md:w-96 transition-all duration-500 lg:duration-0 z-20" :class="[chatStore.collapsed ? '-left-64 sm:-left-80 md:-left-96 lg:-left-0' : '-left-0']">
		<div class="absolute top-0 -right-8 lg:hidden">
			<div class="w-8 h-8 flex justify-center items-center rounded-full" @click="chatStore.collapsed = !chatStore.collapsed">
				<BaseIcon class="hover:text-fipu_dark_blue hover:cursor-pointer" w="40" h="40" :size="36" :path="chatStore.collapsed ? mdiMenuRightOutline : mdiMenuLeftOutline"></BaseIcon>
			</div>
		</div>
		<div class="flex flex-col w-full h-full pl-1 lg:pl-4 pr-1 lg:pr-4 py-4 -mr-4">
			<ConversationsSearch />
			<ConversationsGroupsNavbar />
			<div v-if="chatStore.update" class="flxe flex-col">
				<ConversationItem v-for="c in chatStore.conversations" :conversation="c" :selected="chatStore.selectedConversationID == c.id" />
			</div>
			<AddConversationButton v-if="chatStore.update" />
		</div>
	</div>
</template>
