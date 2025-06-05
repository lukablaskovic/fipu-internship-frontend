import axios, { type AxiosInstance as Axios, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { mainStore } from "@/main.js";

interface RequestHeaders {
	[key: string]: string;
}

interface APIClient {
	get<T = any>(endpoint: string, params?: object, headers?: RequestHeaders): Promise<T>;
	post<T = any>(endpoint: string, data?: any, headers?: RequestHeaders): Promise<T>;
	put<T = any>(endpoint: string, data?: any, headers?: RequestHeaders): Promise<T>;
	patch<T = any>(endpoint: string, data?: any, headers?: RequestHeaders): Promise<T>;
	delete<T = any>(endpoint: string, data?: any, headers?: RequestHeaders): Promise<T>;
}

function createAxiosInstance(API_URL: string): APIClient {
	const instance: Axios = axios.create({ baseURL: API_URL, timeout: 10000 });

	instance.interceptors.request.use(
		(config: AxiosRequestConfig) => {
			const token = mainStore.access_token;
			if (token && config.headers) {
				config.headers["Authorization"] = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error),
	);

	return {
		async get<T = any>(endpoint: string, params: object = {}, headers: RequestHeaders = {}): Promise<T> {
			const response: AxiosResponse<T> = await instance.get(endpoint, { params, headers });
			return response.data;
		},
		async post<T = any>(endpoint: string, data: any = {}, headers: RequestHeaders = {}): Promise<T> {
			const response: AxiosResponse<T> = await instance.post(endpoint, data, { headers });
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
		console.error("HTTP Error:", error);
		return null;
	}
}

export { createAxiosInstance, safeRequest };
