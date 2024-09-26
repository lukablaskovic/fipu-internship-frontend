import createAxiosInstance from "@/helpers/axios-wrapper";

import { endpoints } from "@/config.js";

const AxiosWrapper = createAxiosInstance(endpoints.VITE_BASEROW_API_URL + "/api");

const Guest = {
	async fetchAvailableAssignments() {
		try {
			let result = await AxiosWrapper.get("/Zadaci_za_odabir");
			return result.data;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
	async fetchCompanies(query = "") {
		try {
			let result = await AxiosWrapper.get("/Poslodavac", {
				search: query,
			});
			return result;
		} catch (e) {
			return null;
		}
	},
	async submitNewInternshipProject(postData) {
		try {
			let result = await AxiosWrapper.post("/zadaci_za_odabir", postData);
			return result.data;
		} catch (e) {
			return null;
		}
	},
};

const Student = {
	async create(studentData) {
		try {
			let result = await AxiosWrapper.post("/student", studentData);
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
	async setProcessData(email, process_instance_id, model_prakse) {
		try {
			let result = await AxiosWrapper.patch(`/student/process`, {
				email: email,
				Model_prakse: model_prakse,
				process_instance_id: process_instance_id,
			});
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
	async fetch(search_by) {
		try {
			let result = await AxiosWrapper.get(`/Student?search=${search_by}`);
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
	async getAllocationsPublic() {
		try {
			let result = await AxiosWrapper.get("/alokacija/public");
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
	async getAssignmentDetails(queryParams = {}) {
		try {
			let result = await AxiosWrapper.get("/Zadaci_za_odabir", queryParams);
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
	async storeDnevnik(id_dnevnik_prakse, fileData) {
		try {
			const formData = new FormData();
			formData.append("file", fileData);

			let result = await AxiosWrapper.post(`/upload/pdf-dnevnik/${id_dnevnik_prakse}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},

	async storeIspunjenaPotvrda(id_dnevnik_prakse, fileData) {
		try {
			const formData = new FormData();
			formData.append("file", fileData);

			let result = await AxiosWrapper.post(`/upload/pdf-ispunjena-potvrda/${id_dnevnik_prakse}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},

	async fetchPDF(query = "") {
		try {
			let result = await AxiosWrapper.get("/Dnevnik_prakse", {
				search: query,
			});
			return result;
		} catch (e) {
			return null;
		}
	},
};

const Admin = {
	async getAllocations() {
		try {
			let result = await AxiosWrapper.get("/alokacija");
			return result.data.results;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},

	async getPreferencesDetailed(id_alokacija) {
		try {
			let result = await AxiosWrapper.get(`/student_preferencije/detailed/${id_alokacija}`);
			return result.data;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},

	async handleTask(id_zadatak, value) {
		let post_data = {
			id_zadatak: id_zadatak,
			voditelj_odobrio: value,
		};
		try {
			let result = await AxiosWrapper.patch(`/zadaci_za_odabir/odobrenje`, post_data);
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
	async saveUpdatedCompany(postData) {
		try {
			let result = await AxiosWrapper.patch(`/poslodavac/update`, postData);
			return result;
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	},
};
export { Guest, Admin, Student };
