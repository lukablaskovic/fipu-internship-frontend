import { createAxiosInstance, safeRequest } from "@/helpers/axios-wrapper";
import { endpoints } from "@/config.js";

interface ModelData {
	id: string;
	model_path: string;
	instances: string[];
	[key: string]: any;
}

export interface ProcessInstanceData {
	id: string | number;
	variables: {
		id_alokacija?: string | number;
		id_preferencije?: string | number;
		id_prijavnica?: string | number;
		id_dnevnik_prakse?: string | number;
		pdf_attachment_url?: string;
		[key: string]: any;
	};
	pending: string[];
	state: string;
	model: { model_path: string; version: number | null };
	[key: string]: any;
}

interface TaskData {
	id: string;
	task: string;
	[key: string]: any;
}

interface TaskFormData {
	[key: string]: any;
}

const AxiosWrapper = createAxiosInstance(endpoints.VITE_BPMN_ENGINE_API_URL, true);

const Model = {
	async deployments() {
		return safeRequest(() => AxiosWrapper.get("/engine"));
	},
	async get(id: string): Promise<string | null> {
		return safeRequest(() => AxiosWrapper.get(`/model/${id}`));
	},

	async search(query = ""): Promise<{ results: ModelData[] } | null> {
		return safeRequest(() => AxiosWrapper.get("/model", { q: query }));
	},

	async getEvents(retries: number = 3): Promise<{ results: any[] } | null> {
		while (retries > 0) {
			try {
				const result = await AxiosWrapper.get("/events");
				if (!result || result.length === 0) {
					throw new Error("No events found.");
				}
				return result;
			} catch (error) {
				if (retries === 1) {
					console.error("Could not fetch internship events.");
					return null;
				}
				retries--;
			}
		}
		return null;
	},
};

const ProcessInstance = {
	retry(id: string, attemptId: number, confirmResend: boolean) {
		return safeRequest(() => AxiosWrapper.post(`/instance/${encodeURIComponent(id)}/retry`, {
			attempt_id: attemptId, confirm_resend: confirmResend,
		}));
	},
	async diagram(id: string) {
		return safeRequest(() => AxiosWrapper.get<string>(`/instance/${id}/model`));
	},
	evaluation(id: string, token: string, decision?: object) {
		const path = `/evaluation/${encodeURIComponent(id)}`;
		const headers = { "X-Evaluation-Token": token };
		return safeRequest(() => decision ? AxiosWrapper.post(path, decision, headers) : AxiosWrapper.get(path, {}, headers));
	},

	evaluationLink(id: string) {
		return safeRequest(() => AxiosWrapper.get(`/instance/${id}/evaluation-link`));
	},

	async create(model: string, previousInstanceId?: string | number | null): Promise<ProcessInstanceData | { status: number; message: string; data: any }> {
		try {
			return await AxiosWrapper.post(`/model/${model}/instance`, previousInstanceId ? { previous_instance_id: previousInstanceId } : {});
		} catch (error) {
			return { status: 500, message: "Internal server error", data: error };
		}
	},

	async get(id: string | number): Promise<ProcessInstanceData | null> {
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

	async handleNewInstance(instance_id: string | number | null, current_task: string | null, post_data: TaskFormData): Promise<any | null> {
		if (instance_id === null || instance_id === "" || !current_task) return null;
		return safeRequest(() => AxiosWrapper.post(`/instance/${instance_id}/task/${current_task}/form`, post_data));
	},

	submitDiary(id: string | number | null, form: FormData) {
		if (!id) return null;
		return safeRequest(() => AxiosWrapper.post(`/instance/${id}/task/predavanje_dnevnika_student/form`, form, {}, 180000));
	},

	async withdraw(instance_id: string | number): Promise<any | null> {
		return safeRequest(() => AxiosWrapper.post(`/instance/${instance_id}/event/odustajanje_od_prakse`, {}));
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
