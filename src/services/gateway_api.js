import createAxiosInstance from "@/helpers/axios-wrapper";

const AxiosWrapper = createAxiosInstance(import.meta.env.VITE_GATEWAY_API_URL);

const Auth = {
  async register(postData) {
    try {
      let result = await AxiosWrapper.post("/students", postData);
      return result;
    } catch (error) {
      return error;
    }
  },
  async update_process_instance(student_id, process_instance_id) {
    try {
      let result = await AxiosWrapper.patch(
        `/students/${student_id}/process-instance`,
        { process_instance_id: process_instance_id }
      );
      console.log(result);
      return result;
    } catch (error) {
      return error;
    }
  },
  async login(userData) {
    try {
      let result = await AxiosWrapper.post("/auth", userData);
      return result;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return error;
      }
      return error;
    }
  },
};

const User = {
  async getCurrentUser() {
    try {
      let result = await AxiosWrapper.get("/users/me");
      return result;
    } catch (e) {
      return null;
    }
  },
  async getStudents() {
    try {
      let result = await AxiosWrapper.get("/admin/students");
      return result;
    } catch (e) {
      return null;
    }
  },
  async getCompanies() {
    try {
      let result = await AxiosWrapper.get("/users/companies");
      return result;
    } catch (e) {
      return null;
    }
  },
};

export { Auth, User };
