export const compareValues = new Intl.Collator("hr", { numeric: true, sensitivity: "base" }).compare;

export function findAssignments(assignments, search, location, hours, column, descending) {
	const query = search.trim().toLocaleLowerCase("hr");
	return assignments.filter((task) => {
		if (location && String(task.lokacija ?? "").trim() !== location) return false;
		if (hours && String(task.trajanje_sati ?? "").trim() !== hours) return false;
		return !query || [task.id_zadatak, task.poslodavac_email, task.preferirane_tehnologije, task.lokacija, task.opis_zadatka, ...(task.Poslodavac ?? []).map(company => company.value)]
			.join(" ").toLocaleLowerCase("hr").includes(query);
	}).sort((a, b) => compareValues(a[column] ?? "", b[column] ?? "") * (descending ? -1 : 1));
}
