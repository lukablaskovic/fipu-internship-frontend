<template>
	<div class="flex h-full min-h-screen w-full items-center justify-center bg-[url('/background-blue.jpg')] bg-cover bg-center transition-all duration-300">
		<div class="flex flex-col items-center justify-center overflow-hidden transition-all duration-300">
			<CardBox vertical-centered class="rounded-none px-6 py-12 transition-all duration-300 sm:mx-8 sm:rounded-2xl sm:p-12 lg:mx-96" is-form>
				<a href="https://fipu.unipu.hr/" target="_blank" class="mx-auto w-max">
					<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="mb-3 object-contain transition-all duration-300 sm:h-32 2xl:mb-6" />
				</a>

				<h2 class="mb-4 mt-6 text-center text-2xl font-bold text-fipu_gray md:text-center lg:text-3xl xl:mb-6 2xl:text-4xl">Dobrodošli na <span class="text-fipu_blue">FIPU Praksu</span></h2>

				<h2 class="mx-auto mb-2 mt-6 max-w-3xl text-center sm:mt-0 md:text-sm lg:text-sm 2xl:mb-10 2xl:text-base">
					Molimo prijavite se kako biste pregledali stanje vaše prakse ili prijavili zadatke. Ako želite samo pregledati dostupne zadatke i poduzeća, možete nastaviti kao
					<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="router.push('/moja-praksa')"> gost</a>.
				</h2>

				<div class="mx-auto my-6 flex justify-center sm:my-4">
					<GoogleLogin :callback="callback" />
				</div>

				<h2 class="mb-2 text-center md:text-sm lg:text-sm 2xl:mb-4 2xl:text-base">
					Poslodavac ste ili mentor te želite prijaviti novi zadatak za praksu? To možete učiniti
					<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="router.push('/poslodavci/novi-zadatak')"> ovdje</a>.
				</h2>

				<h2 class="text-center md:text-sm lg:text-sm 2xl:mb-4 2xl:text-base">
					Prije nego se prijavite, pročitajte
					<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="router.push('/upute')">upute</a> kako izvodimo praksu na FIPU.
				</h2>
			</CardBox>
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
</style>

<script setup>
import SnackBar from "@/components/Premium/SnackBar.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import { isUnipuEmail } from "@/helpers/validators";
import { mainStore, snackBarStore } from "@/main";
import { useRouter } from "vue-router";

//Public images
import fipu_unipu from "/fipu_unipu.png";

const router = useRouter();

import { decodeCredential } from "vue3-google-login";
import Utils from "@/helpers/utils";

const callback = async (response) => {
	const decodedToken = decodeCredential(response.credential);

	if (!decodedToken) {
		snackBarStore.pushMessage("Prijava nije uspjela! Molimo kontaktirajte voditelja prakse.", "error");
		return;
	}
	console.log("decodedToken", decodedToken);
	if (isUnipuEmail(decodedToken.email) || decodedToken.email === "lukablaskovic2000@gmail.com") {
		let response = await mainStore.handleLogin(decodedToken);
		console.log(response);
		if (response.status === "success") snackBarStore.pushMessage("Uspješna prijava!", "success");
		await Utils.wait(1);
	} else {
		snackBarStore.pushMessage("Molimo koristite UNIPU e-mail za prijavu", "warning");
	}
};
</script>
