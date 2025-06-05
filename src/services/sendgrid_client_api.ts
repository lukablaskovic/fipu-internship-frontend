import { createAxiosInstance, safeRequest } from "@/helpers/axios-wrapper";
import { endpoints } from "@/config";

interface EmailData {
	[key: string]: any;
}

const AxiosWrapper = createAxiosInstance(endpoints.VITE_SENDGRID_API_URL);

const SendGrid = {
	async sendEmail(postData: EmailData, to: string, template: string) {
		return safeRequest(async () => {
			const url = `/email?to=${encodeURIComponent(to)}&template=${encodeURIComponent(template)}`;
			const result = await AxiosWrapper.post(url, postData);
			return result;
		});
	},
};

export { SendGrid };
