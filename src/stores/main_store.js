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

      internship_process: {
        id: null,
        pending_user_task: null,
      },

      reset() {
        this.id = "";
        this.name = "";
        this.surname = "";
        this.username = "";
        this.jmbag = "";
        this.email = "";
        this.year_of_study = "";
        this.avatar = "";
        this.baserow_id = null;
        this.type = "" || null;
        this.internship_process.id = null;
        this.internship_process.pending_user_task = null;
      },
    },

    access_token: null,
    logoutModalActive: false,

    isFieldFocusRegistered: false,
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
        if (response.process_instance_id !== undefined) {
          this.currentUser.internship_process.id = response.process_instance_id;
          delete response.process_instance_id;
        }
        this.currentUser = { ...this.currentUser, ...response };
      } catch (error) {
        console.log("Error fetching current user:", error);
      }
    },

    async login(loginForm) {
      try {
        const loginResult = await Auth.login(loginForm);
        if (loginResult.access_token != null) {
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
      this.currentUser.reset();
      localStorage.removeItem("main");
      localStorage.removeItem("admin");
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
    async getCompanies() {
      try {
        const response = await User.getCompanies();
        this.companies = response;
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
  },
  persist: true,
});
