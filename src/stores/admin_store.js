import { defineStore } from "pinia";
import { mainStore } from "@/main";

import { User } from "@/services/gateway_api";
import { Model, ProcessInstance } from "@/services/bpmn_engine_api";
import { Admin, Student } from "@/services/baserow_client_api";
import { SendGrid } from "@/services/sendgrid_client_api";
import Utils from "@/helpers/utils";

export const useAdminStore = defineStore("admin", {
	state: () => ({
		students: [],
		selectedStudent: null,
		companies: [],
		studentsFetched: false,
		newAssignments: [],

		dashboard_data: {
			waiting_for_mark: 0,
			finished_internships: 0,
			ongoing_internships: 0,
			waiting_for_allocation: 0,
			waiting_for_evaluation: 0,
		},

		selectedEvents: [],
		events: [],
		relativeToNowTimestmap: true,
		filterActiveInstances: true,
		availableAssignmentsFilter: true,

		bpmn_diagram: {
			clicked_task_id: null,
			selected_send_task_id: null,
		},

		pdfModalActive: false,
		modalTitle: "",
		pdfSource: "",

		newCompaniesFound: false,
		newAssignmentsFound: false,
	}),

	actions: {
		async getAllocations() {
			try {
				let result = await Admin.getAllocations();
				return result;
			} catch (error) {
				return null;
			}
		},
		async saveUpdatedCompany(postData) {
			try {
				let result = await Admin.saveUpdatedCompany(postData);
				return result;
			} catch (error) {
				console.log("Error:", error);
				return null;
			}
		},
		openPDFModal(allocation, type) {
			const student = this.students.find((stud) => {
				return stud.process_instance_data.variables.id_alokacija === allocation.id_alokacija;
			});

			if (type === "Potvrda") {
				this.modalTitle = "Prazna potvrda o praksi";
				if (student) {
					this.pdfSource = student.process_instance_data.variables.pdf_attachment_url;
				} else {
					console.error("Student not found");
					return;
				}
			} else if (type === "Dnevnik") {
				this.modalTitle = "Dnevnik prakse";
			} else {
				console.error("Invalid type passed to openPDFModal");
				return;
			}
			this.pdfModalActive = true;
		},

		async fetchPDF(query = "") {
			try {
				let result = await Student.fetchPDF(query);
				return result;
			} catch (e) {
				return null;
			}
		},

		setSelectedStudent(student) {
			this.selectedStudent = student;
		},
		async getProcessInstanceData(student) {
			try {
				const response = await ProcessInstance.get(student.process_instance_id);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getTaskInfo(it, task) {
			try {
				const response = await ProcessInstance.getTaskInfo(it, task);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getStudents() {
			try {
				this.studentsFetched = false;
				const students = await User.getStudents();
				if (!students || students.length === 0) {
					this.students = [];
					this.studentsFetched = true;
					return;
				}

				this.dashboard_data = {
					waiting_for_mark: 0,
					finished_internships: 0,
					ongoing_internships: 0,
					waiting_for_allocation: 0,
					waiting_for_evaluation: 0,
				};

				const taskToDashboardMapping = {
					alociranje_profesor: "waiting_for_allocation",
					evaluacija_poslodavac: "waiting_for_evaluation",
					upis_ocjene: "waiting_for_mark",
				};

				const promises = students.map(async (student) => {
					const data = await this.getProcessInstanceData(student);
					student.process_instance_data = data;

					const pendingTask = student.process_instance_data.pending[0];
					student.process_instance_data.pending_task_info = await this.getTaskInfo(student.process_instance_id, pendingTask);

					if (taskToDashboardMapping[pendingTask]) {
						this.dashboard_data[taskToDashboardMapping[pendingTask]]++;
					} else if (student.process_instance_data.state === "finished") {
						this.dashboard_data.finished_internships++;
					}
				});

				await Promise.all(promises);

				this.students = students;
			} catch (error) {
				console.log("Error:", error);
			} finally {
				this.studentsFetched = true;
			}
		},
		async getPreferencesDetailed(id_alokacija) {
			try {
				const response = await Admin.getPreferencesDetailed(id_alokacija);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},

		async searchModels() {
			try {
				const response = await Model.search();
				const model = response.results.find((result) => result.model_path === `${mainStore.bpmn_process_name}.bpmn`);

				if (model && model.instances) {
					this.dashboard_data.ongoing_internships = model.instances.length;
				}

				return response.results;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getEvents() {
			try {
				const response = await Model.getEvents();
				if (Utils.isArrayEmpty(response.results)) return null;
				else {
					response.results.forEach((event) => {
						const student = this.students.find((stud) => stud.process_instance_id === event.instance_id);
						if (student) {
							event.student_ime = student["ime"];
							event.student_prezime = student["prezime"];
							event.student_JMBAG = student["JMBAG"];
							event.student_email = student["email"];
						}
					});
					this.events = response.results;

					return this.events;
				}
			} catch (error) {
				console.log("Error:", error);
			}
		},

		async handleTask(id_zadatak, action) {
			try {
				const response = await Admin.handleTask(id_zadatak, action);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async handleNewInstance(instance_id, current_task, post_data) {
			try {
				const response = await ProcessInstance.handleNewInstance(instance_id, current_task, post_data);

				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async sendAnAdditionalEmail(postData, to, template) {
			try {
				const response = await SendGrid.sendEmail(postData, to, template);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
	},
	persist: true,
});
