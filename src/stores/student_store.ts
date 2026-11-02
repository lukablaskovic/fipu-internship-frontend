import { ProcessInstance } from "@/services/bpmn_engine_api";
import { Student } from "@/services/baserow_client_api";
import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main_store";

interface AssignmentData {
	id_zadatak: number;
}

interface ApplicationData {
	student_broj_mobitela: string;
	student_OIB: string;
	mentor_ime: string;
	mentor_prezime: string;
	mentor_email: string;
	detaljan_opis_zadatka: string;
	dogovoreni_broj_sati: string;
	pocetak_prakse: string;
	kraj_prakse: string;
	alokacija_potvrda: string;
	kontakt_potvrda: string;
	mjesto_izvrsavanja: string;
}

interface DiaryData {
	nastavak_radnog_odnosa: boolean;
	prijavljen_rok: string;
	dnevnik_attachment: File;
	potvrda_attachment: File;
}

export const useStudentStore = defineStore("student", {
	state: () => ({
		student_process_instance_data: {} as any,
		allocated_assignment: null as any,
	}),

	actions: {
		async withdrawInternship() {
			const mainStore = useMainStore();
			const id = mainStore.currentUser.internship_process.id;
			if (id === null || id === "") return null;
			const response = await ProcessInstance.withdraw(id);
			await this.getPendingUserTask(id);
			return response;
		},

		async registerPreferences(assignmentsData: AssignmentData[], napomena: string) {
			const mainStore = useMainStore();
			const post_data = {
				Prvi_odabir: [assignmentsData[0].id_zadatak],
				Drugi_odabir: [assignmentsData[1].id_zadatak],
				Treci_odabir: [assignmentsData[2].id_zadatak],
				napomena,
			};

			try {
				const process_instance_id = mainStore.currentUser.internship_process.id;
				const pending_user_task = mainStore.currentUser.internship_process.pending_user_task;
				const response = await ProcessInstance.handleNewInstance(process_instance_id, pending_user_task, post_data);
				return response;
			} catch (error) {
				console.log("[student_store.registerPreferences] Error:", error);
			}
		},

		async direct_application_B(napomena: string) {
			const mainStore = useMainStore();

			try {
				const process_instance_id = mainStore.currentUser.internship_process.id;
				const pending_user_task = mainStore.currentUser.internship_process.pending_user_task;
				const response = await ProcessInstance.handleNewInstance(process_instance_id, pending_user_task, { napomena });
				return response;
			} catch (error) {
				console.log("[student_store.direct_application_B] Error:", error);
			}
		},

		async submitApplicationForm(application_data: ApplicationData) {
			const mainStore = useMainStore();
			const post_data = {
				student_broj_mobitela: application_data.student_broj_mobitela,
				student_OIB: application_data.student_OIB,
				mentor_ime: application_data.mentor_ime,
				mentor_prezime: application_data.mentor_prezime,
				mentor_email: application_data.mentor_email,
				detaljan_opis_zadatka: application_data.detaljan_opis_zadatka,
				dogovoreni_broj_sati: application_data.dogovoreni_broj_sati,
				pocetak_prakse: application_data.pocetak_prakse,
				kraj_prakse: application_data.kraj_prakse,
				alokacija_potvrda: application_data.alokacija_potvrda,
				kontakt_potvrda: application_data.kontakt_potvrda,
				mjesto_izvrsavanja: application_data.mjesto_izvrsavanja,
			};

			try {
				const process_instance_id = mainStore.currentUser.internship_process.id;
				const pending_user_task = mainStore.currentUser.internship_process.pending_user_task;
				const response = await ProcessInstance.handleNewInstance(process_instance_id, pending_user_task, post_data);
				return response;
			} catch (error) {
				console.log("Error:", error);
			}
		},

		async submitDiaryForm(diary_data: DiaryData) {
			const mainStore = useMainStore();
			const post_data = {
				nastavak_radnog_odnosa: diary_data.nastavak_radnog_odnosa,
				prijavljen_rok: diary_data.prijavljen_rok,
			};

			let combinedResponses: Record<string, any> = {};
			try {
				const process_instance_id = mainStore.currentUser.internship_process.id;
				const pending_user_task = mainStore.currentUser.internship_process.pending_user_task;

				const dnevnik_prakse_id = this.student_process_instance_data.variables["id_dnevnik_prakse"];
				combinedResponses.storeDnevnik = await Student.storeDnevnik(dnevnik_prakse_id, diary_data.dnevnik_attachment);
				if (!combinedResponses.storeDnevnik) return null;
				combinedResponses.storeIspunjenaPotvrda = await Student.storeIspunjenaPotvrda(dnevnik_prakse_id, diary_data.potvrda_attachment);

				if (!combinedResponses.storeIspunjenaPotvrda) return null;
				combinedResponses.handleNewInstance = await ProcessInstance.handleNewInstance(process_instance_id, pending_user_task, post_data);
				if (combinedResponses.handleNewInstance?.status !== "OK") return null;
				return combinedResponses;
			} catch (error) {
				console.log("[student_store].submitDiaryForm error: ", error);
			}
		},

		async getInstanceInfo(process_instance_id: string | number) {
			try {
				const response = await ProcessInstance.get(process_instance_id);
				if (response) this.student_process_instance_data = response;
				return response;
			} catch (error) {
				console.log("[student_store].getInstanceInfo error:", error);
			}
		},

		async getPendingUserTask(process_instance_id: string | number) {
			const mainStore = useMainStore();
			const response = await this.getInstanceInfo(process_instance_id);
			if (!response) throw new Error("Process instance could not be fetched");
			const pendingUserTask = response.pending?.[0] || null;
			mainStore.currentUser.internship_process.pending_user_task = pendingUserTask;
			return pendingUserTask;
		},

		async getAllocationsPublic() {
			try {
				const result = await Student.getAllocationsPublic();
				return result;
			} catch (error) {
				console.log("Error:", error);
				return null;
			}
		},

		async getAssignmentDetails(assignment_id: any) {
			try {
				const searchParam = Array.isArray(assignment_id) ? assignment_id[0] : typeof assignment_id === "string" ? assignment_id : null;

				if (searchParam === null) {
					console.log("Invalid assignment_id type.");
					return null;
				}

				const result = await Student.getAssignmentDetails({
					search: searchParam,
				});

				return result;
			} catch (error) {
				console.log("Error:", error);
				return null;
			}
		},
	},
});
