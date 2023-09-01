import createAxiosInstance from "@/helpers/axios-wrapper";

const bpmn_engine_service = createAxiosInstance(
  import.meta.env.VITE_BPMN_ENGINE_API_URL
);

const internship_gateway_api_service = createAxiosInstance(
  import.meta.env.VITE_GATEWAY_API_URL
);

const baserow_connector_service = createAxiosInstance(
  import.meta.env.VITE_BASEROW_API_URL
);

const sendgrid_connector_service = createAxiosInstance(
  import.meta.env.VITE_SENDGRID_API_URL
);

const MICROSERVICES = {
  bpmn_engine: {
    instance: bpmn_engine_service,
    url: import.meta.env.VITE_BPMN_ENGINE_API_URL,
  },
  internship_gateway_api: {
    instance: internship_gateway_api_service,
    url: import.meta.env.VITE_GATEWAY_API_URL,
  },
  baserow_connector: {
    instance: baserow_connector_service,
    url: import.meta.env.VITE_BASEROW_API_URL,
  },
  sendgrid_connector: {
    instance: sendgrid_connector_service,
    url: import.meta.env.VITE_SENDGRID_API_URL,
  },
};

const Control = {
  async checkAllServiceStatuses() {
    const statusChecks = Object.entries(MICROSERVICES).map(
      async ([serviceName, serviceData]) => {
        try {
          const response = await serviceData.instance.get("/status");
          return {
            [serviceName]: {
              status: response.status,
              message: response.message,
              url: serviceData.url,
            },
          };
        } catch (error) {
          return {
            [serviceName]: {
              status: "down",
              message: "Failed to get service status",
              url: serviceData.url,
            },
          };
        }
      }
    );

    const statuses = await Promise.all(statusChecks);
    return Object.assign({}, ...statuses);
  },
  async checkServiceStatus(serviceName) {
    const service = MICROSERVICES[serviceName];
    console.log("checked service", service);
    if (!service) {
      throw new Error(`Service ${serviceName} not found.`);
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
    } catch (error) {
      return {
        [serviceName]: {
          status: "down",
          message: "Failed to get service status",
          url: service.url,
        },
      };
    }
  },
  autoRefreshServiceStatus(intervalMinutes = 5) {
    async function refresher() {
      const statuses = await this.checkAllServiceStatuses();
      console.log(statuses);

      setTimeout(refresher, intervalMinutes * 60 * 1000);
    }

    refresher(); // Initial call
  },
};
export { Control };
