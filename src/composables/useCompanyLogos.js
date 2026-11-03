import { onMounted, ref, unref, watch } from "vue";
import { useMainStore } from "@/stores/main_store";
import { DEFAULT_COMPANY_LOGO, fetchCompanyForAssignment, findCompanyForAssignment, getCompanyLogoKey, getCompanyLogoUrl, rememberCompany } from "@/helpers/company-logo.js";

export function useCompanyLogos(assignments) {
	const mainStore = useMainStore();
	const loaded = ref(false);
	const logos = ref({});
	const loading = new Set();

	const getCompanyLogo = (assignment) => logos.value[getCompanyLogoKey(assignment)] || getCompanyLogoUrl(findCompanyForAssignment(assignment, mainStore.allCompanies)) || DEFAULT_COMPANY_LOGO;

	async function loadLogo(assignment) {
		const key = getCompanyLogoKey(assignment);
		if (!key || logos.value[key] || loading.has(key) || (!loaded.value && !mainStore.allCompanies.length)) return;
		const cached = getCompanyLogoUrl(findCompanyForAssignment(assignment, mainStore.allCompanies));
		if (cached) {
			logos.value[key] = cached;
			return;
		}
		loading.add(key);
		try {
			const company = await fetchCompanyForAssignment(mainStore, assignment);
			rememberCompany(mainStore, company);
			logos.value[key] = getCompanyLogoUrl(company) || DEFAULT_COMPANY_LOGO;
		} finally {
			loading.delete(key);
		}
	}

	const loadLogos = () => Promise.all(unref(assignments).map(loadLogo));
	onMounted(async () => {
		mainStore.allCompanies = (await mainStore.fetchCompanies()) || [];
		loaded.value = true;
		await loadLogos();
	});
	watch(assignments, loadLogos, { immediate: true, deep: true });
	watch(() => mainStore.allCompanies, loadLogos, { deep: true });

	return { getCompanyLogo };
}
