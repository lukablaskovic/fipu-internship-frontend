export const darkModeKey = "darkMode";

export const styleKey = "style";

export const containerMaxW = "xl:max-w-8xl xl:mx-auto";

export const DEV_MODE = import.meta.env.DEV;
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
export const MAINTENANCE_MODE = !DEV_MODE;

export const appConfig = Object.freeze({
	praksa_version: "v1.5.1",
	academicYear: "2026./2027.",
	voditelj_prakse: "doc. dr. sc. Ivan Lorencin",
	admin_emails: LOCAL_DEV ? ["admin@local.test"] : ["ntankov@unipu.hr", "ilorencin@unipu.hr", "lblaskovi@unipu.hr", "mmilicevi@unipu.hr"],
	fipulab_web: "https://web.fipulab.unipu.hr/",
	bpmn_process_name_A: "strucna_praksa_A",
	bpmn_process_name_B: "strucna_praksa_B",
});
