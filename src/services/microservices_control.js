import createAxiosInstance from "@/helpers/axios-wrapper";
import { endpoints } from "@/config.js";

const SERVICES_CONFIG = {
	bpmn_engine: endpoints.VITE_BPMN_ENGINE_API_URL,
	internship_gateway_api: endpoints.VITE_GATEWAY_API_URL,
	baserow_connector: endpoints.VITE_BASEROW_API_URL,
	sendgrid_connector: endpoints.VITE_SENDGRID_API_URL,
	pdf_generator_connector: endpoints.VITE_PDF_API_URL,
};

const MICROSERVICES = Object.fromEntries(
	Object.entries(SERVICES_CONFIG).map(([key, url]) => {
		return [
			key,
			{
				instance: createAxiosInstance(url),
				url,
			},
		];
	})
);

function serviceStatusError(serviceName, url) {
	return {
		[serviceName]: {
			status: "Down",
			message: "Servis nije dostupan.",
			url,
		},
	};
}

const Control = {
	async checkAllServiceStatuses() {
		const statuses = await Promise.all(
			Object.entries(MICROSERVICES).map(([serviceName, serviceData]) =>
				serviceData.instance
					.get("/status")
					.then((response) => ({
						[serviceName]: {
							status: response.status,
							message: response.message,
							url: serviceData.url,
							status_check_timestamp: new Date(),
						},
					}))
					.catch((error) => {
						console.error(error);
						return serviceStatusError(serviceName, serviceData.url);
					})
			)
		);
		return Object.assign({}, ...statuses);
	},

	async checkServiceStatus(serviceName) {
		const service = MICROSERVICES[serviceName];

		if (!service) {
			throw new Error(`Servis ${serviceName} nije pronađen.`);
		}
		try {
			const response = await service.instance.get("/status");
			return {
				[serviceName]: {
					status: response.status,
					message: response.message,
					url: service.url,
				},
			};
		} catch {
			return serviceStatusError(serviceName, service.url);
		}
	},

	autoRefreshServiceStatus(intervalMinutes = 5) {
		const refresher = async () => {
			const statuses = await this.checkAllServiceStatuses();
			setTimeout(refresher, intervalMinutes * 60 * 1000);
			return statuses;
		};

		return refresher();
	},
};

export { Control };
