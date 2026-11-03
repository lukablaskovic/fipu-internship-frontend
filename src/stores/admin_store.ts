import { persistSession } from "@/helpers/persist-session";
import { appConfig } from "@/config";
import { defineStore } from "pinia";

import { Model, ProcessInstance, type ProcessInstanceData } from "@/services/bpmn_engine_api";
import { Admin, Student, fetchAvailableAssignments } from "@/services/baserow_client_api";
import { EmailJS } from "@/services/emailjs_client_api";
import Utils from "@/helpers/utils";

let studentsRequest: Promise<boolean> | null = null;
let assignmentsRequest: Promise<any[] | undefined> | null = null;

// Define interfaces for state properties
interface DashboardData {
	waiting_for_mark: number;
	finished_internships: number;
	cancelled_internships: number;
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

interface InternshipStudent {
	process_instance_data: ProcessInstanceData;
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
		students: [] as InternshipStudent[],
		studentsFetched: false,

		//dashboard_data
		dashboard_data: {
			waiting_for_mark: 0,
			finished_internships: 0,
			cancelled_internships: 0,
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
		selectedEvents: null as string[] | null,
		events: [] as Event[], // Typed array of Event
		relativeToNowTimestmap: true,
		filterActiveInstances: false,

		filterFinishedInstances: false,

		filterModelState: "AB",
		filterInternshipStage: "all",

		newCompaniesFound: false,
		newAssignmentsFound: false,
	}),

	actions: {
		getAssignments(): Promise<any[] | undefined> {
			return assignmentsRequest ??= fetchAvailableAssignments().then((assignments) => {
				if (Array.isArray(assignments)) {
					this.newAssignmentsFound = assignments.some((task) => task.voditelj_odobrio?.value === "u razradi");
				}
				return assignments;
			}).finally(() => { assignmentsRequest = null; });
		},
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
		openPDF(allocation: any) {
			const student = this.students.find((student) => student.process_instance_data.variables.id_alokacija === allocation.id_alokacija);
			if (!student) {
				console.error("Student not found");
				return;
			}
			window.open(student.process_instance_data.variables.pdf_attachment_url, "_blank");
		},

		async fetchPDF(query: string = "") {
			try {
				const result = await Student.fetchPDF(query);
				return result;
			} catch (e) {
				return null;
			}
		},

		async getProcessInstanceData(student: InternshipStudent) {
			try {
				const response = await ProcessInstance.get(student.process_instance_id);

				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		getStudents(): Promise<boolean> {
			// The sidebar and page can request the same student list on mount.
			return studentsRequest ??= this.fetchStudents().finally(() => { studentsRequest = null; });
		},
		async fetchStudents() {
			try {
				this.studentsFetched = false;
				const response = await Student.fetch();
				// only students with process_instance_id are relevant
				const students = response.data.results.filter((student: InternshipStudent) => student.process_instance_id);
				if (!students || students.length === 0) {
					this.students = [];
					this.studentsFetched = true;
					return true;
				}

				this.dashboard_data = {
					waiting_for_mark: 0,
					finished_internships: 0,
					cancelled_internships: 0,
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

				const promises = students.map(async (student: InternshipStudent) => {
					const data = await this.getProcessInstanceData(student);
					if (!data) throw new Error("Process instance could not be fetched");
					student.process_instance_data = data;

					const pendingTask = student.process_instance_data.pending[0];

					if (student.process_instance_data.state === "cancelled") {
						this.dashboard_data.cancelled_internships++;
					} else if (!student.process_instance_data.active_event && taskToDashboardMapping[pendingTask]) {
						this.dashboard_data[taskToDashboardMapping[pendingTask]]++;
					} else if (student.process_instance_data.state === "finished") {
						this.dashboard_data.finished_internships++;
						if (student.process_instance_data.model.model_path === `${appConfig.bpmn_process_name_A}.bpmn`) {
							this.dashboard_data.a_finished_internships++;
						} else if (student.process_instance_data.model.model_path === `${appConfig.bpmn_process_name_B}.bpmn`) {
							this.dashboard_data.b_finished_internships++;
						}
					}
				});

				await Promise.all(promises);

				this.students = students;
				return true;
			} catch (error) {
				console.log("[admin_store].getStudents(): ", error);
				return false;
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
				if (!response) return;

				const model_a = response.results.find((result) => result.model_path === `${appConfig.bpmn_process_name_A}.bpmn`);
				const model_b = response.results.find((result) => result.model_path === `${appConfig.bpmn_process_name_B}.bpmn`);

				let model_a_instances = model_a?.instances || [];
				let model_b_instances = model_b?.instances || [];

				const ongoing = new Set(this.students.filter((student) => !["cancelled", "finished"].includes(student.process_instance_data.state)).map((student) => student.process_instance_id));
				this.dashboard_data.a_ongoing_internships = model_a_instances.filter(id => ongoing.has(id)).length;
				this.dashboard_data.b_ongoing_internships = model_b_instances.filter(id => ongoing.has(id)).length;
				this.dashboard_data.ongoing_internships = this.dashboard_data.a_ongoing_internships + this.dashboard_data.b_ongoing_internships;

				return response.results;
			} catch (error) {
				console.log("[admin_store].searchModels(): ", error);
			}
		},
		async getEvents() {
			try {
				const response = await Model.getEvents();
				if (!response || Utils.isArrayEmpty(response.results)) return null;
				else {
					const previous = new Map<string, string>();
					for (const event of response.results) {
						if (event.activity_variables?.previous_instance_id) previous.set(event.instance_id, event.activity_variables.previous_instance_id);
					}
					const owners = new Map<string, InternshipStudent>();
					for (const student of this.students) {
						let id: string | undefined = student.process_instance_id;
						while (id && !owners.has(id)) {
							owners.set(id, student);
							id = previous.get(id);
						}
					}
					response.results.forEach((event: Event) => {
						const student = owners.get(event.instance_id);
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

		async handleTask(id_zadatak: string | number, action: "odobreno" | "odbijeno") {
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
				const response = await EmailJS.sendEmail(postData, to, template);
				return response;
			} catch (error) {
				console.log("[admin_store].sendAnAdditionalEmail(): ", error);
			}
		},
	},
	persist: persistSession(["selectedEvents", "relativeToNowTimestmap", "filterActiveInstances", "filterFinishedInstances", "filterModelState", "filterInternshipStage"]),
});
