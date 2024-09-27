<script setup>
import CardBox from "@/components/Cardbox/CardBox.vue";
//Public images
import fipu_unipu from "/fipu_unipu.png";
import { useRouter } from "vue-router";
import { mainStore } from "@/main";

const router = useRouter();
import { googleLogout } from "vue3-google-login";

const logout = () => {
	googleLogout();
	router.push("/prijava");
};

const selectProcess = async (process) => {
	let response = await mainStore.createInternshipInstance(process);
	router.push("/moja-praksa");
};
</script>

<template>
	<div class="flex h-full min-h-screen w-full items-center justify-center bg-white bg-cover bg-center transition-all duration-300 sm:bg-[url('/background-blue.jpg')]">
		<div class="|| flex flex-col items-center justify-center overflow-hidden transition-all duration-300">
			<CardBox vertical-centered class="p-12 transition-all duration-300 sm:mx-96 sm:rounded-2xl" is-form>
				<a href="https://fipu.unipu.hr/" target="_blank" class="mx-auto w-max">
					<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="mb-3 object-contain transition-all duration-300 sm:h-32 2xl:mb-6" />
				</a>

				<h2 class="mb-4 mt-6 text-2xl font-bold text-fipu_gray md:text-center lg:text-3xl xl:mb-6 2xl:text-4xl">Molimo odaberite vašu izvedbu stručne prakse</h2>

				<div class="flex justify-center space-x-4">
					<button class="flex items-center justify-center border border-gray-300 px-24 py-24 text-xl font-semibold text-gray-700 hover:bg-fipu_light_blue" @click.prevent="selectProcess('A')">Nemam poduzeće</button>
					<button class="flex items-center justify-center border border-gray-300 px-24 py-24 text-xl font-semibold text-gray-800 hover:bg-fipu_light_blue" @click.prevent="selectProcess('B')">Imam već dogovoreno</button>
				</div>

				<h2 class="mt-4 text-center text-sm">
					Povratak na
					<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="logout"> prijavu</a>.
				</h2>
			</CardBox>
		</div>
	</div>
</template>

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
</style>
