import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";

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
  },
  persist: true,
});
