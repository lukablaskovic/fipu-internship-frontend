import createAxiosInstance from "@/helpers/axios-wrapper";

const AxiosWrapper = createAxiosInstance(import.meta.env.VITE_BASEROW_API_URL);

const Guest = {
  async fetchAvailableAssignments() {
    try {
      let result = await AxiosWrapper.get("/zadaci-za-odabir");
      return result.data;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
};

const Student = {
  async getAllocationsPublic() {
    try {
      let result = await AxiosWrapper.get("/alokacije/public");
      return result;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
};

const Admin = {
  async getPreferencesDetailed(student_jmbag) {
    try {
      let result = await AxiosWrapper.get(
        `/student-preferencije-detailed/${student_jmbag}`
      );
      return result.data;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
};
export { Guest, Admin, Student };
