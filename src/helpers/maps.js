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

class UserTaskMappings {
  static tasks = [
    {
      _id: "odabiranje_zadatka_student",
      name: "Mora odabrati zadatke",
    },
    { _id: "potvrda_alociranja_profesor", name: "Čeka alokaciju profesora" },
    { _id: "evaluacija_poslodavac", name: "Čeka evaluaciju poslodavca" },
    {
      _id: "ispunjavanje_prijavnice_student",
      name: "Mora ispuniti prijavnicu",
    },
    { _id: "predavanje_dnevnika_student", name: "Mora predati dnevnik prakse" },
  ];

  static getTaskName(taskId) {
    const task = this.tasks.find((task) => task._id === taskId);
    return task ? task.name : taskId;
  }
}

export { StudentMappings, UserTaskMappings };
