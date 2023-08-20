import { defineStore } from "pinia";
import { Auth } from "@/services/gateway_api";
import { User } from "@/services/gateway_api";

import axios from "axios";
import router from "@/router";

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
    },
    access_token: JSON.parse(localStorage.getItem("main")) || null,
    logoutModalActive: false,
    returnURL: null,

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
        console.log(loginResult);

        this.access_token = loginResult.access_token;

        router.push(this.returnURL || "/");
      } catch (error) {
        console.log(error);
      }
    },

    logout() {
      this.access_token = null;
      this.logoutModalActive = false;
      localStorage.removeItem("main");
      router.push("/login");
    },

    setUser(payload) {
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
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
