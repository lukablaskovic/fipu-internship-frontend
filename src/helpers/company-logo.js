export const DEFAULT_COMPANY_LOGO = "No-Logo.png";

const normalizeCompanyName = (name) => (name || "").toString().trim();

export const getLinkedCompany = (assignment) => assignment?.Poslodavac?.[0] || null;

export const getCompanyLogoKey = (assignment) => {
	const linkedCompany = getLinkedCompany(assignment);

	if (linkedCompany?.id) {
		return `id:${linkedCompany.id}`;
	}

	if (linkedCompany?.value) {
		return `name:${linkedCompany.value}`;
	}

	return "";
};

export const getCompanyLogoUrl = (company) => company?.logo?.[0]?.url || null;

export const findCompanyForAssignment = (assignment, companies = []) => {
	const linkedCompany = getLinkedCompany(assignment);

	if (!linkedCompany || !Array.isArray(companies)) {
		return null;
	}

	return companies.find((company) => company.id === linkedCompany.id) || companies.find((company) => normalizeCompanyName(company.naziv) === normalizeCompanyName(linkedCompany.value)) || null;
};

export const rememberCompany = (mainStore, company) => {
	if (!company) {
		return;
	}

	if (!Array.isArray(mainStore.allCompanies)) {
		mainStore.allCompanies = [];
	}

	if (!mainStore.allCompanies.some((storedCompany) => storedCompany.id === company.id)) {
		mainStore.allCompanies.push(company);
	}
};

export const fetchCompanyForAssignment = async (mainStore, assignment) => {
	const cachedCompany = findCompanyForAssignment(assignment, mainStore.allCompanies);

	if (cachedCompany) {
		return cachedCompany;
	}

	const linkedCompany = getLinkedCompany(assignment);

	if (!linkedCompany) {
		return null;
	}

	if (linkedCompany.id) {
		return mainStore.fetchCompany(linkedCompany.id);
	}

	if (linkedCompany.value) {
		const companies = await mainStore.fetchCompanies(linkedCompany.value);
		return findCompanyForAssignment(assignment, companies) || companies?.[0] || null;
	}

	return null;
};
