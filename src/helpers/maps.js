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

import Task_odabiranje_zadatka_student from "@/components/BPMN/Task_odabiranje_zadatka_student.vue";

class UserTaskMappings {
  static tasks = [
    {
      order: 1,
      _id: "odabiranje_zadatka_student",
      name: "Mora odabrati zadatke",
      form_title: "Odabrani zadaci",
      bpmn_pending_info_msg: "Student još nije prijavio preferencije.",
      bpmn_task_color: "#79d4f2",
      component: Student_ChooseAvailableAssignments,
      task_component: Task_odabiranje_zadatka_student,
    },
    {
      order: 2,
      _id: "potvrda_alociranja_profesor",
      name: "Čeka alokaciju",
      form_title: "Potvrda alokacije",
      bpmn_task_color: "#e25555",
      component: Student_WaitingForAllocation,
    },
    {
      order: 3,
      _id: "evaluacija_poslodavac",
      component: Student_WaitingForEvaluation,

      name: "Čeka evaluaciju poslodavca",
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

  static getTaskName(taskId) {
    return getMappedProperty(this.tasks, "_id", taskId, "name");
  }

  static getTaskFormTitle(taskId) {
    return getMappedProperty(this.tasks, "_id", taskId, "form_title");
  }

  static getComponent(taskId) {
    return getMappedProperty(this.tasks, "_id", taskId, "component");
  }

  static getTaskCopmonent(taskId) {
    return getMappedProperty(this.tasks, "_id", taskId, "task_component");
  }

  static getBpmnTaskColor(taskId) {
    return getMappedProperty(this.tasks, "_id", taskId, "bpmn_task_color");
  }

  static getCurrentOrder(taskId) {
    return getMappedProperty(this.tasks, "_id", taskId, "order");
  }
  static getBpmnPendingInfoMsg(taskId) {
    return getMappedProperty(
      this.tasks,
      "_id",
      taskId,
      "bpmn_pending_info_msg"
    );
  }
}

import {
  mdiRayStartArrow,
  mdiThumbsUpDownOutline,
  mdiContentSaveCheckOutline,
  mdiClipboardCheck,
  mdiCheckAll,
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
      activity_id: "studentske_pref",
      icon: mdiContentSaveCheckOutline,
      type: "success",
      message: "Preference spremljene",
    },
    {
      activity_id: "alociranje_profesor",
      icon: mdiClipboardCheck,
      type: "info",
      message: "Ručna alokacija",
    },
    {
      activity_id: "potvrda_alociranja_profesor",
      icon: mdiCheckAll,
      type: "info",
      message: "Profesor potvrdio alokaciju",
    },
  ];
  static getEvent(activityId) {
    return this.events.find((event) => event.activity_id === activityId);
  }
}

export { StudentMappings, UserTaskMappings, ActivityEventMappings };
