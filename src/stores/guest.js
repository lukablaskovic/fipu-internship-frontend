import { defineStore } from "pinia";
import { Guest } from "@/services/baserow_client_api.js";

export const useGuestStore = defineStore("guest", {
  state: () => ({
    assignments: [],
    isLoading: false,
    error: null,
  }),
  getters: {},
  actions: {
    async fetchAvailableAssignments() {
      this.isLoading = true;
      this.error = null;
      try {
        let result = await Guest.fetchAvailableAssignments();
        this.assignments = result.results;
        return this.assignments;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
  persist: true,
});
