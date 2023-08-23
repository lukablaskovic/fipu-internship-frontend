import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";
import { Model, ProcessInstance } from "@/services/bpmn_engine_api";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    students: [],
    selectedStudent: {},
    companies: [],
  }),
  actions: {
    showSelectedStudent(student) {
      this.selectedStudent = student;
    },
    async getStudents() {
      try {
        const response = await User.getStudents();
        this.students = response;
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getCompanies() {
      try {
        const response = await User.getCompanies();
        this.companies = response;
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async searchModels() {
      try {
        const response = await Model.search();
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getProcessInstanceData() {
      try {
        const response = await ProcessInstance.get(
          this.selectedStudent.process_instance_id
        );
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
  },
  persist: true,
});
