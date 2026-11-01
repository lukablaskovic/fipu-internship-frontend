<template>
	<div class="login-page">
		<main class="login-panel">
			<header class="login-header">
				<a href="https://fipu.unipu.hr/" target="_blank" rel="noopener noreferrer" aria-label="Fakultet informatike u Puli (otvara se u novoj kartici)">
					<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="faculty-logo" />
				</a>
				<div class="flex items-center gap-4">
					<RouterLink to="/upute" class="help-link">Upute za praksu <span aria-hidden="true">↗</span></RouterLink>
					<ThemeToggle />
				</div>
			</header>

			<div class="login-content">
				<section class="welcome" aria-labelledby="welcome-title">
					<div class="welcome-heading">
						<img src="/fipu-praksa-logo.png" alt="FIPU Praksa" class="praksa-logo" width="512" height="512" />
						<h1 id="welcome-title">Dobrodošli na <span>FIPU Praksu</span></h1>
					</div>
					<p>Prijavite se kako biste pregledali stanje vaše prakse ili prijavili zadatke.</p>
					<button type="button" class="illustration-button" aria-label="Animiraj ilustraciju" @click="startBounce">
						<img src="/illustrations/small_character_illustrations.svg" alt="" :class="{ 'bounce-6': isBouncing }" width="280" height="160" />
					</button>
				</section>

				<section class="login-actions" aria-labelledby="login-title">
					<h2 id="login-title">Prijava</h2>
					<p class="login-note">Prije nego se prijavite, pročitajte <RouterLink to="/upute">upute</RouterLink> kako izvodimo praksu na FIPU.</p>
					<div class="sign-in">
						<div v-if="LOCAL_DEV" class="flex flex-col gap-3">
							<BaseButton label="Lokalni student" color="info" type="button" @click="localLogin('student')" />
							<BaseButton label="Lokalni administrator" color="info" type="button" @click="localLogin('admin')" />
						</div>
						<GoogleLogin v-else :callback="loginCallback" />
					</div>
					<div class="guest-access">
						<p>Ako želite samo pregledati dostupne zadatke i poduzeća, možete nastaviti kao gost.</p>
						<RouterLink to="/moja-praksa" class="guest-link">Nastavi kao gost <span aria-hidden="true">→</span></RouterLink>
					</div>
				</section>
			</div>

			<footer class="login-footer">
				<p>Poslodavac ste ili mentor te želite prijaviti novi zadatak za praksu?</p>
				<RouterLink to="/poslodavci/novi-zadatak">Prijavite zadatak <span aria-hidden="true">→</span></RouterLink>
			</footer>
		</main>
		<FormCheckRadio v-if="DEV_MODE" class="fixed bottom-4 right-4 z-50 text-white" name="dev-data-mode" type="switch" :label="LOCAL_DEV ? 'Mock data' : 'Real data'" :model-value="LOCAL_DEV" @update:model-value="switchDataMode" />
		<SnackBar />
	</div>
</template>

<script setup>
import { decodeCredential, GoogleLogin } from "vue3-google-login";
import BaseButton from "@/components/Base/BaseButton.vue";
import ThemeToggle from "@/components/Navbar/ThemeToggle.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import SnackBar from "@/components/Premium/SnackBar.vue";
import { isUnipuEmail } from "@/helpers/validators";
import { useMainStore } from "@/stores/main_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

import fipu_unipu from "/fipu_unipu.png";
import { useRouter } from "vue-router";
import { DEV_MODE, LOCAL_DEV, setLocalDevelopment } from "@/config";

import { ref } from "vue";

const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();

const router = useRouter();

const switchDataMode = (enabled) => {
	try {
		setLocalDevelopment(enabled);
	} catch {
		snackBarStore.pushMessage("Promjena načina rada nije uspjela. Omogućite pohranu u pregledniku.", "error");
	}
};

const localLogin = async (role) => {
	if (!LOCAL_DEV) return;
	const result = await mainStore.handleLogin({ email: `${role}@local.test`, given_name: "Demo", family_name: role, picture: "" });
	if (result.status === "success") {
		window.location.href = "/";
	} else {
		snackBarStore.pushMessage("Lokalna prijava nije uspjela. Provjerite lokalne servise.", "error");
	}
};

const isBouncing = ref(false);
const startBounce = () => {
	isBouncing.value = true;

	setTimeout(() => {
		isBouncing.value = false;
	}, 2000);
};

const loginCallback = async (response) => {
	try {
		const decodedToken = decodeCredential(response.credential);

		if (!decodedToken) {
			snackBarStore.pushMessage("Prijava nije uspjela! Molimo kontaktirajte voditelja prakse.", "error");
			return;
		}
		if (isUnipuEmail(decodedToken.email) || decodedToken.email === "lukablaskovic2000@gmail.com") {
			const result = await mainStore.handleLogin(decodedToken, response.credential);
			if (result.status === "success") {
				const ime = decodedToken.given_name || "";
				const prezime = decodedToken.family_name || "";
				snackBarStore.pushMessage(`Dobrodošli, ${ime} ${prezime}!`, "success");

				// Add a small delay to allow browser state to settle before reload
				await new Promise((resolve) => setTimeout(resolve, 500));

				window.location.href = router.currentRoute.value.fullPath;
			} else {
				snackBarStore.pushMessage("Prijava nije uspjela! Molimo pokušajte ponovno.", "error");
			}
		} else {
			snackBarStore.pushMessage("Molimo koristite UNIPU e-mail za prijavu", "warning");
		}
	} catch (error) {
		console.error("Login error:", error);
		snackBarStore.pushMessage("Prijava nije uspjela! Molimo pokušajte ponovno.", "error");
	}
};
</script>

<style scoped>
.login-page {
	position: relative;
	isolation: isolate;
	min-height: 100vh;
	min-height: 100svh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 48px 24px;
	background: theme("colors.fipu_blue") url("/background-blue.jpg") center / cover;
	color: #212529;
}
.login-page::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	backdrop-filter: blur(6px);
	pointer-events: none;
}
.login-panel {
	width: 100%;
	max-width: 1040px;
	overflow: hidden;
	border-radius: 16px;
	background: white;
	box-shadow: 0 20px 60px -24px rgb(23 34 52 / 22%);
}
.login-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
	padding: 16px 40px;
	border-bottom: 1px solid #e5e7eb;
}
.faculty-logo {
	width: 240px;
	max-width: 100%;
	height: auto;
}
.login-page a {
	color: theme("colors.fipu_blue");
	text-underline-offset: 4px;
}
.login-page a:hover {
	text-decoration: underline;
}
.login-page :is(a, button):focus-visible {
	outline: 3px solid theme("colors.fipu_blue");
	outline-offset: 5px;
}
.login-page ::selection {
	background: theme("colors.fipu_light_blue");
	color: #172234;
}
.help-link {
	flex-shrink: 0;
	font-size: 14px;
	font-weight: 600;
	padding: 12px 0;
}
.login-content {
	display: grid;
	grid-template-columns: 1.15fr 1fr;
}
.welcome {
	padding: 48px 40px 32px;
	background: #f9fafb;
}
.welcome-heading {
	display: flex;
	align-items: center;
	gap: 16px;
}
.praksa-logo {
	width: clamp(64px, 8vw, 96px);
	height: auto;
	flex-shrink: 0;
}
h1 {
	flex: 1;
	min-width: 0;
	font-size: clamp(28px, 3.3vw, 42px);
	line-height: 1.15;
	font-weight: 700;
	letter-spacing: -0.03em;
	text-wrap: balance;
}
h1 span {
	display: block;
	color: theme("colors.fipu_blue");
}
.welcome p {
	margin-top: 20px;
	max-width: 36ch;
	color: #4b5563;
	line-height: 1.7;
}
.illustration-button {
	display: block;
	margin-top: 28px;
	border-radius: 8px;
}
.illustration-button img {
	width: 240px;
	height: 138px;
	object-fit: contain;
}
.login-actions {
	padding: 48px 40px;
	align-self: center;
}
h2 {
	font-size: 24px;
	font-weight: 600;
	letter-spacing: -0.02em;
}
.sign-in {
	margin: 24px 0 28px;
}
.sign-in :deep(button) {
	min-height: 44px;
}
.guest-access {
	border-top: 1px solid #e5e7eb;
	padding-top: 24px;
}
.guest-access p {
	color: #4b5563;
	font-size: 15px;
	line-height: 1.7;
}
.guest-link {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 48px;
	margin-top: 16px;
	padding: 10px 16px;
	border: 1px solid theme("colors.fipu_blue");
	border-radius: 8px;
	font-weight: 600;
}
.guest-link:hover {
	background: #f9fafb;
}
.login-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
	padding: 24px 40px;
	border-top: 1px solid #e5e7eb;
	font-size: 14px;
}
.login-footer p {
	max-width: 54ch;
	color: #4b5563;
	line-height: 1.6;
}
.login-footer a {
	color: theme("colors.fipu_blue");
	flex-shrink: 0;
	padding: 10px 0;
	font-weight: 600;
}
.login-note {
	margin-top: 12px;
	text-align: left;
	font-size: 13px;
	line-height: 1.7;
	color: #212529;
}
.login-note a {
	color: #212529;
	text-decoration: underline;
}
.bounce-6 {
	animation: bounce 600ms ease-out;
}
@keyframes bounce {
	40% {
		transform: translateY(-16px);
	}
	70% {
		transform: translateY(-4px);
	}
}
@media (prefers-reduced-motion: reduce) {
	.bounce-6 {
		animation: none;
	}
}
@media (max-width: 1024px) {
	.login-page {
		justify-content: flex-start;
		padding: 32px 24px;
		background: white;
	}
	.login-panel {
		max-width: 640px;
		border-radius: 0;
		box-shadow: none;
	}
	.login-header {
		padding: 0 0 16px;
		gap: 16px;
	}
	.faculty-logo {
		width: 220px;
	}
	.login-content {
		grid-template-columns: 1fr;
	}
	.welcome {
		padding: 32px 0 24px;
		background: transparent;
	}
	.welcome p {
		max-width: none;
		margin-top: 20px;
	}
	.illustration-button {
		display: none;
	}
	.login-actions {
		padding: 8px 0 28px;
	}
	.sign-in {
		margin: 20px 0 24px;
	}
	.login-footer {
		align-items: flex-start;
		flex-direction: column;
		gap: 4px;
		padding: 24px 0 0;
	}
	.login-note {
		width: 100%;
		max-width: 640px;
		color: #4b5563;
	}
}
@media (max-width: 640px) {
	.login-page {
		padding: 24px 20px;
	}
	.login-header {
		padding-bottom: 16px;
	}
	.faculty-logo {
		width: 200px;
	}
	.help-link {
		display: none;
	}
	.welcome {
		padding-top: 28px;
	}
	.welcome-heading {
		gap: 12px;
	}
	.praksa-logo {
		width: 64px;
	}
	h1 {
		font-size: clamp(24px, 6.5vw, 32px);
	}
}
.dark .login-page {
	background: #0f172a;
	color: #f1f5f9;
}
.dark .login-panel {
	background: #1e293b;
}
.dark .welcome {
	background: #172234;
}
.dark .login-header,
.dark .guest-access,
.dark .login-footer {
	border-color: #475569;
}
.dark .welcome p,
.dark .guest-access p,
.dark .login-footer p,
.dark .login-note,
.dark .login-note a {
	color: #cbd5e1;
}
.dark .guest-link:hover {
	background: #334155;
}
.dark .faculty-logo {
	background: white;
	border-radius: 4px;
}
@media (max-width: 1024px) {
	.dark .login-panel,
	.dark .welcome {
		background: transparent;
	}
}
</style>
