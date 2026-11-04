<template>
	<div class="flex min-h-screen w-full flex-col items-center justify-between bg-gray-50 transition-all duration-300 sm:justify-center sm:bg-gray-50/70 sm:bg-[url('/background-blue.jpg')] sm:bg-cover sm:bg-center">
		<!-- Mobile only heading -->
		<div class="flex flex-col items-center sm:flex-row sm:items-start md:hidden">
			<!-- Welcome texts -->
			<div class="mt-2 flex flex-col justify-start bg-gray-50">
				<h2 class="maintenance-zoom-in mb-2 text-6xl font-bold text-fipu_blue">FIPU</h2>
				<h2 class="maintenance-zoom-in mb-4 text-6xl font-bold text-fipu_blue">Praksa</h2>
				<h1 style="--entry-delay: 500ms" class="maintenance-zoom-in text-7xl font-bold">Održavanje</h1>
			</div>

			<!-- Illustration -->
			<div class="maintenance-fade-up flex justify-center" style="--entry-delay: 1000ms">
				<img src="/illustrations/robot.svg" class="mt-4 w-3/4 max-w-full" :class="{ 'bounce-6': isBouncing }" @click="startBounce" />
			</div>
		</div>

		<!-- Main content area -->
		<div class="flex w-full flex-1 flex-col items-center justify-center transition-all duration-300 sm:flex-none">
			<CardBox vertical-centered class="mx-0 flex w-full flex-col px-0 transition-all duration-300 sm:mx-6 sm:w-auto sm:flex-none sm:rounded-2xl sm:p-10 sm:pt-8 md:px-12 lg:mx-60 lg:p-12" is-form>
				<!-- Content area -->
				<div class="flex grow flex-col items-center">
					<!-- Logo, shown only on larger screens -->
					<a href="https://fipu.unipu.hr/" target="_blank" class="mx-auto hidden w-max sm:block">
						<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="mb-4 h-24 object-contain transition-all duration-300 lg:h-24" />
					</a>
					<hr class="hidden w-full sm:block" />
					<!-- Hide heading on mobile -->

					<div style="--entry-delay: 200ms" class="maintenance-zoom-in hidden sm:block">
						<h2 class="mb-4 mt-4 text-center text-2xl font-bold text-fipu_gray lg:text-4xl"><span class="text-fipu_blue">FIPU Praksa</span> je na redovitom održavanju!</h2>
					</div>
					<!-- Content paragraphs -->

					<div class="mx-auto mb-4 max-w-md p-2 py-4 text-center text-lg text-gray-600 sm:mb-5 sm:max-w-2xl sm:p-0 lg:text-lg">
						<p class="mb-4">{{ maintenanceMessage }}</p>
						<p class="text-base text-gray-500 sm:text-lg">Očekivano vrijeme završetka: {{ maintenanceExpectedCompletion }}</p>
					</div>

					<!-- Contact info -->
					<div class="mb-4 text-center">
						<p class="text-sm text-gray-500">
							Za hitne upite kontaktirajte:
							<br />
							<a href="mailto:ilorencin@unipu.hr" class="text-fipu_text_blue hover:text-fipu_blue">doc. dr. sc. Ivan Lorencin</a>
							<br />
							<a href="mailto:mmilicevi@unipu.hr" class="text-fipu_text_blue hover:text-fipu_blue">Marijela Miličević, mag. educ. inf.</a>
						</p>
					</div>

					<!-- Refresh button -->
					<div class="mb-4 mt-6">
						<BaseButton label="Osvježi stranicu" color="fipu_blue" class="px-6 py-2" @click="refreshPage" />
					</div>
				</div>
			</CardBox>
		</div>
		<hr class="block w-full sm:hidden" />

		<!-- Logo at the bottom, centered on mobile -->
		<div class="flex justify-center sm:hidden">
			<a href="https://fipu.unipu.hr/" target="_blank" class="w-max">
				<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="h-24 object-contain p-2" />
			</a>
		</div>

		<SnackBar />
	</div>
</template>

<script setup>
import BaseButton from "@/components/Base/BaseButton.vue";
import SnackBar from "@/components/Notification/SnackBar.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import fipu_unipu from "/fipu_unipu.png";
import { ref } from "vue";

const isBouncing = ref(false);
const startBounce = () => {
	isBouncing.value = true;
	setTimeout(() => {
		isBouncing.value = false;
	}, 2000);
};

const refreshPage = () => {
	window.location.reload();
};

const maintenanceMessage = "U tijeku su nadogradnja i pripreme za novu akademsku godinu 2026./2027.";
const maintenanceExpectedCompletion = "1. 11. 2026.";
</script>

<style scoped>
html,
body {
	overflow-y: auto;
}

@media (prefers-reduced-motion: no-preference) {
	.maintenance-zoom-in { --entry-transform: scale(0.9); }
	.maintenance-fade-up { --entry-transform: translateY(24px); }
	.maintenance-zoom-in,
	.maintenance-fade-up {
		animation: maintenance-enter 700ms ease-out var(--entry-delay, 0ms) both;
	}
}

@keyframes maintenance-enter {
	from { opacity: 0; transform: var(--entry-transform); }
	to { opacity: 1; transform: none; }
}

.bounce-6 {
	animation-name: bounce-6;
	animation-timing-function: ease;
	animation-duration: 2s;
	animation-iteration-count: infinite;
}

@media (prefers-reduced-motion: reduce) {
	.bounce-6 { animation: none; }
}

@keyframes bounce-6 {
	0% {
		transform: scale(1, 1) translateY(0);
	}
	10% {
		transform: scale(1.1, 0.9) translateY(0);
	}
	30% {
		transform: scale(0.9, 1.1) translateY(-100px);
	}
	50% {
		transform: scale(1.05, 0.95) translateY(0);
	}
	57% {
		transform: scale(1, 1) translateY(-7px);
	}
	64% {
		transform: scale(1, 1) translateY(0);
	}
	100% {
		transform: scale(1, 1) translateY(0);
	}
}
</style>
