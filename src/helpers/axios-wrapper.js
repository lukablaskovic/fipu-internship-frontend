import { mainStore } from "@/main.js";
import axios from "axios";

function createAxiosInstance(API_URL) {
	const AxiosInstance = axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": "application/json",
		},
		timeout: 10000,
	});

	// Request interceptor
	AxiosInstance.interceptors.request.use(
		(config) => {
			const token = mainStore.access_token;
			if (token) {
				config.headers["Authorization"] = "Bearer " + token;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);
	/*
	// Response interceptor
	AxiosInstance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response && error.response.status === 401) {
				mainStore.logout();
			}
			return Promise.reject(error);
		}
	);
  */
	return {
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
}

export default createAxiosInstance;
