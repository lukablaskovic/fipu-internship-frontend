import { defineStore } from "pinia";
import { mainStore } from "@/main";

import { Model, ProcessInstance } from "@/services/bpmn_engine_api";
import { Admin, Student } from "@/services/baserow_client_api";
import { SendGrid } from "@/services/sendgrid_client_api";
import Utils from "@/helpers/utils";

// Define interfaces for state properties
interface DashboardData {
	waiting_for_mark: number;
	finished_internships: number;
	ongoing_internships: number;
	waiting_for_allocation: number;
	waiting_for_evaluation: number;
}

interface BPMNDiagram {
	clicked_task_id: string | null;
	selected_send_task_id: string | null;
}

interface StudentProcessData {
	variables: {
		id_alokacija: number;
		pdf_attachment_url: string;
	};
	pending: any[];
	pending_task_info?: any;
	state: string;
}

interface Student {
	process_instance_data: StudentProcessData;
	process_instance_id: string;
	ime: string;
	prezime: string;
	JMBAG: string;
	email: string;
}

interface Event {
	instance_id: string;
	student_ime?: string;
	student_prezime?: string;
	student_JMBAG?: string;
	student_email?: string;
}

export const useAdminStore = defineStore("admin", {
	state: () => ({
		students: [] as Student[], // Typed array of Student
		selectedStudent: null as Student | null, // Nullable Student
		companies: [] as any[], // Assuming companies are not yet typed
		studentsFetched: false,
		newAssignments: [] as any[], // Assuming assignments are not yet typed

		dashboard_data: {
			waiting_for_mark: 0,
			finished_internships: 0,
			ongoing_internships: 0,
			waiting_for_allocation: 0,
			waiting_for_evaluation: 0,
		} as DashboardData,

		selectedEvents: [] as any[], // Assuming events are not yet typed
		events: [] as Event[], // Typed array of Event
		relativeToNowTimestmap: true,
		filterActiveInstances: true,
		filterFinishedInstances: true,
		availableAssignmentsFilter: true,

		bpmn_diagram: {
			clicked_task_id: null,
			selected_send_task_id: null,
		} as BPMNDiagram,

		pdfModalActive: false,
		modalTitle: "",
		pdfSource: "",

		newCompaniesFound: false,
		newAssignmentsFound: false,
	}),

	actions: {
		async getAllocations() {
			try {
				const result = await Admin.getAllocations();
				return result;
			} catch (error) {
				return null;
			}
		},
		async saveUpdatedCompany(postData: any) {
			try {
				const result = await Admin.saveUpdatedCompany(postData);
				return result;
			} catch (error) {
				console.log("Error:", error);
				return null;
			}
		},
		openPDFModal(allocation: any, type: string) {
			const student = this.students.find((stud) => {
				return stud.process_instance_data.variables.id_alokacija === allocation.id_alokacija;
			});

			if (type === "Potvrda") {
				this.modalTitle = "Potvrda o praksi (nepotpisano)";
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

		async fetchPDF(query: string = "") {
			try {
				const result = await Student.fetchPDF(query);
				return result;
			} catch (e) {
				return null;
			}
		},

		setSelectedStudent(student: Student | null) {
			this.selectedStudent = student;
		},
		async getProcessInstanceData(student: Student) {
			try {
				const response = await ProcessInstance.get(student.process_instance_id);
				console.log("adminStore, getProcessInstanceData", response); //ok
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getTaskInfo(it: string, task: string) {
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
				const response = await Student.fetch();
				const students = response.data.results;
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

				const taskToDashboardMapping: Record<string, keyof DashboardData> = {
					alociranje_profesor: "waiting_for_allocation",
					evaluacija_poslodavac: "waiting_for_evaluation",
					upis_ocjene: "waiting_for_mark",
				};

				const promises = students.map(async (student: Student) => {
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
		async getPreferencesDetailed(id_alokacija: number) {
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
				const model = response.results.find((result) => result.model_path === `${mainStore.bpmn_process_name_A}.bpmn`);
				if (model && model.instances) {
					this.dashboard_data.ongoing_internships = model.instances.length - this.dashboard_data.finished_internships;
				}

				return response.results;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getEvents() {
			try {
				const response = await Model.getEvents();
				console.log("adminStore, getEvents", response); //ok
				if (Utils.isArrayEmpty(response.results)) return null;
				else {
					response.results.forEach((event: Event) => {
						console.log("this.students", this.students);
						const student = this.students.find((stud) => stud.process_instance_id === event.instance_id);
						if (student) {
							event.student_ime = student.ime;
							event.student_prezime = student.prezime;
							event.student_JMBAG = student.JMBAG;
							event.student_email = student.email;
						}
					});
					this.events = response.results;

					return this.events;
				}
			} catch (error) {
				console.log("Error:", error);
			}
		},

		async handleTask(id_zadatak: number, action: string) {
			try {
				const response = await Admin.handleTask(id_zadatak, action);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async handleNewInstance(instance_id: string, current_task: string, post_data: any) {
			try {
				const response = await ProcessInstance.handleNewInstance(instance_id, current_task, post_data);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async sendAnAdditionalEmail(postData: any, to: string, template: string) {
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
