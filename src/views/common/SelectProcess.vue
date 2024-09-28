<template>
	<div class="flex h-full min-h-screen w-full items-center justify-center bg-white bg-cover bg-center transition-all duration-300 sm:bg-[url('/background-blue.jpg')]">
		<div class="flex flex-col items-center justify-center overflow-hidden transition-all duration-300">
			<CardBox vertical-centered class="p-12 transition-all duration-300 sm:mx-96 sm:rounded-2xl" is-form>
				<a href="https://fipu.unipu.hr/" target="_blank" class="mx-auto w-max">
					<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="mb-3 object-contain transition-all duration-300 sm:h-32 2xl:mb-6" />
				</a>

				<h2 class="mb-4 mt-6 text-2xl font-bold text-fipu_gray md:text-center lg:text-3xl xl:mb-6 2xl:text-4xl">Molimo odaberite vašu izvedbu stručne prakse</h2>

				<div class="flex justify-center space-x-4">
					<!-- Button 1: Nemam poduzeće -->
					<button class="relative flex items-center justify-center border border-gray-300 px-24 py-24 text-xl font-semibold text-gray-700 transition-transform duration-300 hover:scale-105 hover:bg-gray-200" @click.prevent="selectProcess('A')" @mouseover="hoveredButton = 'A'" @mouseleave="hoveredButton = ''">
						<!-- Button Text -->
						<span :class="{ 'opacity-0': hoveredButton === 'A', 'transition-opacity': true }">Nemam poduzeće (Model A)</span>
						<!-- Bullet points on hover for Button A -->
						<div v-if="hoveredButton === 'A'" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 text-white transition-opacity duration-300">
							<ul class="space-y-2 text-left">
								<li v-for="(text, index) in hoverTexts.A" :key="index">{{ text }}</li>
							</ul>
						</div>
					</button>

					<!-- Button 2: Imam već dogovoreno -->
					<button class="relative flex items-center justify-center border border-gray-300 px-24 py-24 text-xl font-semibold text-gray-800 transition-transform duration-300 hover:scale-105 hover:bg-gray-200" @click.prevent="selectProcess('B')" @mouseover="hoveredButton = 'B'" @mouseleave="hoveredButton = ''">
						<!-- Button Text -->
						<span :class="{ 'opacity-0': hoveredButton === 'B', 'transition-opacity': true }">Imam već dogovoreno (Model B)</span>
						<!-- Bullet points on hover for Button B -->
						<div v-if="hoveredButton === 'B'" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 text-white transition-opacity duration-300">
							<ul class="list-disc space-y-2 text-left">
								<li v-for="(text, index) in hoverTexts.B" :key="index">{{ text }}</li>
							</ul>
						</div>
					</button>
				</div>

				<h2 class="mt-4 text-center text-sm">
					Povratak na
					<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="logout">prijavu</a>.
				</h2>
			</CardBox>
		</div>
	</div>
</template>

<script setup>
import CardBox from "@/components/Cardbox/CardBox.vue";
// Public images
import fipu_unipu from "/fipu_unipu.png";
import { useRouter } from "vue-router";
import { mainStore } from "@/main";
import { ref } from "vue";

const router = useRouter();
import { googleLogout } from "vue3-google-login";

const logout = () => {
	googleLogout();
	mainStore.logout();
};

const selectProcess = async (process) => {
	let response = await mainStore.createInternshipInstance(process);
	router.push("/moja-praksa");
};

// Data for bullet points for each button
const hoverTexts = {
	A: ["1️⃣Pogledajte dostupne zadatke", "2️⃣Prijavite se na 3 najdraža zadatka", "3️⃣Pričekajte alokaciju"],
	B: ["Model B ide u dogovoru s nastavnikom", "Praksa već dogovorena ili odrađena", "Potrebno prijaviti zadatak"],
};

const hoveredButton = ref(""); // Track which button is hovered
</script>

<style scoped>
html,
body {
	overflow-y: auto;
}

.fast-animation {
	animation-duration: 0.5s;
}

.hover-underline-animation {
	position: relative;
}

.hover-underline-animation:after {
	content: "";
	position: absolute;
	width: 100%;
	transform: scaleX(0);
	height: 2px;
	bottom: 0;
	left: 0;
	background-color: #9de0f7;
	transform-origin: bottom right;
	transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover:after {
	transform: scaleX(1);
	transform-origin: bottom left;
}

button span.opacity-0 {
	opacity: 0;
}
button span.transition-opacity {
	transition: opacity 0.3s ease;
}
</style>
