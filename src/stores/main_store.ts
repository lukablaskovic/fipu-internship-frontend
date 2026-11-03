import { Guest, Student } from "@/services/baserow_client_api";
import { defineStore } from "pinia";
import { router } from "@/router";

import { ProcessInstance } from "@/services/bpmn_engine_api";
import { CurrentUser } from "@/models/CurrentUser";
import { MAINTENANCE_MODE, appConfig } from "@/config";
import { useStudentStore } from "@/stores/student_store";

export const useMainStore = defineStore("main", {
	state: () => ({
		allCompanies: [] as any[],

		currentUser: new CurrentUser(),
		userAuthenticated: false,

		// Maintenance mode
		maintenanceMode: MAINTENANCE_MODE,
	}),

	getters: {
		userAdmin(state): boolean {
			return state.currentUser.coordinator === true;
		},
		canViewAdministrators(): boolean {
			return this.userAdmin && this.currentUser.email?.toLowerCase() === "lblaskovi@unipu.hr";
		},
		get_userModelPrakse(state): string {
			return state.currentUser.model_prakse == "A" ? appConfig.bpmn_process_name_A : appConfig.bpmn_process_name_B;
		},
	},

	actions: {
		async fetchCurrentUser(response?: Awaited<ReturnType<typeof Student.session>>) {
			response ??= await Student.session();
			const data = response?.student;
			if (!data) return false;

			// Initialize currentUser from fetched data
			this.currentUser.initializeFromData({
				coordinator: response.coordinator,
				ime: data.ime,
				prezime: data.prezime,
				JMBAG: data.JMBAG,
				email: data.email,
				godina_studija: data.godina_studija?.value || "",
				avatar: data.avatar,
				baserow_id: data.id,
				loggedAt: new Date(),
				internship_process: { id: data.process_instance_id, pending_user_task: data.pending_user_task || null },
				model_prakse: data.Model_prakse?.value || data.Model_prakse,
			});
			return true;
		},
		async handleLogin(decodedToken: any, credential: string) {
			sessionStorage.setItem("google-id-token", credential);
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
				const response_student = await Student.session();
				let response = null;

				// If student does not exist, create a new student
				if (!response_student) throw new Error("Prijava nije uspjela");
				if (!response_student.student) {
					response = await Student.create(student_data);
					if (!response?.data) throw new Error("Student nije spremljen");
					if (!(await this.fetchCurrentUser())) throw new Error("Prijava nije uspjela");
					this.userAuthenticated = true;
					await router.push(this.userAdmin ? "/dashboard" : "/odabir-procesa");
				} else {
					await this.fetchCurrentUser(response_student);
					this.userAuthenticated = true;

					// If admin is logged in, redirect to dashboard
					if (this.userAdmin) {
						await router.push("/dashboard");
					}
					// if student is logged in, check if they have an active process instance
					else {
						const processInstance = response_student.student.process_instance_id;
						// Has active process instance, so redirect to moja-praksa
						if (processInstance) {
							await useStudentStore().getPendingUserTask(processInstance);
							if (!sessionStorage.getItem("google-id-token")) return { status: "error" };
							await router.push("/moja-praksa");
						}
						// No active process instance, so redirect to odabir-procesa
						else {
							await router.push("/odabir-procesa");
						}
					}
					response = response_student.student;
				}
				return { status: "success", data: response };
			} catch (error) {
				sessionStorage.clear();
				this.userAuthenticated = false;
				this.currentUser.reset();
				console.error("Login failed");
				return { status: "error", error };
			}
		},

		logout() {
			this.userAuthenticated = false;
			this.currentUser.reset();
			sessionStorage.clear();
			router.go(0); // Refresh the page
		},

		async fetchCompanies(search = "", throwOnError = false) {
			try {
				const response = await Guest.fetchCompanies(search);
				if (!response?.data?.results) throw new Error("Companies could not be fetched");
				return response.data.results;
			} catch (error) {
				if (throwOnError) throw error;
				console.log("Error:", error);
				return [];
			}
		},

		async fetchCompany(id: string | number) {
			try {
				const response = await Guest.fetchCompany(id);
				return response?.data || null;
			} catch (error) {
				console.log("Error:", error);
				return null;
			}
		},

		async createInternshipInstance(selected_model = "A", godina_studija = "1_prijediplomski", jmbag = "0000000000"): Promise<any> {
			try {
				let bpmn_model: string | null = null;
				if (selected_model === "A") {
					bpmn_model = appConfig.bpmn_process_name_A;
				} else {
					bpmn_model = appConfig.bpmn_process_name_B;
				}
				const previousId = this.currentUser.internship_process.id;
				const response_bpmn_engine = await ProcessInstance.create(`${bpmn_model}.bpmn`, previousId);

				if (!("id" in response_bpmn_engine) || !response_bpmn_engine.id) return null;

				const response_bw = await Student.setProcessData(this.currentUser.email, response_bpmn_engine.id, selected_model, godina_studija, jmbag, previousId, response_bpmn_engine.binding);

				await this.fetchCurrentUser();
				return response_bw;
			} catch (error) {
				return null;
			}
		},

		enableMaintenanceMode() {
			this.maintenanceMode = true;
		},

		disableMaintenanceMode() {
			this.maintenanceMode = false;
		},
	},
});
