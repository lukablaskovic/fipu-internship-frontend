import createAxiosInstance from "@/helpers/axios-wrapper";

const AxiosWrapper = createAxiosInstance(
  import.meta.env.VITE_BPMN_ENGINE_API_URL
);

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
  async create(bpmn_model) {
    if (!bpmn_model) bpmn_model = "strucna_praksa.bpmn";
    try {
      let result = await AxiosWrapper.post(`/model/${bpmn_model}/instance`);
      console.log(result);
      return result;
    } catch (e) {
      return null;
    }
  },
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
