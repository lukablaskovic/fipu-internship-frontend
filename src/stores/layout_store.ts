import { defineStore } from "pinia";

// Define the state interface
interface Tooltip {
	content: string;
	offsetx: number;
	offsety: number;
	justify: string;
}

interface LayoutState {
	isAsideMobileExpanded: boolean;
	isAsideLgActive: boolean;
	tooltip: Tooltip;
	isXl: boolean;
	isLg: boolean;
	isMd: boolean;
}

export const useLayoutStore = defineStore("layout", {
	state: (): LayoutState => ({
		isAsideMobileExpanded: false,
		isAsideLgActive: true,
		tooltip: {
			content: "",
			offsetx: 0,
			offsety: 0,
			justify: "",
		},

		/* Breakpoints */
		isXl: false,
		isLg: false,
		isMd: false,
	}),

	actions: {
		asideMobileToggle() {
			this.isAsideMobileExpanded = !this.isAsideMobileExpanded;
		},

		asideLgToggle() {
			this.isAsideLgActive = !this.isAsideLgActive;
		},

		responsiveLayoutControl() {
			this.isXl = window.innerWidth >= 1280;
			this.isLg = window.innerWidth >= 1024;
			this.isMd = window.innerWidth >= 768;
		},
	},
	persist: {
		storage: sessionStorage,
		debug: true,
	},
});
