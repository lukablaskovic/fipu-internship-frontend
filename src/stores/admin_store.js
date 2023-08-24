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
    async getProcessInstanceData(student) {
      try {
        const response = await ProcessInstance.get(student.process_instance_id);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getStudents() {
      try {
        const students = await User.getStudents();
        console.log(students);

        const promises = students.map(async (student) => {
          const data = await this.getProcessInstanceData(student);
          student.process_instance_data = data;
        });

        await Promise.all(promises);

        console.log(students);
        this.students = students;
        return students;
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
  },
  persist: true,
});
