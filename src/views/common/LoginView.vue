<template>
	<div class="login-page">
		<main class="login-panel">
			<header class="login-header">
				<a class="faculty-header-link" href="https://fipu.unipu.hr/" target="_blank" rel="noopener noreferrer" aria-label="Fakultet informatike u Puli (otvara se u novoj kartici)">
					<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="faculty-logo" />
				</a>
				<div class="login-resources flex flex-wrap items-center gap-x-4">
					<RouterLink to="/upute" class="help-link">Upute za praksu <span aria-hidden="true">↗</span></RouterLink>
					<a href="https://chat.google.com/room/AAAASZREDy8?cls=7" target="_blank" rel="noopener noreferrer" class="help-link inline-flex items-center gap-2" aria-label="Google Chat (otvara se u novoj kartici)">
						Google Chat <span aria-hidden="true">↗</span>
					</a>
					<a href="https://drive.google.com/file/d/13BKZekCS6FwdlKfTlTLyCKB6tkNjZLIe/view?usp=sharing" target="_blank" rel="noopener noreferrer" class="help-link inline-flex items-center gap-2" aria-label="Silabus (otvara se u novoj kartici)">
						Silabus <span aria-hidden="true">↗</span>
					</a>
				</div>
			</header>

			<div class="login-content">
				<section class="welcome relative" aria-labelledby="welcome-title">
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
					<div ref="signIn" class="sign-in flex flex-col items-start gap-3">
						<GoogleLogin :key="`${uiStore.darkMode}-${googleButtonWidth}`" :callback="loginCallback" :button-config="{ theme: uiStore.darkMode ? 'filled_black' : 'outline', size: 'large', ...(googleButtonWidth && { width: googleButtonWidth }) }" />
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
		<a class="faculty-footer-link" href="https://fipu.unipu.hr/" target="_blank" rel="noopener noreferrer" aria-label="Fakultet informatike u Puli (otvara se u novoj kartici)">
			<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="faculty-logo" />
		</a>
	</div>
</template>

<script setup>
import { decodeCredential, GoogleLogin } from "vue3-google-login";
import { useMainStore } from "@/stores/main_store";
import { useUiStore } from "@/stores/ui_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

import fipu_unipu from "/fipu_unipu.png";

import { onMounted, onUnmounted, ref } from "vue";

const uiStore = useUiStore();
const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();


const signIn = ref(null);
const googleButtonWidth = ref();
let buttonObserver;
onMounted(() => {
	// Google reads its iframe width in pixels when the button mounts.
	buttonObserver = new ResizeObserver(([entry]) => {
		googleButtonWidth.value = window.matchMedia("(max-width: 640px)").matches ? Math.min(400, Math.floor(entry.contentRect.width)) : undefined;
	});
	buttonObserver.observe(signIn.value);
});
onUnmounted(() => buttonObserver.disconnect());

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
		const result = await mainStore.handleLogin(decodedToken, response.credential);
		if (result.status === "success") {
			const ime = decodedToken.given_name || "";
			const prezime = decodedToken.family_name || "";
			snackBarStore.pushMessage(`Dobrodošli, ${ime} ${prezime}!`, "success");
		} else {
			snackBarStore.pushMessage("Prijava nije uspjela. Koristite sveučilišni račun ili se obratite voditelju prakse.", "error");
		}
	} catch (error) {
		console.error("Login error:", error);
		snackBarStore.pushMessage("Prijava nije uspjela. Koristite sveučilišni račun ili se obratite voditelju prakse.", "error");
	}
};
</script>

<style scoped>
@reference "../../css/main.css";
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
.sign-in :deep(.g-btn-wrapper) {
	/* Match Google’s iframe canvas scheme to keep its background transparent. */
	color-scheme: light;
}
.sign-in :deep(button) {
	min-height: 44px;
}
.guest-access {
	border-top: 1px solid #e5e7eb;
	padding-top: 24px;
}
.login-note,
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
}
.login-note a {
	color: inherit;
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
.dark .login-note {
	color: #cbd5e1;
}
.dark .guest-link:hover {
	background: #334155;
}
.dark .faculty-logo {
	filter: brightness(0) invert(1);
}
@media (max-width: 1024px) {
	.dark .login-panel,
	.dark .welcome {
		background: transparent;
	}
}
.faculty-footer-link {
	display: none;
}
@media (max-width: 640px) {
	.faculty-header-link {
		display: none;
	}
	.faculty-footer-link {
		display: grid;
		place-items: center;
		flex: 1;
		padding: 20px 0;
	}
	.login-page {
		--brand-blue: theme("colors.fipu_blue");
		--surface: white;
		--hero-bg: color-mix(in srgb, var(--brand-blue) 16%, var(--surface));
		--footer-bg: color-mix(in srgb, var(--brand-blue) 9%, var(--surface));
		--guest-bg: color-mix(in srgb, var(--brand-blue) 22%, var(--surface));
		--action-color: color-mix(in srgb, var(--brand-blue) 56%, black);
		padding: 0;
	}
	.dark .login-page {
		--surface: #0f172a;
		--action-color: var(--brand-blue);
	}
	.login-header {
		position: relative;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0 16px;
		padding: 12px 16px 4px;
	}
	.login-resources {
		justify-content: center;
		column-gap: 8px;
	}
	.faculty-logo {
		width: min(78vw, 320px);
	}
	.login-content {
		grid-template-columns: minmax(0, 1fr);
	}
	.login-content,
	.login-footer {
		text-align: center;
	}
	.welcome,
	.dark .welcome {
		padding: 38px 24px 28px;
		background-color: var(--hero-bg);
	}
	.welcome-heading {
		flex-direction: column;
		gap: 14px;
	}
	.praksa-logo {
		width: 88px;
	}
	h1 {
		font-size: clamp(30px, 8vw, 38px);
	}
	.welcome p,
	.login-note,
	.guest-access p,
	.login-footer p {
		line-height: 1.5;
		text-wrap: balance;
	}
	.welcome p {
		max-width: 36ch;
		margin: 16px auto 0;
	}
	.login-actions {
		width: 100%;
		max-width: 448px;
		margin: auto;
		padding: 32px 24px 24px;
	}
	h2 {
		font-size: 28px;
	}
	.login-footer {
		font-size: 15px;
	}
	.sign-in,
	.login-footer {
		align-items: center;
	}
	.login-page .guest-link {
		justify-content: center;
		gap: 8px;
		background: var(--guest-bg);
		color: var(--action-color);
		border-color: transparent;
	}
	.login-footer {
		padding: 22px 24px 16px;
		background: var(--footer-bg);
	}
	.login-footer a {
		color: var(--action-color);
	}
}
</style>
