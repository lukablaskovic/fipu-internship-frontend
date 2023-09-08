import createAxiosInstance from "@/helpers/axios-wrapper";

const SERVICES_CONFIG = {
  bpmn_engine: import.meta.env.VITE_BPMN_ENGINE_API_URL,
  internship_gateway_api: import.meta.env.VITE_GATEWAY_API_URL,
  baserow_connector: import.meta.env.VITE_BASEROW_API_URL,
  sendgrid_connector: import.meta.env.VITE_SENDGRID_API_URL,
  pdf_generator_connector: import.meta.env.VITE_PDF_API_URL,
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
      message: "Service is not available",
      url,
    },
  };
}

const Control = {
  checkAllServiceStatuses() {
    return Promise.all(
      Object.entries(MICROSERVICES).map(([serviceName, serviceData]) =>
        serviceData.instance
          .get("/status")
          .then((response) => ({
            [serviceName]: {
              status: response.status,
              message: response.message,
              url: serviceData.url,
              status_check_timestamp: response.status_check_timestamp,
            },
          }))
          .catch(() => serviceStatusError(serviceName, serviceData.url))
      )
    ).then((statuses) => Object.assign({}, ...statuses));
  },

  checkServiceStatus(serviceName) {
    const service = MICROSERVICES[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found.`);
    }

    return service.instance
      .get("/status")
      .then((response) => ({
        [serviceName]: {
          status: response.status,
          message: response.message,
          url: service.url,
        },
      }))
      .catch(() => serviceStatusError(serviceName, service.url));
  },

  autoRefreshServiceStatus(intervalMinutes = 5) {
    const refresher = async () => {
      const statuses = await this.checkAllServiceStatuses();
      console.log(statuses);
      setTimeout(refresher, intervalMinutes * 60 * 1000);
    };

    refresher();
  },
};

export { Control };
