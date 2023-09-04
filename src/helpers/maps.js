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
}
import Student_DnevnikPrakseForm from "@/components/Internship/Student_DnevnikPrakseForm.vue";
import Student_PrijavnicaForm from "@/components/Internship/Student_PrijavnicaForm.vue";
import Student_WaitingForEvaluation from "@/components/Internship/Student_WaitingForEvaluation.vue";
import Student_WaitingForAllocation from "@/components/Internship/Student_WaitingForAllocation.vue";
import Student_ChooseAvailableAssignments from "@/components/Internship/Student_ChooseAvailableAssignments.vue";

class UserTaskMappings {
  static tasks = [
    {
      order: 1,
      _id: "odabiranje_zadatka_student",
      name: "Mora odabrati zadatke",
      form_title: "Prijavljene preferencije",
      bpmn_pending_info_msg: "Student još nije prijavio preferencije.",
      bpmn_task_color: "#79d4f2",
      component: Student_ChooseAvailableAssignments,
    },
    {
      order: 2,
      _id: "alociranje_profesor",
      name: "Čeka alokaciju profesora",
      form_title: "Alokacija studenta",
      bpmn_task_color: "#e25555",
      component: Student_WaitingForAllocation,
    },
    {
      order: 3,
      _id: "evaluacija_poslodavac",
      name: "Evaluacija poslodavca u tijeku",
      form_title: "Evaluacija poslodavca",
      bpmn_task_color: "#e25555",
      component: Student_WaitingForEvaluation,
    },
    {
      order: 4,
      _id: "ispunjavanje_prijavnice_student",
      name: "Mora ispuniti prijavnicu",
      form_title: "Ispunjena prijavnica",
      component: Student_PrijavnicaForm,
    },
    {
      order: 5,
      _id: "predavanje_dnevnika_student",
      name: "Mora predati dnevnik prakse",
      form_title: "Dnevnik prakse",
      component: Student_DnevnikPrakseForm, //DnevnikPrakseForm
    },
  ];

  static getTaskProperty(taskId, property) {
    return getMappedProperty(this.tasks, "_id", taskId, property);
  }
}

import {
  mdiRayStartArrow,
  mdiThumbsUpDownOutline,
  mdiAlertBox,
  mdiNoteCheck,
  mdiAccountTie,
  mdiBookAccount,
  mdiNotebook,
} from "@mdi/js";

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
      type: "info",
      message: "Prijavljene preferencije",
    },
    {
      activity_id: "spremanje_preferencije",
      icon: mdiAlertBox,
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
      activity_id: "razgovor_za_praksu_poslodavac",
      icon: mdiAccountTie,
      type: "warning",
      message: "Evaluacija poslodavca u tijeku",
    },
    {
      activity_id: "evaluacija_poslodavac",
      icon: mdiAccountTie,
      type: "success",
      message: "Poslodavac obavio evaluaciju",
    },
    {
      activity_id: "ispunjavanje_prijavnice_student",
      icon: mdiBookAccount,
      type: "success",
      message: "Student ispunio prijavnicu",
    },
    {
      activity_id: "kreiranje_potvrde_profesor",
      icon: mdiBookAccount,
      type: "success",
      message: "Potvrda izrađena",
    },
    {
      activity_id: "predavanje_dnevnika_student",
      icon: mdiNotebook,
      type: "danger",
      message: "Predao dnevnik prakse",
    },
  ];
  static skipEvents = [
    "spremanje_alokacija",
    "uzimanje_podataka_o_poslodavcu_student",
    "obavjestavanje_poslodavca_nakon_alokacije",
    "obavjestavanje_studenta_nakon_alokacije",
    "student_prihvacen",
    "obavjestavanje_studenta_nakon_prihvacanja_email",
    "azuriranje_podataka_profesor",
    "slanje_potvrde_student_email",
    "slanje_potvrde_mentor_email",
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
    return (
      this.skipEvents.includes(activityId) || this.isGatewayEvent(activityId)
    );
  }

  // Existing method to get event based on activityId
  static getEvent(activityId) {
    return this.events.find((event) => event.activity_id === activityId);
  }
}

export { StudentMappings, UserTaskMappings, ActivityEventMappings };
