import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    students: [],
  }),
  actions: {
    async getStudents() {
      try {
        const response = await User.getStudents();
        this.students = response;
        console.log("students", response);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
  },
  persist: true,
});
