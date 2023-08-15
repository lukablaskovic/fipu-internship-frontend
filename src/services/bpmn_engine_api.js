import AxiosWrapper from "@/helpers/axios-wrapper"; // Adjust the path to where your AxiosWrapper is located.

const Model = {
  async get(id) {
    try {
      let result = await AxiosWrapper.get(`/model/${id}`);
      return result;
    } catch (e) {
      return null;
    }
  },
  async search(query) {
    try {
      let result = await AxiosWrapper.get("/model", { q: query });
      return result.results;
    } catch (e) {
      return [];
    }
  },
};

const ProcessInstance = {
  async get(id) {
    try {
      let result = await AxiosWrapper.get(`/instance/${id}`);
      return result;
    } catch (e) {
      return null;
    }
  },
  async search(query) {
    try {
      let result = await AxiosWrapper.get("/instance", { q: query });
      return result.results;
    } catch (e) {
      return [];
    }
  },
};

export { ProcessInstance, Model };
