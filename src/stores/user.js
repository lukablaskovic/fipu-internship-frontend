import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: {
      id: "",
      avatar: "",
      username: "",
      ime_prezime: "",
      email: "",
      profile_type: "",
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
