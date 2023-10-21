import { defineStore } from "pinia";
import { mainStore } from "@/main";

import { ProcessInstance } from "@/services/bpmn_engine_api";
import { Student } from "@/services/baserow_client_api";

export const useStudentStore = defineStore("student", {
	state: () => ({
		student_process_instance_data: {},
		allocated_assignment: null,
	}),
	actions: {
		async registerPreferences(assignmentsData, napomena) {
			let post_data = {
				JMBAG: mainStore.currentUser["JMBAG"],
				Student: [mainStore.currentUser["JMBAG"]],
				student_email: mainStore.currentUser["email"],
				student_ime: mainStore.currentUser["ime"],
				student_prezime: mainStore.currentUser["prezime"],
				student_godina_studija: mainStore.currentUser["godina_studija"],
				Prvi_odabir: [assignmentsData[0]["id_zadatak"]],
				Drugi_odabir: [assignmentsData[1]["id_zadatak"]],
				Treci_odabir: [assignmentsData[2]["id_zadatak"]],
				napomena: napomena,
				process_instance_id: mainStore.currentUser.internship_process.id,
				frontend_url: import.meta.env.VITE_FRONTEND_URL,
			};
			try {
				let process_instance_id = mainStore.currentUser.internship_process.id;
				let pending_user_task = mainStore.currentUser.internship_process.pending_user_task;

				const response = await ProcessInstance.handleNewInstance(process_instance_id, pending_user_task, post_data);

				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async submitApplicationForm(application_data) {
			let post_data = {
				student_broj_mobitela: application_data["student_broj_mobitela"],
				student_OIB: application_data["student_OIB"],
				mentor_ime: application_data["mentor_ime"],
				mentor_prezime: application_data["mentor_prezime"],
				mentor_email: application_data["mentor_email"],
				detaljan_opis_zadatka: application_data["detaljan_opis_zadatka"],
				dogovoreni_broj_sati: application_data["dogovoreni_broj_sati"],
				pocetak_prakse: application_data["pocetak_prakse"],
				kraj_prakse: application_data["kraj_prakse"],
				alokacija_potvrda: application_data["alokacija_potvrda"],
				kontakt_potvrda: application_data["kontakt_potvrda"],
				mjesto_izvrsavanja: application_data["mjesto_izvrsavanja"],
			};

			try {
				let process_instance_id = mainStore.currentUser.internship_process.id;
				let pending_user_task = mainStore.currentUser.internship_process.pending_user_task;
				const response = await ProcessInstance.handleNewInstance(process_instance_id, pending_user_task, post_data);

				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},

		async submitDiaryForm(diary_data) {
			let post_data = {
				nastavak_radnog_odnosa: diary_data["nastavak_radnog_odnosa"],
				prijavljen_rok: diary_data["prijavljen_rok"],
			};

			let combinedResponses = {};
			try {
				let process_instance_id = mainStore.currentUser.internship_process.id;
				let pending_user_task = mainStore.currentUser.internship_process.pending_user_task;

				combinedResponses.handleNewInstance = await ProcessInstance.handleNewInstance(process_instance_id, pending_user_task, post_data);

				const dnevnik_prakse_id = this.student_process_instance_data.variables["id_dnevnik_prakse"];
				combinedResponses.storeDnevnik = await Student.storeDnevnik(dnevnik_prakse_id, diary_data.dnevnik_attachment);

				combinedResponses.storeIspunjenaPotvrda = await Student.storeIspunjenaPotvrda(dnevnik_prakse_id, diary_data.potvrda_attachment);

				return combinedResponses;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getInstanceInfo(process_instance_id) {
			try {
				const response = await ProcessInstance.get(process_instance_id);
				this.student_process_instance_data = response;

				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getPendingUserTask(process_instance_id) {
			try {
				const response = await this.getInstanceInfo(process_instance_id);
				let pendingUserTask = null;
				if (response.pending && response.pending.length) {
					pendingUserTask = response.pending[0];
					mainStore.currentUser.internship_process.pending_user_task = pendingUserTask;

					return pendingUserTask;
				}
			} catch (error) {
				console.log("Error:", error);
			}
		},
		async getAllocationsPublic() {
			try {
				let result = await Student.getAllocationsPublic();

				return result;
			} catch (error) {
				console.log("Error:", error);
				return null;
			}
		},
		async getAssignmentDetails(assignment_id) {
			try {
				let result = await Student.getAssignmentDetails({
					search: assignment_id,
				});

				return result;
			} catch (error) {
				console.log("Error:", error);
				return null;
			}
		},
	},
	persist: true,
});
