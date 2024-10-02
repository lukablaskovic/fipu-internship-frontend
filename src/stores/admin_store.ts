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
	b_waiting_for_assignment_approval: number;
	b_waiting_for_direct_assignment: number;

	a_finished_internships: number;
	b_finished_internships: number;

	a_ongoing_internships: number;
	b_ongoing_internships: number;
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
	model: {
		model_path: string;
	};
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
		students: [] as Student[],
		selectedStudent: null as Student | null,
		companies: [] as any[],
		studentsFetched: false,
		newAssignments: [] as any[],

		//dashboard_data
		dashboard_data: {
			waiting_for_mark: 0,
			finished_internships: 0,
			ongoing_internships: 0,
			waiting_for_allocation: 0,
			waiting_for_evaluation: 0,
			b_waiting_for_assignment_approval: 0,
			b_waiting_for_direct_assignment: 0,

			a_finished_internships: 0,
			b_finished_internships: 0,

			a_ongoing_internships: 0,
			b_ongoing_internships: 0,
		} as DashboardData,
		//dashboard_data_filters
		selectedEvents: [] as any[], // Assuming events are not yet typed
		events: [] as Event[], // Typed array of Event
		relativeToNowTimestmap: true,
		filterActiveInstances: true,
		filterFinishedInstances: true,
		availableAssignmentsFilter: true,

		filterModelA: "AB",

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
		openPDF(allocation: any, type: string) {
			const student = this.students.find((stud) => {
				return stud.process_instance_data.variables.id_alokacija === allocation.id_alokacija;
			});

			if (type === "Potvrda") {
				this.modalTitle = "Potvrda o praksi (nepotpisano)";
				if (student) {
					console.log("student", student);
					this.pdfSource = student.process_instance_data.variables.pdf_attachment_url;
					window.open(this.pdfSource, "_blank");
				} else {
					console.error("Student not found");
					return;
				}
			} else if (type === "Dnevnik") {
				this.modalTitle = "Dnevnik prakse";
			} else {
				console.error("Invalid type passed to openPDF");
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
				console.log("[admin_store].getTaskInfo: ", error);
			}
		},
		async getStudents() {
			try {
				this.studentsFetched = false;
				const response = await Student.fetch();
				// only students with process_instance_id are relevant
				const students = response.data.results.filter((student: Student) => student.process_instance_id);
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
					b_waiting_for_assignment_approval: 0,
					b_waiting_for_direct_assignment: 0,

					a_finished_internships: 0,
					b_finished_internships: 0,

					a_ongoing_internships: 0,
					b_ongoing_internships: 0,
				};

				const taskToDashboardMapping: Record<string, keyof DashboardData> = {
					alociranje_profesor: "waiting_for_allocation",
					evaluacija_poslodavac: "waiting_for_evaluation",
					upis_ocjene: "waiting_for_mark",
					model_b_odobrenje_zadatka: "b_waiting_for_assignment_approval",
					model_b_direktna_prijava_student: "b_waiting_for_direct_assignment",
				};

				const promises = students.map(async (student: Student) => {
					const data = await this.getProcessInstanceData(student);
					console.log("student.process_instance_data", data);
					student.process_instance_data = data;

					const pendingTask = student.process_instance_data.pending[0];

					student.process_instance_data.pending_task_info = await this.getTaskInfo(student.process_instance_id, pendingTask);

					if (taskToDashboardMapping[pendingTask]) {
						this.dashboard_data[taskToDashboardMapping[pendingTask]]++;
					} else if (student.process_instance_data.state === "finished") {
						this.dashboard_data.finished_internships++;
						if (student.process_instance_data.model.model_path === `${mainStore.bpmn_process_name_A}.bpmn`) {
							this.dashboard_data.a_finished_internships++;
						} else if (student.process_instance_data.model.model_path === `${mainStore.bpmn_process_name_B}.bpmn`) {
							this.dashboard_data.b_finished_internships++;
						}
					}
				});

				await Promise.all(promises);

				this.students = students;
			} catch (error) {
				console.log("[admin_store].getStudents(): ", error);
			} finally {
				this.studentsFetched = true;
			}
		},
		async getPreferencesDetailed(id_alokacija: number) {
			try {
				const response = await Admin.getPreferencesDetailed(id_alokacija);
				return response;
			} catch (error) {
				console.log("[admin_store.getPreferencesDetailed(): ", error);
			}
		},

		async searchModels() {
			try {
				const response = await Model.search();

				const model_a = response.results.find((result: any) => result.model_path === `${mainStore.bpmn_process_name_A}.bpmn`);
				const model_b = response.results.find((result: any) => result.model_path === `${mainStore.bpmn_process_name_B}.bpmn`);

				console.log("model_a", model_a);
				console.log("model_b", model_b);

				let model_a_instances = model_a?.instances || [];
				let model_b_instances = model_b?.instances || [];

				this.dashboard_data.a_ongoing_internships = model_a_instances.length - this.dashboard_data.a_finished_internships;
				this.dashboard_data.b_ongoing_internships = model_b_instances.length - this.dashboard_data.b_finished_internships;

				let model_all_instances = model_a_instances.concat(model_b_instances);

				// Safeguard: check if there are combined instances and calculate ongoing internships
				if (model_a && model_b && model_all_instances.length) {
					this.dashboard_data.ongoing_internships = model_all_instances.length - this.dashboard_data.finished_internships;
				}

				return response.results;
			} catch (error) {
				console.log("[admin_store].searchModels(): ", error);
			}
		},
		async getEvents() {
			try {
				const response = await Model.getEvents();
				if (Utils.isArrayEmpty(response.results)) return null;
				else {
					response.results.forEach((event: Event) => {
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
				console.log("[admin_store].getEvents(): ", error);
			}
		},

		async handleTask(id_zadatak: number, action: string) {
			try {
				const response = await Admin.handleTask(id_zadatak, action);
				return response;
			} catch (error) {
				console.log("[admin_store].handleTask(): ", error);
			}
		},
		async handleNewInstance(instance_id: string, current_task: string, post_data: any) {
			try {
				const response = await ProcessInstance.handleNewInstance(instance_id, current_task, post_data);
				return response;
			} catch (error) {
				console.log("[admin_store].handleNewInstance: ", error);
			}
		},
		async sendAnAdditionalEmail(postData: any, to: string, template: string) {
			try {
				const response = await SendGrid.sendEmail(postData, to, template);
				return response;
			} catch (error) {
				console.log("[admin_store].sendAnAdditionalEmail(): ", error);
			}
		},
	},
	persist: {
		storage: sessionStorage,
		debug: true,
	},
});
