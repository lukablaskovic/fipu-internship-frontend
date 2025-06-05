import { createAxiosInstance, safeRequest } from "@/helpers/axios-wrapper";
import { endpoints } from "@/config.js";

interface ModelData {
	id: string;
	[key: string]: any;
}

interface ProcessInstanceData {
	id: string;
	[key: string]: any;
}

interface TaskData {
	id: string;
	task: string;
	[key: string]: any;
}

interface FormData {
	[key: string]: any;
}

const AxiosWrapper = createAxiosInstance(endpoints.VITE_BPMN_ENGINE_API_URL);

const Model = {
	async get(id: string): Promise<ModelData | null> {
		return safeRequest(() => AxiosWrapper.get(`/model/${id}`));
	},

	async search(query: string): Promise<ModelData[]> {
		return safeRequest(() => AxiosWrapper.get("/model", { q: query })) || [];
	},

	async getEvents(retries: number = 3): Promise<any[] | null> {
		while (retries > 0) {
			try {
				const result = await AxiosWrapper.get("/events");
				if (!result || result.length === 0) {
					throw new Error("No events found.");
				}
				return result;
			} catch (error) {
				if (retries === 1) {
					console.error("Failed to fetch events after multiple attempts:", error);
					return null;
				}
				retries--;
			}
		}
		return null;
	},
};

const ProcessInstance = {
	async create(model: string): Promise<ProcessInstanceData | { status: number; message: string; data: any }> {
		try {
			return await AxiosWrapper.post(`/model/${model}/instance`);
		} catch (error) {
			return { status: 500, message: "Internal server error", data: error };
		}
	},

	async get(id: string): Promise<ProcessInstanceData | null> {
		return safeRequest(() => AxiosWrapper.get(`/instance/${id}`));
	},

	async getTaskInfo(id: string, task: string): Promise<TaskData | null> {
		if (task === undefined) {
			return null;
		}
		return safeRequest(() => AxiosWrapper.get(`/instance/${id}/task/${task}`));
	},

	async search(query: string): Promise<ProcessInstanceData[]> {
		const result = await safeRequest(() => AxiosWrapper.get("/instance", { search: query }));
		return result?.results || [];
	},

	async handleNewInstance(instance_id: string, current_task: string, post_data: FormData): Promise<any | null> {
		return safeRequest(() => AxiosWrapper.post(`/instance/${instance_id}/task/${current_task}/form`, post_data));
	},

	async removeInstance(instance_id: string): Promise<any | null> {
		const result = await safeRequest(() => AxiosWrapper.delete(`/instance/${instance_id}`));
		if (result) {
			console.log(`Successfully removed instance with id: ${instance_id} from BPMN engine.`);
		}
		return result;
	},
};

export { ProcessInstance, Model };
