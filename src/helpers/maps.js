function getMappedProperty(arr, key, keyValue, prop) {
  const item = arr.find((item) => item[key] === keyValue);
  return item ? item[prop] : keyValue;
}

class StudentMappings {
  static year_of_study = [
    { id: 1, label: "3. prijediplomski", dbLabel: "3_prijediplomski" },
    { id: 2, label: "1. diplomski", dbLabel: "1_diplomski" },
    { id: 3, label: "2. diplomski", dbLabel: "2_diplomski" },
  ];

  static getYearOfStudyLabel(dbLabel) {
    const year = this.year_of_study.find((year) => year.dbLabel === dbLabel);
    return year ? year.label : dbLabel;
  }
}

import Student_ChooseAvailableAssignments from "@/components/Internship/Student_ChooseAvailableAssignments.vue";
import Student_WaitingForAllocation from "@/components/Internship/Student_WaitingForAllocation.vue";

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
      name: "Čeka alokaciju",
      form_title: "Alokacija studenta",
      bpmn_task_color: "#e25555",
      component: Student_WaitingForAllocation,
    },
    {
      order: 3,
      _id: "evaluacija_poslodavac",
      name: "Čeka evaluaciju poslodavca",
      form_title: "Evaluacija poslodavca",
      bpmn_task_color: "#e25555",
      component: Student_WaitingForEvaluation,
    },
    {
      order: 4,
      _id: "ispunjavanje_prijavnice_student",
      name: "Mora ispuniti prijavnicu",
    },
    {
      order: 5,
      _id: "predavanje_dnevnika_student",
      name: "Mora predati dnevnik prakse",
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
} from "@mdi/js";
import Student_WaitingForEvaluation from "@/components/Internship/Student_WaitingForEvaluation.vue";

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
      message: "Prijava zadataka",
    },
    {
      activity_id: "spremanje-preferencije",
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
      activity_id: "evaluacija_poslodavac",
      icon: mdiAlertBox,
      type: "danger",
      message: "Čeka evaluaciju poslodavca",
    },
  ];
  static getEvent(activityId) {
    return this.events.find((event) => event.activity_id === activityId);
  }
}

export { StudentMappings, UserTaskMappings, ActivityEventMappings };
