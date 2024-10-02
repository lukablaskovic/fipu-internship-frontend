import { Guest, Student } from "@/services/baserow_client_api";
import { defineStore } from "pinia";
import { router } from "@/router";

import { ProcessInstance } from "@/services/bpmn_engine_api";
import { CurrentUser } from "@/models/CurrentUser";
import { studentStore } from "@/main";

export interface Assignment {
	id_zadatak: number;
}

export const useMainStore = defineStore("main", {
	state: () => ({
		praksa_version: "1.0.0-beta.1",
		academicYear: "2024/2025",
		voditelj_prakse: "doc. dr. sc. Ivan Lorencin",

		admin_emails: ["lblaskovi@unipu.hr", "ntankov@unipu.hr", "ilorencin@unipu.hr"],

		fipulab_web: "https://goreski.github.io/FIPULabWeb/",

		// Debugger
		depth: 5,
		debug: false,
		storeSelected: "mainStore",

		allCompanies: [] as any[],

		bpmn_process_name_A: "strucna_praksa_A",
		bpmn_process_name_B: "strucna_praksa_B",

		currentUser: new CurrentUser(),
		currentUserProcessInstanceData: {} as any,

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
		userAdmin(state): boolean {
			return !!this.currentUser.email && state.admin_emails.includes(state.currentUser.email);
		},
		userHasActiveInstance(state): boolean {
			return !!state.currentUser.internship_process.id && state.currentUser.internship_process.pending_user_task !== "end_event_student";
		},
		get_userModelPrakse(state): string {
			return state.currentUser.model_prakse == "A" ? state.bpmn_process_name_A : state.bpmn_process_name_B;
		},
	},

	actions: {
		async fetchCurrentUser(): Promise<void> {
			console.log("Fetching current user");
			try {
				const localStorageToken = JSON.parse(localStorage.getItem("token") || "{}");
				const emailFromStorage = localStorageToken.email;

				const response = await Student.fetch(emailFromStorage);
				const data = response.data.results[0];

				// Initialize currentUser from fetched data
				this.currentUser.initializeFromData({
					ime: data.ime,
					prezime: data.prezime,
					JMBAG: data.JMBAG,
					email: data.email,
					godina_studija: data.godina_studija.value,
					avatar: data.avatar,
					baserow_id: data.id,
					loggedAt: new Date(),
					internship_process: {
						id: data.process_instance_id,
						pending_user_task: data.pending_user_task || null,
					},
					model_prakse: data.Model_prakse,
				});
			} catch (error) {
				console.error("[fetchCurrentUser] Error:", error);
			}
		},
		async handleLogin(decodedToken: any) {
			const { iss, sub, hd, email, nbf, name, picture, iat, jti } = decodedToken;
			const storageToken = { iss, sub, hd, email, nbf, name, picture, iat, jti };

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

				// If student does not exist, create a new student
				if (response_student.data.count === 0) {
					response = await Student.create(student_data);
					await this.fetchCurrentUser();
					router.push("/odabir-procesa");
				} else {
					await this.fetchCurrentUser();

					// If admin is logged in, redirect to dashboard
					if (this.userAdmin) {
						router.push("/dashboard");
					}
					// if student is logged in, check if they have an active process instance
					else {
						const processInstance = response_student.data.results[0].process_instance_id;
						// Has active process instance, so redirect to moja-praksa
						if (processInstance) {
							const pendingProcessTask = await studentStore.getPendingUserTask(processInstance);
							if (this.userHasActiveInstance) {
								router.push("/moja-praksa");
							} else {
								router.push("/odabir-procesa");
							}
						}
						// No active process instance, so redirect to odabir-procesa
						else {
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

		logout() {
			this.currentUser.reset();
			this.logoutModalActive = false;
			localStorage.clear();
			router.go(0); // Refresh the page
		},

		activateLogoutModal(state: boolean) {
			this.logoutModalActive = state;
		},

		activateHelpModal(state: boolean) {
			this.helpModalActive = state;
		},

		async fetchCompanies(search = "") {
			try {
				const response = await Guest.fetchCompanies(search);
				return response.data.results;
			} catch (error) {
				console.log("Error:", error);
			}
		},

		async createInternshipInstance(selected_model = "A", godina_studija = "1_prijediplomski", jmbag = "0000000000"): Promise<any> {
			try {
				let bpmn_model: string | null = null;
				if (selected_model === "A") {
					bpmn_model = this.bpmn_process_name_A;
				} else {
					bpmn_model = this.bpmn_process_name_B;
				}
				const response_bpmn_engine = await ProcessInstance.create(`${bpmn_model}.bpmn`);

				const response_bw = await Student.setProcessData(this.currentUser.email, response_bpmn_engine.id, selected_model, godina_studija, jmbag);

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
				postData.Poslodavac = [formData.Poslodavac];
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
	persist: {
		storage: localStorage,
		omit: ["assignments", "checkedAssignments", "admin_emails", "currentUser.avatar", "praksa_version"],
		debug: true,
	},
});
