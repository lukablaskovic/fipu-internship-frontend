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
      let result = await AxiosWrapper.get("/Poslodavac", {
        search: query,
      });
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
  async storeDnevnik(id_dnevnik_prakse, fileData) {
    console.log("Received fileData in storeDnevnik:", fileData);

    try {
      const formData = new FormData();
      formData.append("file", fileData);

      let result = await AxiosWrapper.post(
        `/upload/pdf-dnevnik/${id_dnevnik_prakse}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },

  async storeIspunjenaPotvrda(id_dnevnik_prakse, fileData) {
    console.log("Received fileData in storeIspunjenaPotvrda:", fileData);

    try {
      const formData = new FormData();
      formData.append("file", fileData);

      let result = await AxiosWrapper.post(
        `/upload/pdf-ispunjena-potvrda/${id_dnevnik_prakse}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
};

const Admin = {
  async getAllocations() {
    try {
      let result = await AxiosWrapper.get("/alokacija");
      return result.data.results;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },

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
