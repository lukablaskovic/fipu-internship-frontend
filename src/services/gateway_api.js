import createAxiosInstance from "@/helpers/axios-wrapper";

const AxiosWrapper = createAxiosInstance(import.meta.env.VITE_GATEWAY_API_URL);
const Auth = {
  async register(userData) {
    try {
      let result = await AxiosWrapper.post("/students", userData);
      return result;
    } catch (e) {
      return null;
    }
  },
  async login(userData) {
    try {
      const formData = new FormData();
      formData.append("username", userData.email);
      formData.append("password", userData.password);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let result = await AxiosWrapper.post("/auth", formData, config);
      return result;
    } catch (e) {
      return null;
    }
  },
};

const User = {
  async getCurrent() {
    try {
      let result = await AxiosWrapper.get("/students/me");
      console.log(result);
      return result;
    } catch (e) {
      return null;
    }
  },
  async getStudents() {
    try {
      let result = await AxiosWrapper.get("/users/students");
      return result;
    } catch (e) {
      return null;
    }
  },
};

export { Auth, User };
