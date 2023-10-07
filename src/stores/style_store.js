import { defineStore } from "pinia";
import * as styles from "@/styles";
import { darkModeKey, styleKey } from "@/config";

let wait = function (seconds) {
	return new Promise((resolveFn) => {
		setTimeout(resolveFn, seconds * 1000);
	});
};

export const useStyleStore = defineStore("style", {
	state: () => ({
		/* Styles */
		asideStyle: "",
		asideScrollbarsStyle: "",
		asideBrandStyle: "",
		asideMenuItemStyle: "",
		asideMenuItemActiveStyle: "",
		asideMenuItemActiveBgStyle: "",
		asideMenuItemInactiveStyle: "",
		asideMenuDropdownStyle: "",
		navBarItemLabelStyle: "",
		navBarItemLabelHoverStyle: "",
		navBarItemLabelActiveColorStyle: "",
		overlayStyle: "",

		/* Dark mode */
		darkMode: false,
	}),
	actions: {
		setStyle(payload) {
			if (!styles[payload]) {
				return;
			}

			if (typeof localStorage !== "undefined") {
				localStorage.setItem(styleKey, payload);
			}

			const style = styles[payload];

			for (const key in style) {
				this[`${key}Style`] = style[key];
			}
		},

		async setDarkMode(payload = null) {
			const app = document.getElementById("app");
			app.classList.add("darkModeTransition");
			this.darkMode = payload !== null ? payload : !this.darkMode;

			if (typeof localStorage !== "undefined") {
				localStorage.setItem(darkModeKey, this.darkMode ? "1" : "0");
			}

			if (typeof document !== "undefined") {
				document.body.classList[this.darkMode ? "add" : "remove"]("dark-scrollbars");

				document.documentElement.classList[this.darkMode ? "add" : "remove"]("dark-scrollbars-compat");
			}
			await wait(0.25);
			app.classList.remove("darkModeTransition");
		},
	},
	persist: true,
});
