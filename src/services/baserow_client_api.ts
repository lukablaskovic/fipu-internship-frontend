import { createAxiosInstance, safeRequest } from "@/helpers/axios-wrapper";
import { endpoints } from "@/config.js";

interface ProcessData {
	email: string;
	Model_prakse: string;
	process_instance_id: string;
	godina_studija: string;
	JMBAG: string;
}

interface TaskData {
	id_zadatak: string;
	voditelj_odobrio: boolean;
}

interface CompanyData {
	[key: string]: any;
}

interface DeletionData {
	process_instance_id: string;
	[key: string]: any;
}

const AxiosWrapper = createAxiosInstance(endpoints.VITE_BASEROW_API_URL + "/api");

const Guest = {
	fetchAvailableAssignments() {
		return safeRequest(() => AxiosWrapper.get("/Zadaci_za_odabir"));
	},

	fetchCompanies(query: string = "") {
		return safeRequest(() => AxiosWrapper.get("/Poslodavac", { search: query }));
	},

	submitNewInternshipProject(postData: any) {
		return safeRequest(() => AxiosWrapper.post("/zadaci_za_odabir", postData));
	},
};

const Student = {
	create(studentData: any) {
		return safeRequest(() => AxiosWrapper.post("/student", studentData));
	},

	setProcessData(email: string, process_instance_id: string, model_prakse: string, godina_studija: string, JMBAG: string) {
		return safeRequest(() => AxiosWrapper.patch("/student/process", { email, Model_prakse: model_prakse, process_instance_id, godina_studija, JMBAG }));
	},

	fetch(search_by: string = "") {
		return safeRequest(() => AxiosWrapper.get(`/Student?search=${search_by}`));
	},

	getAllocationsPublic() {
		return safeRequest(() => AxiosWrapper.get("/alokacija/public"));
	},

	directAllocation(postData: any) {
		return safeRequest(() => AxiosWrapper.post("/alokacija/direct", postData));
	},

	getAssignmentDetails(queryParams: Record<string, any> = {}) {
		return safeRequest(() => AxiosWrapper.get("/Zadaci_za_odabir", queryParams));
	},

	storeDnevnik(id_dnevnik_prakse: string, fileData: File) {
		const formData = new FormData();
		formData.append("file", fileData);
		return safeRequest(() => AxiosWrapper.post(`/upload/pdf-dnevnik/${id_dnevnik_prakse}`, formData));
	},

	storeIspunjenaPotvrda(id_dnevnik_prakse: string, fileData: File) {
		const formData = new FormData();
		formData.append("file", fileData);
		return safeRequest(() => AxiosWrapper.post(`/upload/pdf-ispunjena-potvrda/${id_dnevnik_prakse}`, formData));
	},

	fetchPDF(query: string = "") {
		return safeRequest(() => AxiosWrapper.get("/Dnevnik_prakse", { search: query }));
	},
};

const Admin = {
	getAllocations() {
		return safeRequest(() => AxiosWrapper.get("/alokacija").then((res: any) => res.results));
	},

	getPreferencesDetailed(id_alokacija: string) {
		return safeRequest(() => AxiosWrapper.get(`/student_preferencije/detailed/${id_alokacija}`));
	},

	handleTask(id_zadatak: string, value: boolean) {
		const postData: TaskData = { id_zadatak, voditelj_odobrio: value };
		return safeRequest(() => AxiosWrapper.patch("/zadaci_za_odabir/odobrenje", postData));
	},

	saveUpdatedCompany(postData: CompanyData) {
		return safeRequest(() => AxiosWrapper.patch("/poslodavac/update", postData));
	},

	completeInstanceRemoval(data: DeletionData) {
		return safeRequest(async () => {
			if (!data.process_instance_id) {
				throw new Error('"process_instance_id" is required');
			}

			Object.keys(data).forEach((key) => {
				if (key !== "process_instance_id" && (data[key] === undefined || data[key] === null)) {
					delete data[key];
				}
			});

			if (Object.keys(data).length === 0) {
				throw new Error("No valid data to send");
			}

			console.log("data im sending:", data);
			const result = await AxiosWrapper.delete("complete-deletion", data);
			console.log("Baserow process instance complete deletion result:", result);
			return result;
		});
	},
};

export { Guest, Admin, Student };
