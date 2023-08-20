import "./css/main.css";
import "animate.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import { useMainStore } from "@/stores/main_store.js";
import { useStyleStore } from "@/stores/style_store.js";
import { useGuestStore } from "@/stores/guest_store.js";
import { useAdminStore } from "@/stores/admin_store.js";
import { useStudentStore } from "./stores/student_store";

import { darkModeKey, styleKey } from "@/config.js";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import NotificationBar from "@/components/NotificationBar.vue";

/* Init Pinia */
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const APP = createApp(App);
APP.use(router).use(pinia);
APP.component("NotificationBar", NotificationBar);
APP.mount("#app");

/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const studentStore = useStudentStore(pinia);
const guestStore = useGuestStore(pinia);
const adminStore = useAdminStore(pinia);
const styleStore = useStyleStore(pinia);

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "FIPU Internship App";

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});

export { mainStore, studentStore, adminStore, guestStore, styleStore };
