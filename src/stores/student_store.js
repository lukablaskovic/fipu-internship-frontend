import { defineStore } from "pinia";
import { mainStore } from "@/main";
import { ProcessInstance } from "@/services/bpmn_engine_api";

export const useStudentStore = defineStore("student", {
  state: () => ({
    student_process_instance_data: {},
  }),
  actions: {
    async registerPreferences(assignmentsData, note) {
      let post_data = {
        JMBAG: mainStore.currentUser["jmbag"],
        Student: [mainStore.currentUser["jmbag"]],
        "Prvi odabir": [assignmentsData[0]["ID Zadatka"]],
        "Drugi odabir": [assignmentsData[1]["ID Zadatka"]],
        "Treći odabir": [assignmentsData[2]["ID Zadatka"]],
        Napomena: note,
      };
      try {
        let process_instance_id = mainStore.currentUser.internship_process.id;
        let pending_user_task =
          mainStore.currentUser.internship_process.pending_user_task;

        const response = await ProcessInstance.submitForm(
          process_instance_id,
          pending_user_task,
          post_data
        );
        console.log(
          `%c ADMIN_STORE.registerPreferences: ProcessInstance.submitForm ${JSON.stringify(
            response
          )}`,
          "background: #222; color: #bada55"
        );
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getInstanceInfo(process_instance_id) {
      try {
        const response = await ProcessInstance.get(process_instance_id);
        this.student_process_instance_data = response;
        console.log(this.student_process_instance_data);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getPendingUserTask(process_instance_id) {
      try {
        const response = await this.getInstanceInfo(process_instance_id);
        let pendingUserTask = null;
        if (response.pending && response.pending.length) {
          pendingUserTask = response.pending[0];
          mainStore.currentUser.internship_process.pending_user_task =
            pendingUserTask;
          return pendingUserTask;
        } else {
          console.log("No pending tasks found.");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    },
  },
  persist: true,
});
