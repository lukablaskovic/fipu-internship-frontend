import { defineStore } from "pinia";
import { snackBarStore } from "@/main";
import axios from "axios";

import { Auth } from "@/services/gateway_api";
import { User } from "@/services/gateway_api";
import { Guest, Student, Admin } from "@/services/baserow_client_api";

export const useMainStore = defineStore("main", {
	state: () => ({
		servicesUp: true,
		depth: 5,
		debug: false,
		storeSelected: "mainStore",

		transition_name: "",
		enter_active_class: "",
		leave_active_class: "",
		bpmn_process_name: "strucna_praksa_edited",

		currentUser: {
			id: "",
			ime: "",
			prezime: "",
			username: "",
			JMBAG: "",
			email: "",
			godina_studija: "",
			avatar: "",
			baserow_id: null,
			account_type: "" || null,
			loggedAt: null,

			internship_process: {
				id: null,
				pending_user_task: null,
			},

			reset() {
				this.id = "";
				this.ime = "";
				this.prezime = "";
				this.username = "";
				this.JMBAG = "";
				this.email = "";
				this.godina_studija = "";
				this.avatar = "";
				this.baserow_id = null;
				this.account_type = "" || null;

				this.internship_process.id = null;
				this.internship_process.pending_user_task = null;
			},
		},

		access_token: null,
		logoutModalActive: false,
		helpModalActive: false,

		isFieldFocusRegistered: false,
		avatarChanging: false,
	}),
	getters: {
		userAuthenticated() {
			return Boolean(this.access_token);
		},
		userAdmin() {
			return this.currentUser && this.currentUser.account_type === "admin";
		},
		academicYear() {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth();

			if (month < 9) {
				return `${year - 1}/${year}`;
			} else {
				return `${year}/${year + 1}`;
			}
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

				if (this.currentUser.account_type == "student") {
					let userAvatar = await Student.fetch(this.currentUser.JMBAG);
					this.currentUser.avatar = userAvatar["avatar"][0]["url"];
				}
			} catch (error) {
				console.log("Error fetching current user: ", error);
			}
		},

		async updateAvatarStudent(student_jmbag, fileData) {
			try {
				const result = await Student.updateAvatarStudent(student_jmbag, fileData);
				return result;
			} catch (error) {
				console.log("Error: ", error);
			}
		},

		async updateAvatarAdmin(fileData) {
			try {
				const result = await Admin.updateAvatarAdmin(fileData);
				return result;
			} catch (error) {
				console.log("Error: ", error);
			}
		},

		async login(loginForm) {
			try {
				const loginResult = await Auth.login(loginForm);
				if (loginResult.access_token != null) {
					this.access_token = loginResult.access_token;
					await this.fetchCurrentUser();
					this.currentUser.loggedAt = loginResult.timestamp;
					return this.access_token;
				}
				return loginResult;
			} catch (error) {
				console.log("Error: ", error);
			}
		},
		handleSuccessfulLogin() {
			if (this.currentUser.account_type == "student") {
				this.router.push("/moja-praksa");
			} else if (this.currentUser.account_type == "admin") {
				this.router.push("/dashboard");
			}
			snackBarStore.pushMessage(`Dobrodošli natrag! ${this.currentUser.username} `, "contrast");
		},
		clearCurrentUser() {
			this.access_token = null;
			this.currentUser.reset();
			localStorage.removeItem("main");
			localStorage.removeItem("admin");
			localStorage.removeItem("student");
			localStorage.removeItem("guest");
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
		activateHelpModal(state) {
			this.helpModalActive = state;
		},
		async fetchCompanies(search = "") {
			try {
				const response = await Guest.fetchCompanies(search);
				this.companies = response;
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async updatePassword(old_password, new_password) {
			let updates = {
				old_password: old_password,
				new_password: new_password,
			};
			let response = await User.updatePassword(updates);
			return response;
		},
	},
	persist: true,
});
