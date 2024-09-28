import { Guest, Student } from "@/services/baserow_client_api";
import { defineStore } from "pinia";
import { router } from "@/router";
import axios from "axios";

import { ProcessInstance } from "@/services/bpmn_engine_api";
import { studentStore } from "@/main";

interface InternshipProcess {
	id: number | null;
	pending_user_task: string | null;
}

class CurrentUser {
	ime: string;
	prezime: string;
	JMBAG: string;
	email: string;
	godina_studija: string;
	avatar: string;
	model_prakse: string;
	baserow_id: string;
	loggedAt: Date | null;
	internship_process: InternshipProcess;

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

export interface Assignment {
	id_zadatak: number;
}

export const useMainStore = defineStore("main", {
	state: () => ({
		academicYear: "2024/2025",
		voditelj_prakse: "doc. dr. sc. Ivan Lorencin",
		fipulab_web: "https://goreski.github.io/FIPULabWeb/",

		// Debugger
		depth: 5,
		debug: false,
		storeSelected: "mainStore",

		allCompanies: [] as any[],

		bpmn_process_name_A: "strucna_praksa_edited",
		bpmn_process_name_B: "strucna_praksa_B",

		currentUser: new CurrentUser(),

		// Modal states
		logoutModalActive: false,
		helpModalActive: false,

		isFieldFocusRegistered: false,

		// from guest store
		assignments: [] as Assignment[],
		checkedAssignments: [] as Assignment[],
		isLoading: false,
		error: null as string | null,
	}),

	getters: {
		userAuthenticated(): boolean {
			return Boolean(localStorage.getItem("token"));
		},
		userAdmin(): boolean {
			return false;
			// return this.currentUser && this.currentUser.account_type === "admin";
		},
	},

	actions: {
		async handleLogin(decodedToken: any) {
			const { iss, sub, hd, email, nbf, name, picture, iat, jti } = decodedToken;
			const storageToken = { iss, sub, hd, email, nbf, name, picture, iat, jti };

			// Store public values in local storage
			localStorage.setItem("token", JSON.stringify(storageToken));

			try {
				const student_data = {
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

				if (response_student.data.count === 0) {
					response = await Student.create(student_data);
					router.push("/odabir-procesa");
				} else {
					await this.fetchCurrentUser();
					const processInstance = response_student.data.results[0].process_instance_id;
					router.push("/moja-praksa");
					if (processInstance) {
						const pendingProcessTask = await studentStore.getPendingUserTask(processInstance);
						if (pendingProcessTask !== "end_event_student") {
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
				const localStorageToken = JSON.parse(localStorage.getItem("token") || "{}");
				const emailFromStorage = localStorageToken.email;

				const response = await Student.fetch(emailFromStorage);
				const data = response.data.results[0];
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
			router.go(0); // Refresh the page
		},

		fetch(sampleDataKey: string) {
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

		activateLogoutModal(state: boolean) {
			this.logoutModalActive = state;
		},

		activateHelpModal(state: boolean) {
			this.helpModalActive = state;
		},

		async fetchCompanies(search = "") {
			try {
				console.log("[mainstore.fetchCompanies] search:", search);
				const response = await Guest.fetchCompanies(search);
				return response.data.results;
			} catch (error) {
				console.log("Error:", error);
			}
		},

		async createInternshipInstance(selected_model = "A") {
			try {
				let bpmn_model: string | null = null;
				if (selected_model === "A") {
					bpmn_model = this.bpmn_process_name_A;
				}
				const response_bpmn_engine = await ProcessInstance.create(`${bpmn_model}.bpmn`);

				const response_bw = await Student.setProcessData(this.currentUser.email, response_bpmn_engine.id, selected_model);

				await this.fetchCurrentUser();
				return response_bw;
			} catch (error) {
				return error;
			}
		},

		async fetchAvailableAssignments() {
			this.isLoading = true;
			this.error = null;
			try {
				const result = await Guest.fetchAvailableAssignments();
				this.assignments = result.results;
				return this.assignments;
			} catch (e: any) {
				this.error = e.message;
			} finally {
				this.isLoading = false;
			}
		},

		addAssignment(assignment: Assignment) {
			const assignmentExists = this.checkedAssignments.some((a) => a.id_zadatak === assignment.id_zadatak);
			if (!assignmentExists) {
				this.checkedAssignments.push(assignment);
			}
		},

		removeAssignment(assignment: Assignment) {
			this.checkedAssignments = this.checkedAssignments.filter((a) => a.id_zadatak !== assignment.id_zadatak);
		},

		resetAssignments() {
			this.checkedAssignments = [];
		},

		async submitNewInternshipProject(formData: any) {
			const postData = {
				...formData,
				Poslodavac: [] as string[],
			};

			if (formData.Poslodavac) {
				postData.Poslodavac = [formData.Poslodavac.label];
			} else if (formData.Poslodavac_novi_naziv) {
				postData.Poslodavac = [formData.Poslodavac_novi_naziv];
			}

			delete postData.Poslodavac_novi_naziv;

			if (formData.angazman_selekcija === "false") {
				postData.angazman_fipu = "Ne";
			} else if (formData.angazman_selekcija === "true" && !formData.angazman_fipu) {
				postData.angazman_fipu = "";
			}
			try {
				const response = await Guest.submitNewInternshipProject(postData);
				return response;
			} catch (error) {
				console.log("Error:", error);
				return error;
			}
		},
	},
	persist: true,
});
