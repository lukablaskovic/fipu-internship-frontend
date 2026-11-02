import { version } from "../package.json";

export const darkModeKey = "darkMode";

export const containerMaxW = "xl:max-w-8xl xl:mx-auto";

export const DEV_MODE = import.meta.env.DEV;
const testDeployment = import.meta.env.PROD && import.meta.env.VITE_FRONTEND_CHANNEL === "test";
export const BASEROW_URL = "https://baserow.unipu.hr/dashboard";

// Discard cached dev identities and workflow IDs created against the previous backend.
if (DEV_MODE && !sessionStorage.getItem("real-api-session")) {
	sessionStorage.clear();
	sessionStorage.setItem("real-api-session", "1");
}

export const endpoints = {
	VITE_FRONTEND_URL: testDeployment ? window.location.origin : "https://fipu-praksa.unipu.hr",

	VITE_BPMN_ENGINE_API_URL: "https://fipubot.unipu.hr/api/python-bpmn-engine",

	VITE_BASEROW_API_URL: "https://fipubot.unipu.hr/api/baserow-connector",

	VITE_EMAILJS_API_URL: "https://fipubot.unipu.hr/api/emailjs-connector",

	VITE_PDF_API_URL: "https://fipubot.unipu.hr/api/pdf-connector",
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
