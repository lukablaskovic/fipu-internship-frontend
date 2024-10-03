//import Bugsnag from "@bugsnag/js";
//import BugsnagPluginVue from "@bugsnag/plugin-vue";

import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import App from "./App.vue";
import "./css/main.css";
import "animate.css";

/* Pinia global stores */
import { useSnackBarStore } from "@/stores/snackbar_store.ts";
import { useStudentStore } from "@/stores/student_store.ts";
import { useLayoutStore } from "@/stores/layout_store.ts";
import { useStyleStore } from "@/stores/style_store.ts";
import { useAdminStore } from "@/stores/admin_store.ts";
import { useMainStore } from "@/stores/main_store.ts";

import { darkModeKey, styleKey } from "@/config.js";

import NotificationBar from "@/components/Notification/NotificationBar.vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import vue3GoogleLogin from "vue3-google-login";

// Initialize Bugsnag
/*
Bugsnag.start({
	apiKey: "7c2118391f2ecf5b781d78e4920b1478",
	plugins: [new BugsnagPluginVue()],
});
*/

/* Init Pinia */
const pinia = createPinia();
/* Init Pinia Persisted state plugin */
pinia.use(piniaPluginPersistedstate);
pinia.use(({ store }) => {
	store.router = markRaw(router);
});

const app = createApp(App);
//app.use(Bugsnag.getPlugin("vue"));
app.component("NotificationBar", NotificationBar);
app.use(pinia);

app.use(vue3GoogleLogin, {
	clientId: "182844940133-k5k1t08dposga8083n6nek2r4gjo9a7l.apps.googleusercontent.com",
});

/* Init Pinia stores BEFORE setting up the router */
const mainStore = useMainStore(pinia);
const studentStore = useStudentStore(pinia);
const adminStore = useAdminStore(pinia);
const styleStore = useStyleStore(pinia);
const layoutStore = useLayoutStore(pinia);
const snackBarStore = useSnackBarStore(pinia);

app.use(router);

const mountPoint = document.querySelector("#app");
if (mountPoint && mountPoint.__vue_app__ !== undefined) {
	// App is already mounted, no need to mount again
} else {
	app.mount("#app");
}

/* Responsive layout control */
layoutStore.responsiveLayoutControl();
window.onresize = () => layoutStore.responsiveLayoutControl();

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* temporary disabled dark mode */
/* Dark mode
if ((!localStorage[darkModeKey] && window.matchMedia("(prefers-color-scheme: dark)").matches) || localStorage[darkModeKey] === "1") {
	styleStore.setDarkMode(true);
}
*/

/* Default title tag */
const defaultDocumentTitle = "FIPU Praksa";

/* Set document title from route meta */
router.afterEach((to) => {
	document.title = to.meta?.title ? `${to.meta.title} — ${defaultDocumentTitle}` : defaultDocumentTitle;
});

export { mainStore, studentStore, adminStore, styleStore, layoutStore, snackBarStore };
