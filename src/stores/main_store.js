import { defineStore } from "pinia";
import axios from "axios";

import { Guest, Student, Admin } from "@/services/baserow_client_api";
import { router } from "@/router";

export const useMainStore = defineStore("main", {
	state: () => ({
		voditelj_prakse: "doc. dr. sc. Ivan Lorencin",
		fipulab_web: "https://goreski.github.io/FIPULabWeb/",

		servicesUp: true,
		depth: 5,
		debug: false,
		storeSelected: "mainStore",

		transition_name: "",
		enter_active_class: "",
		leave_active_class: "",
		bpmn_process_name_A: "strucna_praksa_edited",
		bpmn_process_name_B: "strucna_praksa_B",

		currentUser: {
			ime: "",
			prezime: "",
			JMBAG: "",
			email: "",
			godina_studija: "",
			avatar: "",
			loggedAt: null,
			model_prakse: null,

			baserow_id: null,

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

				this.internship_process.id = null;
				this.internship_process.pending_user_task = null;
			},
		},
		logoutModalActive: false,
		helpModalActive: false,

		isFieldFocusRegistered: false,
		avatarChanging: false,
	}),
	getters: {
		userAuthenticated() {
			return Boolean(localStorage.getItem("token"));
		},
		userAdmin() {
			return false;
			//return this.currentUser && this.currentUser.account_type === "admin";
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

			localStorage.setItem("token", JSON.stringify(storageToken));
			this.acc;

			try {
				let student_data = {
					JMBAG: "0000000000",
					ime: decodedToken.given_name,
					prezime: decodedToken.family_name,
					email: decodedToken.email,
					godina_studija: "1_prijediplomski",
				};

				// Check if student already exists
				console.log("Fetching student data for user: ", decodedToken.email);
				const response_student = await Student.fetch(decodedToken.email);

				console.log("response_student", response_student);

				let response = null;
				if (response_student.data.count == 0) {
					console.log("Student does not exist in the database");
					response = await Student.create(student_data);
					console.log(response);
				} else {
					console.log("Student already exists in the database");
					router.push("/moja-praksa");
					response = response_student.data.results[0];
				}
				return response;
			} catch (error) {
				console.log("Error:", error);
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

				this.currentUser.ime = data.ime;
				this.currentUser.prezime = data.prezime;
				this.currentUser.JMBAG = data.JMBAG;
				this.currentUser.email = data.email;
				this.currentUser.godina_studija = data.godina_studija.value;
				//this.currentUser.avatar = data.avatar;
				this.currentUser.baserow_id = data.id;
				this.currentUser.loggedAt = new Date();
				this.currentUser.model_prakse = data.Model_prakse;
				this.currentUser.internship_process.id = data.process_instance_id;
				console.log("response", response);
			} catch (error) {
				console.log("[handleLogin] Error:", error);
			}
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
	},
	persist: true,
});
