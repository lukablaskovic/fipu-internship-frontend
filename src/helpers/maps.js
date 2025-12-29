import Utils from "./utils";

function getMappedProperty(arr, key, keyValue, prop) {
	const item = arr.find((item) => item[key] === keyValue);
	return item ? item[prop] : keyValue;
}

class StudentMappings {
	static GodinaStudijaMappings = [
		{ id: 0, label: "2. prijediplomski", dbLabel: "2_prijediplomski" },
		{ id: 1, label: "3. prijediplomski", dbLabel: "3_prijediplomski" },
		{ id: 2, label: "1. diplomski", dbLabel: "1_diplomski" },
		{ id: 3, label: "2. diplomski", dbLabel: "2_diplomski" },
	];

	static getGodinaStudija(dbLabel) {
		const gs = this.GodinaStudijaMappings.find((gs) => gs.dbLabel === dbLabel);
		return gs ? gs.label : dbLabel;
	}

	static statusZahtjeva = [
		{
			id: 1,
			label: "Student prihvaćen",
			dbLabel: "student_prihvaćen",
			color: "success",
		},
		{
			id: 2,
			label: "Student odbijen",
			dbLabel: "student_odbijen",
			color: "danger",
		},
		{
			id: 3,
			label: "Evaluacija u tijeku",
			dbLabel: "evaluacija_u_tijeku",
			color: "warning",
		},
		{
			id: 4,
			label: "Student odustao",
			dbLabel: "student_odustao",
			color: "danger",
		},
		{
			id: 5,
			label: "Profesor poništio",
			dbLabel: "profesor_ponistio",
			color: "warning",
		},
	];
	static getStatusProperty(dbLabel, property) {
		return getMappedProperty(this.statusZahtjeva, "dbLabel", dbLabel, property);
	}
}
import Student_ChooseAvailableAssignments from "@/components/Internship/Student_ChooseAvailableAssignments.vue";
import Student_WaitingForEvaluation from "@/components/Internship/Student_WaitingForEvaluation.vue";
import Student_WaitingForAllocation from "@/components/Internship/Student_WaitingForAllocation.vue";
import Student_InternshipFinished from "@/components/Internship/Student_InternshipFinished.vue";
import Student_DnevnikPrakseForm from "@/components/Internship/Student_DnevnikPrakseForm.vue";
import Student_WaitingForMark from "@/components/Internship/Student_WaitingForMark.vue";
import Student_PrijavnicaForm from "@/components/Internship/Student_PrijavnicaForm.vue";

//model B
import Model_B_Student_WaitingForApproval from "@/components/Internship/Model_B/Model_B_Student_WaitingForApproval.vue";
import Model_B_Student_DirectApplication from "@/components/Internship/Model_B/Model_B_Student_DirectApplication.vue";

import { adminStore } from "@/main";

// Custom - Hardcoded frontend functionality
class SendTaskMappings {
	static tasks = [
		{
			_id: "obavjestavanje_studenta_nakon_ponistavanja_email",
			to: "student_email",
			template: "student_after_return",
			body: {},
		},
		{
			_id: "obavjestavanje_poslodavca_nakon_alokacije",
			to: "poslodavac_email",
			template: "poslodavac_after_allocation",
			body: {
				student_ime: "",
				student_prezime: "",
				student_godina_studija: "",
				student_email: "",
				Alocirani_zadatak: "",
				process_instance_id: "",
				evaluacija_url: (processInstanceId) => `${endpoints.VITE_FRONTEND_URL}/evaluacija/${processInstanceId}`,
			},
		},

		{
			_id: "obavjestavanje_studenta_nakon_alokacije",
			to: "student_email",
			template: "student_after_allocation",
			body: {
				poslodavac_email: "",
				Alocirani_zadatak: "",
				opis_zadatka: "",
			},
		},
		{
			_id: "obavjestavanje_studenta_nakon_odbijanja_email",
			to: "student_email",
			template: "student_after_refusal",
			body: {},
		},
		{
			_id: "obavjestavanje_studenta_nakon_prihvacanja_email",
			to: "student_email",
			template: "student_after_approval",
			body: {
				process_instance_id: "",
				poslodavac_naziv: "",
			},
		},
		{
			_id: "slanje_potvrde_student_email",
			to: "student_email",
			template: "student_potvrda_pdf",
			body: {
				attachment_name: "", //${student_prezime}_potvrda.pdf
				process_instance_id: "",
				pdf_attachment_url: "",
				mentor_email: "",
			},
		},
		{
			_id: "slanje_potvrde_mentor_email",
			to: "mentor_email",
			template: "mentor_potvrda_pdf",
			body: {
				attachment_name: "", //${student_prezime}_potvrda.pdf
				process_instance_id: "",
				pdf_attachment_url: "",
				student_email: "",
				student_ime: "",
				student_prezime: "",
			},
		},
	];
}
class UserTaskMappings {
	static tasks = [
		{
			order: 1,
			model_type: "A",
			_id: "odabiranje_zadatka_student",
			name: "Mora odabrati zadatke",
			form_title: "Prijavljene preferencije",
			snackbar_msg: "",
			snackbar_color: "",
			bpmn_pending_info_msg: "Student još nije prijavio preferencije.",
			bpmn_task_color: "#79d4f2", //fipu blue
			component: Student_ChooseAvailableAssignments,
		},
		{
			order: 2,
			model_type: "A",
			_id: "alociranje_profesor",
			name: "Čeka alokaciju profesora",
			form_title: "Alokacija studenta",
			snackbar_msg: "Radnja registrirana. Hvala!",
			snackbar_color: "success",
			bpmn_task_color: "#EF4444", //bg-red-500
			component: Student_WaitingForAllocation,
		},
		{
			order: 3,
			model_type: "A",
			_id: "evaluacija_poslodavac",
			name: "Evaluacija poslodavca u tijeku",
			form_title: "Evaluacija poslodavca",
			snackbar_msg: "Evaluacija pohranjena. Hvala!",
			snackbar_color: "success",
			bpmn_task_color: "#EF4444", //bg-red-500
			component: Student_WaitingForEvaluation,
		},
		{
			order: 4,
			model_type: "A",
			_id: "ispunjavanje_prijavnice_student",
			name: "Mora ispuniti prijavnicu",
			snackbar_msg: "Prijavnica pohranjena. Hvala!",
			bpmn_pending_info_msg: "Student nije još ispunio prijavnicu.",
			snackbar_color: "success",
			bpmn_task_color: "#79d4f2",
			form_title: "Ispunjena prijavnica",
			component: Student_PrijavnicaForm,
		},
		{
			order: 5,
			model_type: "A",
			_id: "predavanje_dnevnika_student",
			name: "Mora predati dnevnik prakse",
			bpmn_pending_info_msg: "Student nije još predao dnevnik prakse i ispunjenu potvrdu.",
			snackbar_msg: "Dnevnik i potvrda pohranjeni.",
			bpmn_task_color: "#79d4f2",
			snackbar_color: "success",
			form_title: "Dnevnik prakse",
			component: Student_DnevnikPrakseForm, //DnevnikPrakseForm
		},
		{
			order: 6,
			model_type: "A",
			_id: "upis_ocjene",
			name: "Potrebno je potvrditi upis ocjene",
			snackbar_msg: "Upis ocjene potvrđen. Hvala!",
			snackbar_color: "success",
			bpmn_task_color: "#EF4444", //bg-red-500
			form_title: "Upis ocjene (ISVU)",
			component: Student_WaitingForMark,
		},
		{
			order: 7,
			model_type: "A",
			_id: "end_event_student",
			name: "Student ocjenjen",
			snackbar_msg: "",
			snackbar_color: "",
			form_title: "Student ocjenjen",
			component: Student_InternshipFinished,
		},
		{
			order: 1,
			model_type: "B",
			_id: "model_b_odobrenje_zadatka",
			name: "Čeka odobrenje zadatka",
			form_title: "Odobrenje zadatka",
			snackbar_msg: "Radnja registrirana. Hvala!",
			snackbar_color: "success",
			bpmn_pending_info_msg: "Student čeka odobrenje zadatka.",
			bpmn_task_color: "#EF4444", //bg-red-500
			component: Model_B_Student_WaitingForApproval,
		},
		{
			order: 2,
			model_type: "B",
			_id: "model_b_direktna_prijava_student",
			name: "Student se mora prijaviti",
			form_title: "Direktna prijava studenta",
			snackbar_msg: "",
			snackbar_color: "",
			bpmn_pending_info_msg: "Student se još nije prijavio na zadatak.",
			bpmn_task_color: "#79d4f2",
			component: Model_B_Student_DirectApplication,
		},
	];

	static getTaskProperty(taskId, property, state = "running") {
		if (state === "finished") {
			taskId = "end_event_student";

			return getMappedProperty(this.tasks, "_id", "end_event_student", property);
		} else return getMappedProperty(this.tasks, "_id", taskId, property);
	}
}

import {
	mdiRayStartArrow,
	mdiClipboardCheck,
	mdiNumeric,
	mdiHandshake,
	mdiProgressClock,
	mdiCheck,
	mdiThumbsUpDownOutline,
	mdiNoteCheck,
	mdiAccountTie,
	mdiNotebook,
	mdiFileDocumentPlus,
	mdiRayEnd,
	mdiContentSaveOutline,
	mdiApi,
	mdiEmailArrowRight,
	mdiCertificate,
	mdiCancel,
} from "@mdi/js";

import { endpoints } from "@/config";

class ActivityEventMappings {
	static events = [
		{
			activity_id: "start_event_student",
			icon: mdiRayStartArrow,
			type: "info",
			message: "Pokrenut proces",
		},
		{
			activity_id: "odabiranje_zadatka_student",
			icon: mdiNumeric,
			type: "success",
			message: "Prijavljene preferencije",
		},
		{
			activity_id: "spremanje_preferencije",
			icon: mdiProgressClock,
			type: "danger",
			message: "Čeka alokaciju",
		},
		{
			activity_id: "alociranje_profesor",
			icon: mdiNoteCheck,
			type: "success",
			message: "Profesor alocirao",
		},
		{
			activity_id: "odabir_prihvacen",
			icon: mdiThumbsUpDownOutline,
			type: "info",
			message: "Odabir ažuriran",
		},
		{
			activity_id: "spremanje_zahtjeva_profesor_ponistio",
			icon: mdiCancel,
			type: "danger",
			message: "Profesor poništio preferencije",
		},
		{
			activity_id: "obavjestavanje_studenta_nakon_ponistavanja_email",
			icon: mdiEmailArrowRight,
			type: "info",
			message: "Student obavješten o poništenju",
		},
		{
			activity_id: "spremanje_alokacija",
			icon: mdiContentSaveOutline,
			type: "success",
			message: "Alokacija pohranjena",
		},
		{
			activity_id: "uzimanje_podataka_o_poslodavcu_student",
			icon: mdiApi,
			type: "info",
			message: "Dohvat podataka o poslodavcu",
		},
		{
			activity_id: "obavjestavanje_poslodavca_nakon_alokacije",
			icon: mdiApi,
			type: "info",
			message: "Poslodavac obavješten o alokaciji",
		},
		{
			activity_id: "obavjestavanje_studenta_nakon_alokacije",
			icon: mdiApi,
			type: "info",
			message: "Student obavješten o alokaciji",
		},
		{
			activity_id: "razgovor_za_praksu_poslodavac",
			icon: mdiAccountTie,
			type: "warning",
			message: "Evaluacija poslodavca",
		},
		{
			activity_id: "evaluacija_poslodavac",
			icon: mdiAccountTie,
			type: "success",
			message: "Kandidat evaluiran",
		},
		{
			activity_id: "spremanje_zahtjeva_prihvacanje",
			icon: mdiCheck,
			type: "success",
			message: "Student prihvaćen",
		},
		{
			activity_id: "obavjestavanje_studenta_nakon_prihvacanja_email",
			icon: mdiEmailArrowRight,
			type: "info",
			message: "Student obavješten o prihvaćanju",
		},
		{
			activity_id: "ispunjavanje_prijavnice_student",
			icon: mdiFileDocumentPlus,
			type: "success",
			message: "Prijavnica ispunjena",
		},
		{
			activity_id: "azuriranje_podataka_profesor",
			icon: mdiContentSaveOutline,
			type: "info",
			message: "Prijavnica pohranjena u bazu",
		},
		{
			activity_id: "kreiranje_potvrde_profesor",
			icon: mdiApi,
			type: "info",
			message: "Potvrda generirana",
		},
		{
			activity_id: "slanje_potvrde_student_email",
			icon: mdiEmailArrowRight,
			type: "info",
			message: "Studentu poslana potvrda",
		},
		{
			activity_id: "slanje_potvrde_mentor_email",
			icon: mdiEmailArrowRight,
			type: "info",
			message: "Mentoru poslana potvrda",
		},
		{
			activity_id: "predavanje_dnevnika_student",
			icon: mdiNotebook,
			type: "success",
			message: "Dnevnik predan",
		},
		{
			activity_id: "spremanje_dnevnika",
			icon: mdiContentSaveOutline,
			type: "success",
			message: "Dnevnik pohranjen",
		},
		{
			activity_id: "upis_ocjene",
			icon: mdiCertificate,
			type: "success",
			message: "Upis ocjene potvrđen",
		},
		{
			activity_id: "end_event_student",
			icon: mdiRayEnd,
			type: "info",
			message: "Proces završen",
		},
		//model B
		{
			activity_id: "model_b_dogovor_profesor",
			icon: mdiProgressClock,
			type: "danger",
			message: "Čeka odobrenje",
		},
		{
			activity_id: "model_b_odobrenje_zadatka",
			icon: mdiClipboardCheck,
			type: "success",
			message: "Zadatak odobren",
		},
		{
			activity_id: "model_b_direktna_prijava_student",
			icon: mdiNoteCheck,
			type: "info",
			message: "Student se prijavio",
		},
	];

	static skipEvents = [
		"spremanje_alokacija",
		"odabir_prihvacen",
		"uzimanje_podataka_o_poslodavcu_student",
		"spremanje_zahtjeva_profesor_ponistio",
		"obavjestavanje_poslodavca_nakon_alokacije",
		"obavjestavanje_studenta_nakon_alokacije",
		"obavjestavanje_studenta_nakon_ponistavanja_email",
		"student_prihvacen",
		"obavjestavanje_studenta_nakon_prihvacanja_email",
		"azuriranje_podataka_profesor",
		"slanje_potvrde_student_email",
		"slanje_potvrde_mentor_email",
		"spremanje_dnevnika",
	];

	static isGatewayEvent(activityId) {
		return activityId.startsWith("Gateway_");
	}

	static getFilteredEvents() {
		return this.events.filter((event) => !this.isGatewayEvent(event.activity_id));
	}

	static shouldSkipEvent(activityId) {
		if (Utils.isArrayEmpty(adminStore.selectedEvents)) {
			return this.skipEvents.includes(activityId) || this.isGatewayEvent(activityId);
		}

		// If events are selected, skip those not in the list
		return !adminStore.selectedEvents.includes(activityId);
	}

	// Existing method to get event based on activityId
	static getEvent(activityId) {
		return this.events.find((event) => event.activity_id === activityId);
	}
}

export { StudentMappings, UserTaskMappings, ActivityEventMappings, SendTaskMappings };
