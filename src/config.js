import { version } from "../package.json";

export const darkModeKey = "darkMode";

export const containerMaxW = "xl:max-w-8xl xl:mx-auto";

export const DEV_MODE = import.meta.env.DEV;
const testDeployment = import.meta.env.PROD && import.meta.env.VITE_FRONTEND_CHANNEL === "test";
const dataModeKey = "dev-data-mode";
let dataMode;
if (DEV_MODE) {
	try {
		dataMode = sessionStorage.getItem(dataModeKey);
	} catch {
		// Use the configured default when browser storage is unavailable.
	}
}
export const LOCAL_DEV = DEV_MODE && (dataMode === "local" || (dataMode !== "real" && import.meta.env.VITE_LOCAL_DEV === "true"));

export const BASEROW_URL = LOCAL_DEV ? "http://localhost:8085" : "https://baserow.unipu.hr/dashboard";

export function clearSession() {
	const mode = DEV_MODE ? sessionStorage.getItem(dataModeKey) : null;
	sessionStorage.clear();
	if (mode) sessionStorage.setItem(dataModeKey, mode);
}

export function setLocalDevelopment(enabled) {
	if (!DEV_MODE || typeof enabled !== "boolean") return;
	sessionStorage.setItem(dataModeKey, enabled ? "local" : "real");
	clearSession();
	window.location.assign("/prijava");
}

export const endpoints = LOCAL_DEV ? {
	VITE_FRONTEND_URL: "http://localhost:5173",
	VITE_BPMN_ENGINE_API_URL: "http://localhost:8080",
	VITE_BASEROW_API_URL: "http://localhost:8082",
	VITE_EMAILJS_API_URL: "http://localhost:8083",
	VITE_PDF_API_URL: "http://localhost:8084",
} : {
	VITE_FRONTEND_URL: testDeployment ? window.location.origin : "https://fipu-praksa.unipu.hr",

	VITE_BPMN_ENGINE_API_URL: "https://fipubot.unipu.hr/api/python-bpmn-engine",
	//VITE_BPMN_ENGINE_API_URL: "http://localhost:8080",

	VITE_BASEROW_API_URL: "https://fipubot.unipu.hr/api/baserow-connector",
	//VITE_BASEROW_API_URL: "http://localhost:8082",

	VITE_EMAILJS_API_URL: "https://fipubot.unipu.hr/api/emailjs-connector",
	//VITE_EMAILJS_API_URL: "http://localhost:8083",

	VITE_PDF_API_URL: "https://fipubot.unipu.hr/api/pdf-connector",
	//VITE_PDF_API_URL: "http://localhost:8084",
};

// Maintenance mode configuration
export const MAINTENANCE_MODE = !DEV_MODE && !testDeployment;

export const appConfig = Object.freeze({
	praksa_version: `v${version}`,
	academicYear: "2026./2027.",
	voditelj_prakse: "doc. dr. sc. Ivan Lorencin",
	fipulab_web: "https://web.fipulab.unipu.hr/",
	bpmn_process_name_A: "strucna_praksa_A",
	bpmn_process_name_B: "strucna_praksa_B",
});

export const BPMN_STUDIO_URL = import.meta.env.DEV ? "http://localhost:5174" : "https://fipu-praksa.unipu.hr/studio";
