<template>
	<div class="flex min-h-screen w-full flex-col items-center justify-between bg-gray-50 transition-all duration-300 sm:justify-center sm:bg-opacity-70 sm:bg-[url('/background-blue.jpg')] sm:bg-cover sm:bg-center">
		<!-- Mobile only heading -->
		<div class="flex flex-col sm:flex-row sm:items-start md:hidden">
			<!-- Welcome texts -->
			<div class="mt-2 flex flex-col justify-start bg-gray-50">
				<h2 data-aos="zoom-in" class="mb-2 text-6xl font-bold text-fipu_gray">Dobrodošli</h2>
				<h2 data-aos="zoom-in" class="mb-4 text-6xl font-bold text-fipu_gray">na</h2>
				<h1 data-aos="zoom-in" data-aos-delay="500" class="text-7xl font-bold text-fipu_blue">FIPU</h1>
				<h1 data-aos="zoom-in" data-aos-delay="500" class="text-7xl font-bold text-fipu_blue">Praksu</h1>
			</div>

			<!-- Illustration -->
			<div class="" data-aos="fade-up" data-aos-delay="1000">
				<img src="/illustrations/small_character_illustrations.svg" class="mt-4 w-3/4 max-w-full" :class="{ 'bounce-6': isBouncing }" @click="startBounce" />
			</div>
		</div>

		<!-- Main content area -->

		<div class="flex w-full flex-1 flex-col items-center justify-center transition-all duration-300 sm:flex-none">
			<CardBox vertical-centered class="mx-0 flex w-full flex-col px-0 transition-all duration-300 sm:mx-6 sm:w-auto sm:flex-none sm:rounded-2xl sm:p-10 sm:pt-8 md:px-12 lg:mx-60 lg:p-12" is-form>
				<!-- Content area -->
				<div class="flex flex-grow flex-col items-center">
					<!-- Logo, shown only on larger screens -->
					<a href="https://fipu.unipu.hr/" target="_blank" class="mx-auto hidden w-max sm:block">
						<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="mb-4 h-24 object-contain transition-all duration-300 lg:h-24" />
					</a>
					<hr class="hidden w-full sm:block" />
					<!-- Hide heading on mobile -->

					<div data-aos="zoom-in" data-aos-delay="200" class="hidden sm:block">
						<h2 class="mb-4 mt-4 text-center text-2xl font-bold text-fipu_gray lg:text-4xl">Dobrodošli na <span class="text-fipu_blue">FIPU Praksu</span></h2>
					</div>
					<!-- Content paragraphs -->

					<p class="mx-auto mb-4 max-w-md p-2 py-8 text-center text-lg text-gray-600 sm:mb-5 sm:max-w-2xl sm:p-0 lg:text-lg">Prijavite se kako biste pregledali stanje vaše prakse ili prijavili zadatke.</p>

					<div class="mb-4 flex w-full justify-center sm:my-6">
						<GoogleLogin :callback="callback" />
					</div>

					<p class="mx-auto mb-4 max-w-md text-center text-lg font-light text-gray-600 sm:mb-5 sm:max-w-2xl sm:p-0 lg:text-lg">
						Ako želite samo pregledati dostupne zadatke i poduzeća, možete nastaviti kao <a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="router.push('/moja-praksa')"> gost. </a>
					</p>

					<p class="mb-0 p-2 text-left text-center text-lg font-light text-gray-600 sm:mb-3 sm:p-0 lg:text-lg">
						Poslodavac ste ili mentor te želite prijaviti novi zadatak za praksu? To možete učiniti
						<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="router.push('/poslodavci/novi-zadatak')"> ovdje. </a>
					</p>

					<p class="mb-0 p-2 text-left text-center text-lg font-medium text-gray-600 sm:mb-0 sm:p-0 lg:text-lg">
						Prije nego se prijavite, pročitajte
						<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="router.push('/upute')"> upute </a>
						kako izvodimo praksu na FIPU.
					</p>
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

.bounce-6 {
	animation-name: bounce-6;
	animation-timing-function: ease;
	animation-duration: 2s;
	animation-iteration-count: infinite;
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

<script setup>
import SnackBar from "@/components/Premium/SnackBar.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import FIPU_praksa_logo from "/FIPU_praksa_logo.svg";
import { decodeCredential } from "vue3-google-login";
import { isUnipuEmail } from "@/helpers/validators";
import { mainStore, snackBarStore } from "@/main";
import fipu_unipu from "/fipu_unipu.png";
import { useRouter } from "vue-router";
import Utils from "@/helpers/utils";
import { onMounted } from "vue";
import { ref } from "vue";
import AOS from "aos";

onMounted(() => {
	AOS.init();
});

const router = useRouter();

const isBouncing = ref(false);
const startBounce = () => {
	isBouncing.value = true;

	setTimeout(() => {
		isBouncing.value = false;
	}, 2000);
};

const callback = async (response) => {
	const decodedToken = decodeCredential(response.credential);

	if (!decodedToken) {
		snackBarStore.pushMessage("Prijava nije uspjela! Molimo kontaktirajte voditelja prakse.", "error");
		return;
	}
	if (isUnipuEmail(decodedToken.email) || decodedToken.email === "lukablaskovic2000@gmail.com") {
		let response = await mainStore.handleLogin(decodedToken);
		let ime = decodedToken.given_name || "";
		let prezime = decodedToken.family_name || "";

		if (response.status === "success") snackBarStore.pushMessage(`Dobrodošli, ${ime} ${prezime}!`, "success");
		await Utils.wait(1);
	} else {
		snackBarStore.pushMessage("Molimo koristite UNIPU e-mail za prijavu", "warning");
	}
};
</script>
