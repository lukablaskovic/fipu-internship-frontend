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
      waiting_for_mark: 0,
      finished_internships: 0,
      ongoing_internships: 0,
      waiting_for_allocation: 0,
      waiting_for_evaluation: 0,
      selectedEvents: [],
      events: [],
      relativeToNowTimestmap: true,
    },

    bpmn_diagram: {
      clicked_task_id: null,
    },

    pdfModalActive: false,
    modalTitle: "",
    pdfSource: "",
  }),
  actions: {
    async getAllocations() {
      try {
        let result = await Admin.getAllocations();
        return result;
      } catch (error) {
        console.log("Error:", error);
        return null;
      }
    },
    openPDFModal(allocation, type, sourceUrl) {
      const student = this.students.find((stud) => {
        return (
          stud.process_instance_data.variables.id_alokacija ===
          allocation.id_alokacija
        );
      });

      if (type === "Potvrda") {
        this.modalTitle = "Potvrda o praksi";
        if (student) {
          this.pdfSource =
            student.process_instance_data.variables.pdf_attachment_url;
        } else {
          console.error("Student not found");
          return;
        }
      } else if (type === "Dnevnik") {
        this.modalTitle = "Dnevnik prakse";
      } else {
        console.error("Invalid type passed to openPDFModal");
        return;
      }
      this.pdfModalActive = true;
    },

    setSelectedEvents(events) {
      this.dashboard_data.selectedEvents = events;
    },
    setSelectedStudent(student) {
      this.selectedStudent = student;
      console.log(
        "%cadmin_store: setSelectedStudent() - this.selectedStudent",
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
        this.dashboard_data.waiting_for_mark = 0;
        this.dashboard_data.finished_internships = 0;

        const promises = students.map(async (student) => {
          const data = await this.getProcessInstanceData(student);
          student.process_instance_data = data;
          console.log(student.process_instance_data);
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
          if (student.process_instance_data.state === "finished") {
            this.dashboard_data.finished_internships++;
            this.dashboard_data.waiting_for_mark++;
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
            event.student_email = student["email"];
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
