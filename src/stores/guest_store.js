import { defineStore } from "pinia";
import { mainStore } from "@/main.js";

import { Guest } from "@/services/baserow_client_api.js";
import { ProcessInstance } from "@/services/bpmn_engine_api.js";
import { Auth } from "@/services/gateway_api.js";

export const useGuestStore = defineStore("guest", {
	state: () => ({
		assignments: [],
		checkedAssignments: [],
		isLoading: false,
		error: null,
	}),
	getters: {},
	actions: {
		async registerStudent(postData) {
			try {
				const response = await Auth.register(postData);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async createInternshipInstance() {
			try {
				const response = await ProcessInstance.create(`${mainStore.bpmn_process_name}.bpmn`);
				return response;
			} catch (error) {
				console.log("Error:", error);
				return error;
			}
		},
		async update_process_instance(student_id, process_instance_id) {
			try {
				const response = await Auth.update_process_instance(student_id, process_instance_id);
				return response;
			} catch (error) {
				console.log("Error:", error);
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
			console.log(this.checkedAssignments);
		},
		removeAssignment(assignment) {
			this.checkedAssignments = this.checkedAssignments.filter((a) => a["id_zadatak"] !== assignment["id_zadatak"]);
		},
		resetAssignments() {
			this.checkedAssignments = [];
		},
		async submitNewInternshipProject(formData) {
			// Create the basic structure of postData from formData
			const postData = {
				...formData,
				Poslodavac: [],
			};

			// Handle the Poslodavac field
			if (formData.Poslodavac) {
				postData.Poslodavac = [formData.Poslodavac.label];
			} else if (formData.Poslodavac_novi_naziv) {
				postData.Poslodavac = [formData.Poslodavac_novi_naziv];
			}

			// Remove the Poslodavac_novi_naziv since it's not needed anymore
			delete postData.Poslodavac_novi_naziv;

			// Conditionally add angazman_fipu
			if (formData.angazman_selekcija === false) {
				postData.angazman_fipu = "Ne";
			} else if (formData.angazman_selekcija === true && !formData.angazman_fipu) {
				postData.angazman_fipu = "";
			} else {
				delete postData.angazman_fipu;
			}
			console.log("postData", postData);
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
