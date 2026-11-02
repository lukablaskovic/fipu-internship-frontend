import axios, { type AxiosInstance as Axios, type AxiosResponse } from "axios";


interface RequestHeaders {
	[key: string]: string;
}

function createAxiosInstance(API_URL: string, authenticated = false) {
	const instance: Axios = axios.create({ baseURL: API_URL, timeout: 10000 });

	if (authenticated) {
		instance.interceptors.request.use((config) => {
			if (config.headers.has("X-Evaluation-Token")) return config;
			const token = sessionStorage.getItem("google-id-token");
			if (token) config.headers.Authorization = `Bearer ${token}`;
			return config;
		});
		instance.interceptors.response.use(undefined, (error) => {
			if (error.response?.status === 401 && !error.config?.headers?.has("X-Evaluation-Token") && sessionStorage.getItem("token")) {
				sessionStorage.clear();
				if (window.location.pathname !== "/prijava") window.location.assign("/prijava");
			}
			return Promise.reject(error);
		});
	}
	return {
		async get<T = any>(endpoint: string, params: object = {}, headers: RequestHeaders = {}): Promise<T> {
			const response: AxiosResponse<T> = await instance.get(endpoint, { params, headers });
			return response.data;
		},
		async post<T = any>(endpoint: string, data: any = {}, headers: RequestHeaders = {}, timeout = 10000): Promise<T> {
			const response: AxiosResponse<T> = await instance.post(endpoint, data, { headers, timeout });
			return response.data;
		},
		async put<T = any>(endpoint: string, data: any = {}, headers: RequestHeaders = {}): Promise<T> {
			const response: AxiosResponse<T> = await instance.put(endpoint, data, { headers });
			return response.data;
		},
		async patch<T = any>(endpoint: string, data: any = {}, headers: RequestHeaders = {}): Promise<T> {
			const response: AxiosResponse<T> = await instance.patch(endpoint, data, { headers });
			return response.data;
		},
		async delete<T = any>(endpoint: string, data: any = {}, headers: RequestHeaders = {}): Promise<T> {
			const response: AxiosResponse<T> = await instance.delete(endpoint, { data, headers });
			return response.data;
		},
	};
}

async function safeRequest<T>(fn: () => Promise<T>): Promise<T | null> {
	try {
		return await fn();
	} catch (error) {
		console.error("HTTP request failed:", axios.isAxiosError(error) ? error.response?.status : "unavailable");
		return null;
	}
}

export { createAxiosInstance, safeRequest };
