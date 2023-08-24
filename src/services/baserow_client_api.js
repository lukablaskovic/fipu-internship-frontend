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
  async registerAssignments(assignmentsData) {
    try {
      let result = await AxiosWrapper.post(
        "/prijava-preferencija",
        assignmentsData
      );
      return result;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  },
};

export { Guest, Student };
