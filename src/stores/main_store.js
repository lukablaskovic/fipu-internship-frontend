import { Guest, Student } from "@/services/baserow_client_api";
import { defineStore } from "pinia";
import { router } from "@/router";
import axios from "axios";

import { studentStore } from "@/main.js";

class CurrentUser {
	constructor() {
		this.ime = "";
		this.prezime = "";
		this.JMBAG = "";
		this.email = "";
		this.godina_studija = "";
		this.avatar = "";
		this.model_prakse = "";
		this.baserow_id = "";
		this.loggedAt = null;
		this.internship_process = {
			id: null,
			pending_user_task: null,
		};
	}

	reset() {
		this.ime = "";
		this.prezime = "";
		this.JMBAG = "";
		this.email = "";
		this.godina_studija = "";
		this.avatar = "";
		this.model_prakse = "";
		this.baserow_id = "";
		this.loggedAt = null;
		this.internship_process.id = null;
		this.internship_process.pending_user_task = null;
	}
}

export const useMainStore = defineStore("main", {
	state: () => ({
		academicYear: "2024/2025",
		voditelj_prakse: "doc. dr. sc. Ivan Lorencin",
		fipulab_web: "https://goreski.github.io/FIPULabWeb/",

		//Debugger
		depth: 5,
		debug: false,
		storeSelected: "mainStore",

		allCompanies: [],

		bpmn_process_name_A: "strucna_praksa_edited",
		bpmn_process_name_B: "strucna_praksa_B",

		currentUser: new CurrentUser(),
		//Modal states
		logoutModalActive: false,
		helpModalActive: false,

		isFieldFocusRegistered: false,
	}),

	getters: {
		userAuthenticated() {
			return Boolean(localStorage.getItem("token"));
		},
		userAdmin() {
			return false;
			//return this.currentUser && this.currentUser.account_type === "admin";
		},
	},
	actions: {
		async handleLogin(decodedToken) {
			let { iss, sub, hd, email, nbf, name, picture, iat, jti } = decodedToken;
			let storageToken = {
				iss,
				sub,
				hd,
				email,
				nbf,
				name,
				picture,
				iat,
				jti,
			};
			// store public values in local storage
			localStorage.setItem("token", JSON.stringify(storageToken));

			try {
				let student_data = {
					JMBAG: "0000000000", // default value, student must change this
					ime: decodedToken.given_name,
					prezime: decodedToken.family_name,
					email: decodedToken.email,
					godina_studija: "1_prijediplomski", // default value, student must change this
					avatar: decodedToken.picture,
				};

				// Check if student already exists
				const response_student = await Student.fetch(decodedToken.email);

				let response = null;
				if (response_student.data.count == 0) {
					response = await Student.create(student_data);
					router.push("/odabir-procesa");
				} else {
					await this.fetchCurrentUser();
					let processInstance = response_student.data.results[0].process_instance_id;
					router.push("/moja-praksa");
					if (processInstance) {
						let pendingProcessTask = await studentStore.getPendingUserTask(processInstance);

						if (pendingProcessTask != "end_event_student") {
							router.push("/moja-praksa");
						} else {
							router.push("/odabir-procesa");
						}
					}
					response = response_student.data.results[0];
				}
				return { status: "success", data: response };
			} catch (error) {
				console.log("status:", error);
			}
		},
		async fetchCurrentUser() {
			console.log("Fetching current user");
			try {
				console.log("Fetching current user");
				let localStorageToken = JSON.parse(localStorage.getItem("token"));
				let emailFromStorage = localStorageToken.email;

				const response = await Student.fetch(emailFromStorage);
				const data = response.data.results[0];
				console.log("data", data);
				this.currentUser.ime = data.ime;
				this.currentUser.prezime = data.prezime;
				this.currentUser.JMBAG = data.JMBAG;
				this.currentUser.email = data.email;
				this.currentUser.godina_studija = data.godina_studija.value;
				this.currentUser.avatar = data.avatar;
				this.currentUser.baserow_id = data.id;

				this.currentUser.loggedAt = new Date();
				this.currentUser.model_prakse = data.Model_prakse;
				this.currentUser.internship_process.id = data.process_instance_id;

				console.log("response", response);
			} catch (error) {
				console.log("[fetchCurrentUser] Error:", error);
			}
		},

		clearCurrentUser() {
			this.currentUser.reset();
			localStorage.removeItem("main");
			localStorage.removeItem("admin");
			localStorage.removeItem("student");
			localStorage.removeItem("guest");
		},

		logout() {
			this.clearCurrentUser();
			this.logoutModalActive = false;
			localStorage.removeItem("token");
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
				this.allCompanies = response.data.results;
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
	},
	persist: true,
});
