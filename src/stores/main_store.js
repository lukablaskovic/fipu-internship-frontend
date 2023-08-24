import { defineStore } from "pinia";
import { Auth } from "@/services/gateway_api";
import { User } from "@/services/gateway_api";
import axios from "axios";

export const useMainStore = defineStore("main", {
  state: () => ({
    currentUser: {
      id: "",
      name: "",
      surname: "",
      username: "",
      jmbag: "",
      email: "",
      year_of_study: "",
      avatar: "",
      baserow_id: null,
      type: "" || null,
      process_instance_id: null,
    },

    access_token: null,
    logoutModalActive: false,

    isFieldFocusRegistered: false,

    clients: [],
    history: [],
  }),
  getters: {
    userAuthenticated() {
      return Boolean(this.access_token);
    },
    userAdmin() {
      return this.currentUser && this.currentUser.type === "admin";
    },
  },
  actions: {
    async fetchCurrentUser() {
      try {
        const response = await User.getCurrentUser();
        this.currentUser = response;
      } catch (error) {
        console.log("Error fetching current user:", error);
      }
    },

    async login(email, password) {
      try {
        const loginResult = await Auth.login({ email, password });
        if (loginResult.access_token != null) {
          console.log("logging in...");
          this.access_token = loginResult.access_token;
          await this.fetchCurrentUser();
        }
        if (this.currentUser.type == "student") {
          this.router.push("/moja-praksa");
        } else if (this.currentUser.type == "admin") {
          this.router.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    },
    clearCurrentUser() {
      this.access_token = null;
      this.currentUser = {
        id: "",
        name: "",
        surname: "",
        username: "",
        jmbag: "",
        email: "",
        year_of_study: "",
        avatar: "",
        baserow_id: null,
        type: "" || null,
        process_instance_id: null,
      };
      localStorage.removeItem("main");
    },

    logout() {
      this.clearCurrentUser();
      this.logoutModalActive = false;
      this.router.go();
    },

    fetch(sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data;
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },

    activateLogoutModal(state) {
      this.logoutModalActive = state;
    },
  },
  persist: true,
});
