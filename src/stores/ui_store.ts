import { persistSession } from "@/helpers/persist-session";
import { darkModeKey } from "@/config";
import { defineStore } from "pinia";

// Define an interface for the state structure
interface UiState {
	isAsideMobileExpanded: boolean;
	isAsideLgActive: boolean;
	isLg: boolean;
	/* Styles */
	asideStyle: string;
	asideScrollbarsStyle: string;
	asideBrandStyle: string;
	asideMenuItemStyle: string;
	asideMenuItemActiveStyle: string;
	asideMenuItemActiveBgStyle: string;
	asideMenuItemInactiveStyle: string;
	asideMenuDropdownStyle: string;
	navBarItemLabelStyle: string;
	navBarItemLabelActiveColorStyle: string;
	overlayStyle: string;

	/* Dark mode */
	darkMode: boolean;
}

export const useUiStore = defineStore("ui", {
	state: (): UiState => ({
		isAsideMobileExpanded: false,
		isAsideLgActive: true,
		isLg: false,
		/* Styles */
		asideStyle: "bg-white dark:bg-gray-800",
		asideScrollbarsStyle: "aside-scrollbars-[slate]",
		asideBrandStyle: "items-center justify-center bg-white text-gray-800 dark:bg-gray-900 dark:text-white",
		asideMenuItemStyle: "text-gray-600 dark:text-gray-300",
		asideMenuItemActiveStyle: "text-slate-900 dark:text-slate-900 font-bold",
		asideMenuItemActiveBgStyle: "bg-fipu_blue dark:bg-fipu_blue",
		asideMenuItemInactiveStyle: "text-gray-600 hover:text-sky-700 dark:text-gray-300 dark:hover:text-fipu_light_blue",
		asideMenuDropdownStyle: "bg-gray-100 dark:bg-gray-700/50",
		navBarItemLabelStyle: "text-black",
		navBarItemLabelActiveColorStyle: "text-fipu_blue",
		overlayStyle: "from-gray-700 via-gray-900 to-gray-700",

		/* Dark mode */
		darkMode: false,
	}),

	actions: {
		asideMobileToggle() {
			this.isAsideMobileExpanded = !this.isAsideMobileExpanded;
		},

		asideLgToggle() {
			this.isAsideLgActive = !this.isAsideLgActive;
		},

		responsiveLayoutControl() {
			this.isLg = window.innerWidth >= 1024;
		},
		setDarkMode(payload: boolean | null = null, savePreference = true) {
			this.darkMode = payload !== null ? payload : !this.darkMode;

			try {
				if (savePreference) localStorage.setItem(darkModeKey, this.darkMode ? "1" : "0");
			} catch {
				// Keep switching themes when browser storage is unavailable.
			}

			if (typeof document !== "undefined") {
				document.documentElement.classList.toggle("dark", this.darkMode);
				document.body.classList[this.darkMode ? "add" : "remove"]("dark-scrollbars");
				document.documentElement.classList[this.darkMode ? "add" : "remove"]("dark-scrollbars-compat");
			}
		},
	},

	persist: persistSession(["isAsideLgActive"], "layout"),
});
