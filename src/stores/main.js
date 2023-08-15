import { defineStore } from "pinia";
import { Auth } from "@/services/gateway_api";

import axios from "axios";
import router from "@/router";

export const useMainStore = defineStore("main", {
  state: () => ({
    /* User */
    access_token: JSON.parse(localStorage.getItem("main")) || null,
    returnURL: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],
  }),
  getters: {
    isLoggedIn() {
      return Boolean(this.access_token);
    },
  },
  actions: {
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
      this.token = null;
      localStorage.removeItem("access_token");
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
  },
  persist: true,
});
