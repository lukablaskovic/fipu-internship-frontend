export const darkModeKey = "darkMode";

export const styleKey = "style";

export const containerMaxW = "xl:max-w-8xl xl:mx-auto";

// Local accounts and endpoints require the explicitly enabled Vite dev server.
export const LOCAL_DEV = import.meta.env.DEV && import.meta.env.VITE_LOCAL_DEV === "true";

export const endpoints = LOCAL_DEV ? {
	VITE_FRONTEND_URL: "http://localhost:5173",
	VITE_BPMN_ENGINE_API_URL: "http://localhost:8080",
	VITE_BASEROW_API_URL: "http://localhost:8082",
	VITE_SENDGRID_API_URL: "http://localhost:8083",
	VITE_PDF_API_URL: "http://localhost:8084",
} : {
	VITE_FRONTEND_URL: "https://fipu-praksa.unipu.hr",

	VITE_BPMN_ENGINE_API_URL: "https://fipubot.unipu.hr/api/python-bpmn-engine",
	//VITE_BPMN_ENGINE_API_URL: "http://localhost:8080",

	VITE_BASEROW_API_URL: "https://fipubot.unipu.hr/api/baserow-connector",
	//VITE_BASEROW_API_URL: "http://localhost:8082",

	VITE_SENDGRID_API_URL: "https://fipubot.unipu.hr/api/sendgrid-connector",
	//VITE_SENDGRID_API_URL: "http://localhost:8083",

	VITE_PDF_API_URL: "https://fipubot.unipu.hr/api/pdf-connector",
	//VITE_PDF_API_URL: "http://localhost:8084",
};

// Maintenance mode configuration
export const MAINTENANCE_MODE = !LOCAL_DEV;
