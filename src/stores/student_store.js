import { defineStore } from "pinia";

import { Student } from "@/services/baserow_client_api";
import { ProcessInstance } from "@/services/bpmn_engine_api";

export const useStudentStore = defineStore("student", {
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
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getInstanceInfo(process_instance_id) {
      try {
        const response = await ProcessInstance.get(process_instance_id);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
  },
  persist: true,
});
