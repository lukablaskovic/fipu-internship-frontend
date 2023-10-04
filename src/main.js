import "./css/main.css";
import "animate.css";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";

import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";

/* Pinia global stores */
import { useMainStore } from "@/stores/main_store.js";
import { useStyleStore } from "@/stores/style_store.js";
import { useGuestStore } from "@/stores/guest_store.js";
import { useAdminStore } from "@/stores/admin_store.js";
import { useStudentStore } from "@/stores/student_store";
import { useLayoutStore } from "@/stores/layout";
import { useSnackBarStore } from "@/stores/snackbar_store";
import { useChatStore } from "@/stores/chat_store";

import { darkModeKey, styleKey } from "@/config.js";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

/*
Bugsnag.start({
  apiKey: import.meta.env.VITE_BUGSNAG,
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

/* Init Pinia stores BEFORE setting up the router */
const mainStore = useMainStore(pinia);
const studentStore = useStudentStore(pinia);
const guestStore = useGuestStore(pinia);
const adminStore = useAdminStore(pinia);
const styleStore = useStyleStore(pinia);
const layoutStore = useLayoutStore(pinia);
const snackBarStore = useSnackBarStore(pinia);
const chatStore = useChatStore(pinia);

app.use(router);

let VueAppInstance = null;
let containerSelector = "#app";
// check if app has been mounted already
const mountPoint = document.querySelector(containerSelector);
if (mountPoint && mountPoint.__vue_app__ !== undefined) {
	VueAppInstance = mountPoint.__vue_app__._instance.proxy;
} else {
	app.mount("#app");
}

/* Responsive layout control */
layoutStore.responsiveLayoutControl();
window.onresize = () => layoutStore.responsiveLayoutControl();

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if ((!localStorage[darkModeKey] && window.matchMedia("(prefers-color-scheme: dark)").matches) || localStorage[darkModeKey] === "1") {
	styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "Fipu Praksa";

/* Set document title from route meta */
router.afterEach((to) => {
	document.title = to.meta?.title ? `${to.meta.title} — ${defaultDocumentTitle}` : defaultDocumentTitle;
});

export { mainStore, studentStore, adminStore, guestStore, styleStore, layoutStore, snackBarStore, chatStore };
