import { Guest, Student } from "@/services/baserow_client_api";
import { defineStore } from "pinia";
import { router } from "@/router";

import { ProcessInstance } from "@/services/bpmn_engine_api";
import { CurrentUser } from "@/models/CurrentUser";
import { MAINTENANCE_MODE } from "@/config";
import { studentStore } from "@/main";

export interface Assignment {
	id_zadatak: number;
}

export const useMainStore = defineStore("main", {
	state: () => ({
		praksa_version: "v1.5.0",
		academicYear: "2025/2026",
		voditelj_prakse: "doc. dr. sc. Ivan Lorencin",

		admin_emails: ["ntankov@unipu.hr", "ilorencin@unipu.hr", "lblaskovi@unipu.hr", "mmilicevi@unipu.hr"],

		fipulab_web: "https://web.fipulab.unipu.hr/",

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
		table_items_per_page: 10,

		// from guest store
		assignments: [] as Assignment[],
		checkedAssignments: [] as Assignment[],
		isLoading: false,
		error: null as string | null,

		// Maintenance mode
		maintenanceMode: MAINTENANCE_MODE,
	}),

	getters: {
		userAuthenticated(): boolean {
			const token = sessionStorage.getItem("token");
			return token ? true : false;
		},
		userAdmin(state): boolean {
			return !!state.currentUser.email && state.admin_emails.includes(state.currentUser.email);
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
			try {
				let sessionStorageToken;
				try {
					sessionStorageToken = JSON.parse(sessionStorage.getItem("token") || "{}");
				} catch (error) {
					console.error("Invalid token in sessionStorage:", error);
					sessionStorageToken = {};
				}
				const emailFromStorage = sessionStorageToken.email;

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
					internship_process: { id: data.process_instance_id, pending_user_task: data.pending_user_task || null },
					model_prakse: data.Model_prakse,
				});
			} catch (error) {
				console.error("[fetchCurrentUser] Error:", error);
			}
		},
		async handleLogin(decodedToken: any) {
			const { iss, sub, hd, email, nbf, name, picture, iat, jti } = decodedToken;
			const storageToken = { iss, sub, hd, email, nbf, name, picture, iat, jti };

			sessionStorage.setItem("token", JSON.stringify(storageToken));

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
					await router.push("/odabir-procesa");
				} else {
					await this.fetchCurrentUser();

					// If admin is logged in, redirect to dashboard
					if (this.userAdmin) {
						await router.push("/dashboard");
					}
					// if student is logged in, check if they have an active process instance
					else {
						const processInstance = response_student.data.results[0].process_instance_id;
						// Has active process instance, so redirect to moja-praksa
						if (processInstance) {
							const pendingProcessTask = await studentStore.getPendingUserTask(processInstance);
							if (this.userHasActiveInstance) {
								await router.push("/moja-praksa");
							} else {
								await router.push("/odabir-procesa");
							}
						}
						// No active process instance, so redirect to odabir-procesa
						else {
							await router.push("/odabir-procesa");
						}
					}
					response = response_student.data.results[0];
				}
				return { status: "success", data: response };
			} catch (error) {
				console.error("Login error:", error);
				return { status: "error", error };
			}
		},

		logout() {
			this.currentUser.reset();
			this.logoutModalActive = false;
			sessionStorage.clear();
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
				this.assignments = result.data.results;
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

		// Maintenance mode actions
		enableMaintenanceMode() {
			this.maintenanceMode = true;
		},

		disableMaintenanceMode() {
			this.maintenanceMode = false;
		},

		async submitNewInternshipProject(formData: any) {
			const postData = { ...formData, Poslodavac: [] as string[] };

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
		storage: sessionStorage,
		omit: ["assignments", "checkedAssignments", "allCompanies", "praksa_version", "academicYear"],
		debug: true,
		beforeRestore: (ctx: any) => {
			// Only restore allCompanies if user is authenticated
			const token = sessionStorage.getItem("token");
			if (!token) {
				// For non-authenticated users, prevent restoring companies data
				if (ctx.store && ctx.store.allCompanies) {
					ctx.store.allCompanies = [];
				}
			}
		},
	},
});
