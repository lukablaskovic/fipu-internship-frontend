function getMappedProperty(arr, key, keyValue, prop) {
  const item = arr.find((item) => item[key] === keyValue);
  return item ? item[prop] : keyValue;
}

class StudentMappings {
  static GodinaStudijaMappings = [
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
import Student_DnevnikPrakseForm from "@/components/Internship/Student_DnevnikPrakseForm.vue";
import Student_PrijavnicaForm from "@/components/Internship/Student_PrijavnicaForm.vue";
import Student_WaitingForEvaluation from "@/components/Internship/Student_WaitingForEvaluation.vue";
import Student_WaitingForAllocation from "@/components/Internship/Student_WaitingForAllocation.vue";
import Student_ChooseAvailableAssignments from "@/components/Internship/Student_ChooseAvailableAssignments.vue";

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
        evaluacija_url: (processInstanceId) =>
          `${
            import.meta.env.VITE_DASHBOARD_URL
          }/#/evaluacija/${processInstanceId}`,
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
      _id: "odabiranje_zadatka_student",
      name: "Mora odabrati zadatke",
      form_title: "Prijavljene preferencije",
      snackbar_msg: "",
      snackbar_color: "",
      bpmn_pending_info_msg: "Student još nije prijavio preferencije.",
      bpmn_task_color: "#79d4f2",
      component: Student_ChooseAvailableAssignments,
    },
    {
      order: 2,
      _id: "alociranje_profesor",
      name: "Čeka alokaciju profesora",
      form_title: "Alokacija studenta",
      snackbar_msg: "Zadatak alociran!",
      snackbar_color: "success",
      bpmn_task_color: "#EF4444", //bg-red-500
      component: Student_WaitingForAllocation,
    },
    {
      order: 3,
      _id: "evaluacija_poslodavac",
      name: "Evaluacija poslodavca u tijeku",
      form_title: "Evaluacija poslodavca",
      snackbar_msg: "Evaluacija pohranjena. Hvala!",
      snackbar_color: "success",
      bpmn_task_color: "#EF4444",
      component: Student_WaitingForEvaluation,
    },
    {
      order: 4,
      _id: "ispunjavanje_prijavnice_student",
      name: "Mora ispuniti prijavnicu",
      snackbar_msg: "Prijavnica pohranjena. Hvala!",
      snackbar_color: "success",
      form_title: "Ispunjena prijavnica",
      component: Student_PrijavnicaForm,
    },
    {
      order: 5,
      _id: "predavanje_dnevnika_student",
      name: "Mora predati dnevnik prakse",
      snackbar_msg: "Dnevnik predan. Hvala!",
      snackbar_color: "success",
      form_title: "Dnevnik prakse",
      component: Student_DnevnikPrakseForm, //DnevnikPrakseForm
    },
    {
      order: 6,
      _id: "upis_ocjene",
      name: "Potrebno je potvrditi upis ocjene",
      snackbar_msg: "Upis ocjene potvrđen. Hvala!",
      snackbar_color: "success",
      form_title: "Upis ocjene (ISVU)",
    },
    {
      order: 7,
      _id: "end_event_student",
      name: "Student ocjenjen",
      snackbar_msg: "",
      snackbar_color: "",
      form_title: "Student ocjenjen",
      component: Student_InternshipFinished,
    },
  ];

  static getTaskProperty(taskId, property, state = "running") {
    if (state === "finished") {
      console.log("getTaskProperty: ", taskId, property, state);
      return getMappedProperty(
        this.tasks,
        "_id",
        "end_event_student",
        property
      );
    } else return getMappedProperty(this.tasks, "_id", taskId, property);
  }
}

import {
  mdiRayStartArrow,
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
import Student_InternshipFinished from "@/components/Internship/Student_InternshipFinished.vue";
import Utils from "./utils";

class ActivityEventMappings {
  static events = [
    {
      activity_id: "start_event_student",
      icon: mdiRayStartArrow,
      type: "success",
      message: "Pokrenut proces prakse",
    },
    {
      activity_id: "odabiranje_zadatka_student",
      icon: mdiThumbsUpDownOutline,
      type: "success",
      message: "Prijavljene preferencije",
    },
    {
      activity_id: "spremanje_preferencije",
      icon: mdiContentSaveOutline,
      type: "danger",
      message: "Čeka alokaciju profesora",
    },
    {
      activity_id: "alociranje_profesor",
      icon: mdiNoteCheck,
      type: "success",
      message: "Zadatak alociran",
    },
    {
      activity_id: "odabir_prihvacen",
      icon: mdiThumbsUpDownOutline,
      type: "success",
      message: "Preferencije prihvaćene",
    },
    {
      activity_id: "spremanje_zahtjeva_profesor_ponistio",
      icon: mdiCancel,
      type: "danger",
      message: "Profesor poništio prijavljene preferencije",
    },
    {
      activity_id: "obavjestavanje_studenta_nakon_ponistavanja_email",
      icon: mdiEmailArrowRight,
      type: "info",
      message: "Student obavješten o vraćanju",
    },
    {
      activity_id: "spremanje_alokacija",
      icon: mdiContentSaveOutline,
      type: "info",
      message: "Alokacija spremljena u bazu",
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
      message: "Evaluacija poslodavca u tijeku",
    },
    {
      activity_id: "evaluacija_poslodavac",
      icon: mdiAccountTie,
      type: "warning",
      message: "Poslodavac obavio evaluaciju",
    },
    {
      activity_id: "spremanje_zahtjeva_prihvacanje",
      icon: mdiContentSaveOutline,
      type: "success",
      message: "Student prihvaćen nakon evaluacije",
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
      message: "Student ispunio prijavnicu",
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
      message: "Potvrda uspješno generirana",
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
      message: "Mentoru potvrda",
    },
    {
      activity_id: "predavanje_dnevnika_student",
      icon: mdiNotebook,
      type: "success",
      message: "Predao dnevnik prakse",
    },
    {
      activity_id: "spremanje_dnevnika",
      icon: mdiContentSaveOutline,
      type: "info",
      message: "Dnevnik prakse spremljen u bazu",
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
      type: "success",
      message: "Student ocjenjen",
    },
  ];

  static skipEvents = [
    "spremanje_alokacija",
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
    return this.events.filter(
      (event) => !this.isGatewayEvent(event.activity_id)
    );
  }

  static shouldSkipEvent(activityId) {
    if (Utils.isArrayEmpty(adminStore.selectedEvents)) {
      return (
        this.skipEvents.includes(activityId) || this.isGatewayEvent(activityId)
      );
    }

    // If events are selected, skip those not in the list
    return !adminStore.selectedEvents.includes(activityId);
  }

  // Existing method to get event based on activityId
  static getEvent(activityId) {
    return this.events.find((event) => event.activity_id === activityId);
  }
}

export {
  StudentMappings,
  UserTaskMappings,
  ActivityEventMappings,
  SendTaskMappings,
};
