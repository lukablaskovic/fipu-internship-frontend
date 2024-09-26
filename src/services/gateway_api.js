import createAxiosInstance from "@/helpers/axios-wrapper";

import { endpoints } from "@/config.js";
const AxiosWrapper = createAxiosInstance(endpoints.VITE_GATEWAY_API_URL);

const User = {
	async getStudents(retries = 3) {
		while (retries > 0) {
			try {
				let result = await AxiosWrapper.get("/admin/students");
				if (!result || result.length === 0) {
					throw new Error("Nema pronađenih studenata.");
				}
				return result;
			} catch (error) {
				if (retries === 1) {
					console.error("Nije uspjelo dohvaćanje studenata nakon više ponovljenih pokušaja:", error);
					return null;
				}
				retries--;
			}
		}
	},
};

export { User };
