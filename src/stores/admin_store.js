import { defineStore } from "pinia";
import { User } from "@/services/gateway_api";
import { Model, ProcessInstance } from "@/services/bpmn_engine_api";
import { Admin } from "@/services/baserow_client_api";
import { mainStore } from "@/main";
export const useAdminStore = defineStore("admin", {
  state: () => ({
    students: [],
    selectedStudent: null,
    companies: [],
    studentsFetched: false,

    dashboard_data: {
      finished_internships: 0,
      ongoing_internships: 0,
      waiting_for_allocation: 0,
      waiting_for_evaluation: 0,
      events: [],
    },

    bpmn_diagram: {
      clicked_task_id: null,
    },
  }),
  actions: {
    showSelectedStudent(student) {
      this.selectedStudent = student;
      console.log(
        "%cadmin_store: showSelectedStudent() - this.selectedStudent",
        "color: green;",
        this.selectedStudent
      );
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

        if (!students || students.length === 0) {
          this.students = [];
          this.studentsFetched = true;
          return; // Exit the method if no students are fetched
        }

        this.dashboard_data.waiting_for_allocation = 0;
        this.dashboard_data.waiting_for_evaluation = 0;

        const promises = students.map(async (student) => {
          const data = await this.getProcessInstanceData(student);
          student.process_instance_data = data;
          student.process_instance_data.pending_task_info =
            await this.getTaskInfo(
              student.process_instance_id,
              student.process_instance_data.pending[0]
            );
          if (
            student.process_instance_data.pending[0] == "alociranje_profesor"
          ) {
            this.dashboard_data.waiting_for_allocation++;
          }
          if (
            student.process_instance_data.pending[0] == "evaluacija_poslodavac"
          ) {
            this.dashboard_data.waiting_for_evaluation++;
          }
        });

        await Promise.all(promises);

        this.students = students;
      } catch (error) {
        console.log("Error:", error);
      } finally {
        this.studentsFetched = true; // Ensure this is always set to true at the end, regardless of any error
      }
    },
    async getPreferencesDetailed(student_JMBAG) {
      try {
        const response = await Admin.getPreferencesDetailed(student_JMBAG);
        return response;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    async searchModels() {
      try {
        const response = await Model.search();
        const model = response.results.find(
          (result) =>
            result.model_path === `${mainStore.bpmn_process_name}.bpmn`
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
            event.student_ime = student["ime"];
            event.student_prezime = student["prezime"];
            event.student_JMBAG = student["JMBAG"];
          }
        });
        this.events = response;
        return this.events;
      } catch (error) {
        console.log("Error:", error);
      }
    },
    //POST handle_new_instance
    async handleNewInstance(instance_id, current_task, post_data) {
      try {
        const response = await ProcessInstance.handleNewInstance(
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
