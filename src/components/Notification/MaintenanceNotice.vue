<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";

import BaseButton from "@/components/Base/BaseButton.vue";

const route = useRoute();
const noticeDismissed = ref(false);
</script>

<template>
	<Dialog :open="!!route.name && route.name !== 'dodavanje zadatka' && !noticeDismissed" class="relative z-[6000]" @close="noticeDismissed = true">
		<div class="fixed inset-0 bg-black/50" aria-hidden="true"></div>
		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<DialogPanel class="w-full max-w-lg rounded-lg bg-white p-6 text-gray-900 shadow-xl">
					<DialogTitle class="text-xl font-semibold">Obavijest o nedostupnosti</DialogTitle>
					<DialogDescription class="mt-4 leading-relaxed">FIPU Praksa neće biti dostupna u razdoblju od <strong>15.10.2026.</strong> do <strong>1.11.2026.</strong> radi nadogradnje i pripreme za novu akademsku godinu 2026./2027.</DialogDescription>
					<p class="mt-4 leading-relaxed">Za sve informacije javite se na <a href="https://chat.google.com/room/AAAASZREDy8?cls=7" target="_blank" rel="noopener noreferrer" class="font-semibold underline underline-offset-2">Google Chat</a>.</p>
					<div class="mt-6 flex justify-end">
						<BaseButton label="U redu" color="fipu_blue" @click="noticeDismissed = true" />
					</div>
				</DialogPanel>
			</div>
		</div>
	</Dialog>
</template>
