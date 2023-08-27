import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";
import { Model, ProcessInstance } from "@/services/bpmn_engine_api";
import { Admin } from "@/services/baserow_client_api";
export const useAdminStore = defineStore("admin", {
  state: () => ({
    students: [],
    selectedStudent: {},
    companies: [],
    studentsFetched: false,

    dashboard_data: {
      finished_internships: 0,
      ongoing_internships: 0,
      waiting_for_allocation: 0,
      events: [],
    },

    bpmn_diagram: {
      clicked_task_id: null,
    },
  }),
  actions: {
    showSelectedStudent(student) {
      this.selectedStudent = student;
      console.log(this.selectedStudent);
    },
    async getProcessInstanceData(student) {
      try {
        const response = await ProcessInstance.get(student.process_instance_id);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getTaskInfo(it, task) {
      try {
        const response = await ProcessInstance.getTaskInfo(it, task);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getStudents() {
      try {
        this.studentsFetched = false;
        const students = await User.getStudents();
        this.dashboard_data.waiting_for_allocation = 0;
        const promises = students.map(async (student) => {
          const data = await this.getProcessInstanceData(student);
          student.process_instance_data = data;
          student.process_instance_data.pending_task_info =
            await this.getTaskInfo(
              student.process_instance_id,
              student.process_instance_data.pending[0]
            );
          if (
            student.process_instance_data.pending[0] ==
            "potvrda_alociranja_profesor"
          ) {
            this.dashboard_data.waiting_for_allocation++;
          }
        });

        await Promise.all(promises);

        this.students = students;
        this.studentsFetched = true;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getCompanies() {
      try {
        const response = await User.getCompanies();
        this.companies = response;
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getPreferencesDetailed(student_jmbag) {
      try {
        const response = await Admin.getPreferencesDetailed(student_jmbag);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async searchModels() {
      try {
        const response = await Model.search();
        const model = response.results.find(
          (result) => result.model_path === "strucna_praksa_edited.bpmn"
        );

        if (model && model.instances) {
          this.dashboard_data.ongoing_internships = model.instances.length;
        }

        return response.results;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async getEvents() {
      try {
        const response = await Model.getEvents();
        response.forEach((event) => {
          const student = this.students.find(
            (stud) => stud.process_instance_id === event.instance_id
          );
          if (student) {
            event.student_name = student["Ime"];
            event.student_surname = student["Prezime"];
            event.student_jmbag = student["JMBAG"];
          }
        });
        this.events = response;
        return this.events;
      } catch (error) {
        console.log("Error:", error);
      }
    },

    async handleFormSubmit(instance_id, current_task, post_data) {
      try {
        const response = await ProcessInstance.submitForm(
          instance_id,
          current_task,
          post_data
        );
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
  },
  persist: true,
});
