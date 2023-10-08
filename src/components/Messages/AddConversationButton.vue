<script setup>
import { ref } from "vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiPlus } from "@mdi/js";
import { chatStore } from "@/main.js";
const selectedOption = ref(null);
</script>
<template>
	<div class="h-full relative pt-2" :class="options.length == 0 ? 'opacity-40 pointer-events-none ' : ''">
		<div class="absolute bottom-0 right-0 lg:ml-0 lg:mr-2 flex items-center justify-center gap-2 w-full">
			<select v-model="selectedOption" class="border-none bg-transparent focus:outline-none text-sm items-center w-full border text-fipu_gray dark:text-gray-300 bg-white hover:bg-gray-50 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-700/40 dark:focus:bg-slate-800 rounded-3xl">
				<option v-for="u in options" :value="u.id">
					{{ u.ime + " " + u.prezime }}
				</option>
			</select>
			<button :class="selectedOption == null ? 'bg-fipu_blue/50 cursor-not-allowed' : 'bg-fipu_dark_blue hover:bg-fipu_blue dark:hover:bg-fipu_blue'" @click="selectedOption != null ? chatStore.addConversation(selectedOption) : ''" class="flex items-center justify-center shadow-sm min-w-[40px] h-[40px] w-[40px] drop-shadow text-white rounded-full">
				<BaseIcon :path="mdiPlus" :size="20"></BaseIcon>
			</button>
		</div>
	</div>
</template>

<script>
import { chatStore } from "@/main.js";

export default {
	data() {
		return {
			selectedOption: null,
			options: [],
		};
	},
	async mounted() {
		this.options = await chatStore.getUsersWithoutConversations();
	},
};
</script>
