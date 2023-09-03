import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    isAsideMobileExpanded: false,
    isAsideLgActive: true,

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
});
