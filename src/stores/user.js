import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";
import { Student } from "@/services/baserow_client_api";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: {
      id: "",
      name: "",
      surname: "",
      jmbag: "",
      email: "",
      year_of_study: "",
      avatar: "",
      username: "",
      baserow_id: null,
      type: "",
    },
  }),
  actions: {
    async fetchCurrentUser() {
      try {
        const response = await User.getCurrent();
        this.currentUser = response;
      } catch (error) {
        console.log("Error fetching current user:", error);
      }
    },
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
