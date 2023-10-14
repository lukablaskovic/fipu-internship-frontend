import { mainStore } from "@/main";

import createAxiosInstance from "@/helpers/axios-wrapper";
const AxiosWrapper = createAxiosInstance(import.meta.env.VITE_BPMN_ENGINE_API_URL);

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
			return result;
		} catch (e) {
			return [];
		}
	},
	async getEvents(retries = 3) {
		while (retries > 0) {
			try {
				let result = await AxiosWrapper.get("/events");
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
	},
};

const ProcessInstance = {
	// Instance creation upon student registration
	async create(bpmn_model) {
		if (!bpmn_model) bpmn_model = `${mainStore.bpmn_process_name}.bpmn`;
		try {
			let result = await AxiosWrapper.post(`/model/${bpmn_model}/instance`);
			return result;
		} catch (error) {
			return { status: 500, message: "Internal server error", data: error };
		}
	},

	async get(id) {
		try {
			let result = await AxiosWrapper.get(`/instance/${id}`);
			return result;
		} catch (error) {
			return null;
		}
	},

	async getTaskInfo(id, task) {
		try {
			let result = await AxiosWrapper.get(`/instance/${id}/task/${task}`);
			return result;
		} catch (error) {
			return null;
		}
	},

	async search(query) {
		try {
			let result = await AxiosWrapper.get("/instance", { search: query });
			return result.results;
		} catch (error) {
			console.log("Error:", error);

			return [];
		}
	},

	async handleNewInstance(instance_id, current_task, post_data) {
		try {
			let result = await AxiosWrapper.post(`/instance/${instance_id}/task/${current_task}/form`, post_data);
			return result;
		} catch (error) {
			console.log("Error:", error);

			return null;
		}
	},
};

export { ProcessInstance, Model };
