import axios from "axios";
import { useMainStore } from "@/stores/main";
const API_URL = "http://192.168.5.66:9001";

const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = useMainStore().access_token;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
      console.log(config.headers["Authorization"]);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AxiosWrapper = {
  get: async (endpoint, params = {}, headers = {}) => {
    const response = await AxiosInstance.get(endpoint, { params, headers });
    return response.data;
  },

  post: async (endpoint, data = {}, headers = {}) => {
    const response = await AxiosInstance.post(endpoint, data, { headers });
    return response.data;
  },

  put: async (endpoint, data = {}, headers = {}) => {
    const response = await AxiosInstance.put(endpoint, data, { headers });
    return response.data;
  },

  patch: async (endpoint, data = {}, headers = {}) => {
    const response = await AxiosInstance.patch(endpoint, data, { headers });
    return response.data;
  },

  delete: async (endpoint, headers = {}) => {
    const response = await AxiosInstance.delete(endpoint, { headers });
    return response.data;
  },
};

export default AxiosWrapper;
