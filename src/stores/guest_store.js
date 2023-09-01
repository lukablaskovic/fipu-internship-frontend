import { defineStore } from "pinia";
import { Guest } from "@/services/baserow_client_api.js";
import { ProcessInstance } from "@/services/bpmn_engine_api.js";
import { Auth } from "@/services/gateway_api.js";
import { mainStore } from "@/main.js";

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
    async createInternshipInstance() {
      try {
        const response = await ProcessInstance.create(
          `${mainStore.bpmn_process_name}.bpmn`
        );
        return response;
      } catch (error) {
        console.log("Error:", error);
        return error;
      }
    },
    async update_process_instance(student_id, process_instance_id) {
      try {
        const response = await Auth.update_process_instance(
          student_id,
          process_instance_id
        );
        return response;
      } catch (error) {
        console.log("Error:", error);
        return error;
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
        (a) => a["id_zadatak"] === assignment["id_zadatak"]
      );
      if (!assignmentExists) {
        this.checkedAssignments.push(assignment);
      }
      console.log(this.checkedAssignments);
    },
    removeAssignment(assignment) {
      this.checkedAssignments = this.checkedAssignments.filter(
        (a) => a["id_zadatak"] !== assignment["id_zadatak"]
      );
    },
    resetAssignments() {
      this.checkedAssignments = [];
    },
  },
});
