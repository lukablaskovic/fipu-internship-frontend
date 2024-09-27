import { mainStore } from "@/main.js";
import { defineStore } from "pinia";

import { Guest, Student } from "@/services/baserow_client_api.js";
import { ProcessInstance } from "@/services/bpmn_engine_api.js";

export const useGuestStore = defineStore("guest", {
	state: () => ({
		assignments: [],
		checkedAssignments: [],
		isLoading: false,
		error: null,
	}),
	getters: {},
	actions: {
		async createInternshipInstance(selected_model = "A") {
			try {
				let bpmn_model = null;
				if (selected_model === "A") {
					bpmn_model = mainStore.bpmn_process_name_A;
				}
				const response_bpmn_engine = await ProcessInstance.create(`${bpmn_model}.bpmn`);

				const response_bw = await Student.setProcessData(mainStore.currentUser.email, response_bpmn_engine.id, selected_model);

				await mainStore.fetchCurrentUser();

				console.log(response_bw);
				return response_bw;
			} catch (error) {
				return error;
			}
		},
		async fetchAvailableAssignments() {
			this.isLoading = true;
			this.error = null;
			try {
				let result = await Guest.fetchAvailableAssignments();
				this.assignments = result.results;
				return this.assignments;
			} catch (e) {
				this.error = e.message;
			} finally {
				this.isLoading = false;
			}
		},
		addAssignment(assignment) {
			const assignmentExists = this.checkedAssignments.some((a) => a["id_zadatak"] === assignment["id_zadatak"]);
			if (!assignmentExists) {
				this.checkedAssignments.push(assignment);
			}
		},
		removeAssignment(assignment) {
			this.checkedAssignments = this.checkedAssignments.filter((a) => a["id_zadatak"] !== assignment["id_zadatak"]);
		},
		resetAssignments() {
			this.checkedAssignments = [];
		},
		async submitNewInternshipProject(formData) {
			const postData = {
				...formData,
				Poslodavac: [],
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
});
