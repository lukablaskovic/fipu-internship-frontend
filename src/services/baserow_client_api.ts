import { createAxiosInstance, safeRequest } from "@/helpers/axios-wrapper";
import { endpoints } from "@/config.js";

interface TaskData {
	id_zadatak: string | number;
	voditelj_odobrio: "odobreno" | "odbijeno";
}

interface CompanyData {
	[key: string]: any;
}

const AxiosWrapper = createAxiosInstance(endpoints.VITE_BASEROW_API_URL + "/api", true);

const Guest = {
	fetchAvailableAssignments() {
		return safeRequest(() => AxiosWrapper.get("/Zadaci_za_odabir"));
	},

	fetchCompanies(query: string = "") {
		return safeRequest(() => AxiosWrapper.get("/Poslodavac", { search: query }));
	},

	fetchCompany(id: string | number) {
		return safeRequest(() => AxiosWrapper.get("/Poslodavac", { id }));
	},

	submitNewInternshipProject(postData: any) {
		return safeRequest(() => AxiosWrapper.post("/zadaci_za_odabir", postData));
	},
};

const Student = {
	removeAvatar() {
		return AxiosWrapper.delete("/student/avatar");
	},

	updateAvatar(avatar: string | File) {
		if (avatar instanceof File) {
			const data = new FormData();
			data.append("file", avatar);
			return AxiosWrapper.patch("/student/avatar", data);
		}
		return AxiosWrapper.patch("/student/avatar", { avatar });
	},

	create(studentData: any) {
		return safeRequest(() => AxiosWrapper.post("/student", studentData));
	},

	setProcessData(email: string, process_instance_id: string | number, model_prakse: string, godina_studija: string, JMBAG: string, previous_instance_id: string | number | null, binding: string) {
		return safeRequest(() => AxiosWrapper.patch("/student/process", { email, Model_prakse: model_prakse, process_instance_id, godina_studija, JMBAG, previous_instance_id, binding }));
	},

	session() {
		return safeRequest(() => AxiosWrapper.get("/session"));
	},

	fetch() {
		return safeRequest(() => AxiosWrapper.get("/Student"));
	},

	getAllocationsPublic() {
		return safeRequest(() => AxiosWrapper.get("/alokacija/public"));
	},

	getAssignmentDetails(queryParams: Record<string, any> = {}) {
		return safeRequest(() => AxiosWrapper.get("/Zadaci_za_odabir", queryParams));
	},

	fetchPDF(query: string = "") {
		return safeRequest(() => AxiosWrapper.get("/Dnevnik_prakse", { search: query }));
	},
};

const Admin = {
	listAdministrators() {
		return safeRequest(() => AxiosWrapper.get<string[]>("/administratori"));
	},
	addAdministrator(email: string) {
		return AxiosWrapper.post<string[]>("/administratori", { email });
	},
	removeAdministrator(email: string) {
		return AxiosWrapper.delete<string[]>("/administratori", { email });
	},

	getAllocations() {
		return safeRequest(() => AxiosWrapper.get("/alokacija").then((res: any) => res.results));
	},

	getPreferencesDetailed(id_alokacija: string | number) {
		return safeRequest(() => AxiosWrapper.get(`/student_preferencije/detailed/${id_alokacija}`));
	},

	handleTask(id_zadatak: string | number, value: TaskData["voditelj_odobrio"]) {
		const postData: TaskData = { id_zadatak, voditelj_odobrio: value };
		return safeRequest(() => AxiosWrapper.patch("/zadaci_za_odabir/odobrenje", postData));
	},

	saveUpdatedCompany(postData: CompanyData) {
		return safeRequest(() => AxiosWrapper.patch("/poslodavac/update", postData));
	},
};

export { Guest, Admin, Student };

// Return page data without keeping a second global copy of each response.
export async function fetchAvailableAssignments() {
	try {
		const result = await Guest.fetchAvailableAssignments();
		return result?.data?.results;
	} catch (error) {
		console.error("Assignments could not be fetched:", error);
		return undefined;
	}
}

export async function submitNewInternshipProject(formData: any) {
	const postData = { ...formData, Poslodavac: [] as string[] };

	if (formData.Poslodavac) {
		postData.Poslodavac = [formData.Poslodavac];
		delete postData.new_company;
	} else if (formData.Poslodavac_novi_naziv) {
		postData.Poslodavac = [formData.Poslodavac_novi_naziv.trim()];
	}

	delete postData.Poslodavac_novi_naziv;

	if (formData.angazman_selekcija === "false") {
		postData.angazman_fipu = "Ne";
	} else if (formData.angazman_selekcija === "true" && !formData.angazman_fipu) {
		postData.angazman_fipu = "";
	}
	try {
		const response = await Guest.submitNewInternshipProject(postData);
		return response;
	} catch (error) {
		console.log("Error:", error);
		return null;
	}
}
