import AxiosWrapper from "@/helpers/axios-wrapper"; // Adjust the path to where your AxiosWrapper is located.

const Auth = {
  async register(userData) {
    try {
      let result = await AxiosWrapper.post("/users/", userData);
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
      let result = await AxiosWrapper.get("/users/me");
      console.log(result);
      return result;
    } catch (e) {
      return null;
    }
  },
};

export { Auth, User };
