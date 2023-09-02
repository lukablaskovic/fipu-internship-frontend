import { defineStore } from "pinia";
import { mainStore } from "@/main";
import { ProcessInstance } from "@/services/bpmn_engine_api";
import { Student } from "@/services/baserow_client_api";
export const useStudentStore = defineStore("student", {
  state: () => ({
    student_process_instance_data: {},
    allocated_assignment: null,
  }),
  actions: {
    async registerPreferences(assignmentsData, napomena) {
      let post_data = {
        JMBAG: mainStore.currentUser["JMBAG"],
        Student: [mainStore.currentUser["JMBAG"]],
        student_email: mainStore.currentUser["email"],
        student_ime: mainStore.currentUser["ime"],
        student_prezime: mainStore.currentUser["prezime"],
        student_godina_studija: mainStore.currentUser["godina_studija"],
        Prvi_odabir: [assignmentsData[0]["id_zadatak"]],
        Drugi_odabir: [assignmentsData[1]["id_zadatak"]],
        Treci_odabir: [assignmentsData[2]["id_zadatak"]],
        napomena: napomena,
      };
      console.log("student_store_post_data", post_data);
      try {
        let process_instance_id = mainStore.currentUser.internship_process.id;
        let pending_user_task =
          mainStore.currentUser.internship_process.pending_user_task;

        const response = await ProcessInstance.handleNewInstance(
          process_instance_id,
          pending_user_task,
          post_data
        );
        console.log(
          `%c ADMIN_STORE.registerPreferences: ProcessInstance.handleNewInstance ${JSON.stringify(
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
    async getAllocationsPublic() {
      try {
        let result = await Student.getAllocationsPublic();
        return result;
      } catch (error) {
        console.log("Error:", error);
        return null;
      }
    },
    async getAssignmentDetails(assignment_id) {
      try {
        let result = await Student.getAssignmentDetails({
          search: assignment_id,
        });
        return result;
      } catch (error) {
        console.log("Error:", error);
        return null;
      }
    },
  },
  persist: true,
});
