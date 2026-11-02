import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import App from "./App.vue";
import "aos/dist/aos.css";
import "./css/main.css";
import "animate.css";

import { useUiStore } from "@/stores/ui_store";
import { darkModeKey, LOCAL_DEV } from "@/config.js";

import NotificationBar from "@/components/Notification/NotificationBar.vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import vue3GoogleLogin from "vue3-google-login";

/* Init Pinia */
const pinia = createPinia();
/* Init Pinia Persisted state plugin */
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.component("NotificationBar", NotificationBar);
app.use(pinia);

if (!LOCAL_DEV) {
	app.use(vue3GoogleLogin, {
		clientId: "182844940133-k5k1t08dposga8083n6nek2r4gjo9a7l.apps.googleusercontent.com",
	});
}

const uiStore = useUiStore(pinia);
uiStore.responsiveLayoutControl();

let darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
try {
	const savedTheme = localStorage.getItem(darkModeKey);
	if (savedTheme === "1" || savedTheme === "0") darkMode = savedTheme === "1";
} catch {
	// Use the device preference when browser storage is unavailable.
}
uiStore.setDarkMode(darkMode, false);

app.use(router);

const mountPoint = document.querySelector("#app");
if (mountPoint && mountPoint.__vue_app__ !== undefined) {
	// App is already mounted, no need to mount again
} else {
	app.mount("#app");
}

/* Responsive layout control */
window.onresize = () => uiStore.responsiveLayoutControl();

/* Default title tag */
const defaultDocumentTitle = "FIPU Praksa";

/* Set document title from route meta */
router.afterEach((to) => {
	document.title = to.meta?.title ? `${to.meta.title} — ${defaultDocumentTitle}` : defaultDocumentTitle;
});
