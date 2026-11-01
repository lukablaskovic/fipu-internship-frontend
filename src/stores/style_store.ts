import { darkModeKey, styleKey } from "@/config";
import { defineStore } from "pinia";
import * as styles from "@/styles";

// Define a type for styles from the imported styles object
type StylePayload = keyof typeof styles; // Extracting keys from styles to restrict payload to valid styles

// Define an interface for the state structure
interface StyleState {
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
	navBarItemLabelHoverStyle: string;
	navBarItemLabelActiveColorStyle: string;
	overlayStyle: string;

	/* Dark mode */
	darkMode: boolean;
}

export const useStyleStore = defineStore("style", {
	state: (): StyleState => ({
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
		setStyle(payload: StylePayload) {
			if (!styles[payload]) {
				return;
			}

			if (typeof sessionStorage !== "undefined") {
				sessionStorage.setItem(styleKey, payload);
			}

			const style = styles[payload];

			for (const key in style) {
				if (Object.prototype.hasOwnProperty.call(style, key)) {
					// Dynamically assign style properties with a key pattern
					(this as any)[`${key}Style`] = style[key];
				}
			}
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

	persist: false,
});
