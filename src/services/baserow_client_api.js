import createAxiosInstance from "@/helpers/axios-wrapper";

const AxiosWrapper = createAxiosInstance(
  import.meta.env.VITE_BASEROW_API_URL + "/api"
);

const Guest = {
  async fetchAvailableAssignments() {
    try {
      let result = await AxiosWrapper.get("/Zadaci_za_odabir");
      return result.data;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
  async fetchCompanies(query = "") {
    try {
      console.log({ search: query });
      let result = await AxiosWrapper.get("/Poslodavac", {
        search: query,
      });
      console.log("fetchCompanies", result.data);
      return result;
    } catch (e) {
      return null;
    }
  },
};

const Student = {
  async getAllocationsPublic() {
    try {
      let result = await AxiosWrapper.get("/alokacija/public");
      return result;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
  async getAssignmentDetails(queryParams = {}) {
    try {
      let result = await AxiosWrapper.get("/Zadaci_za_odabir", queryParams);
      console.log(result);
      return result;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
};

const Admin = {
  async getPreferencesDetailed(student_JMBAG) {
    try {
      let result = await AxiosWrapper.get(
        `/student_preferencije/detailed/${student_JMBAG}`
      );
      return result.data;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
};
export { Guest, Admin, Student };
