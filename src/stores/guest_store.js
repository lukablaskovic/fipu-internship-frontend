import { defineStore } from "pinia";
import { Guest } from "@/services/baserow_client_api.js";
import { Auth } from "@/services/gateway_api.js";

export const useGuestStore = defineStore("guest", {
  state: () => ({
    assignments: [],
    checkedAssignments: [],
    isLoading: false,
    error: null,
  }),
  getters: {},
  actions: {
    async registerStudent(postData) {
      try {
        const response = await Auth.register(postData);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
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
    addAssignment(assignment) {
      const assignmentExists = this.checkedAssignments.some(
        (a) => a["ID Zadatka"] === assignment["ID Zadatka"]
      );
      if (!assignmentExists) {
        this.checkedAssignments.push(assignment);
      }
    },

    removeAssignment(assignment) {
      this.checkedAssignments = this.checkedAssignments.filter(
        (a) => a["ID Zadatka"] !== assignment["ID Zadatka"]
      );
    },
  },
});
