import { defineStore } from "pinia";
import { Student } from "@/services/baserow_client_api";

export const useAdminStore = defineStore("admin", {
  state: () => ({}),
  actions: {
    async registerAssignments(assignmentsData, note) {
      let postData = {
        JMBAG: "0303088177",
        Student: ["0303088177"],
        "Prvi odabir": [assignmentsData[0]["ID Zadatka"]],
        "Drugi odabir": [assignmentsData[1]["ID Zadatka"]],
        "Treći odabir": [assignmentsData[2]["ID Zadatka"]],
        Napomena: note,
      };
      try {
        const response = await Student.registerAssignments(postData);
        console.log("user pinia", response);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
  },
  persist: true,
});
