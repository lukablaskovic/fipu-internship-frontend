export function displayArchiveValue(value) {
	if (value === null || value === undefined || value === "") return "—";
	if (typeof value === "boolean") return value ? "Da" : "Ne";
	if (Array.isArray(value)) return value.map(displayArchiveValue).join(", ") || "—";
	if (typeof value === "object") return value.value ?? value.visible_name ?? value.original_name ?? JSON.stringify(value);
	return String(value);
}

export function archiveDocuments(snapshot, values) {
	const urls = new Set();
	function visit(value) {
		if (typeof value === "string") urls.add(value);
		else if (Array.isArray(value)) value.forEach(visit);
		else if (value && typeof value === "object") Object.values(value).forEach(visit);
	}
	visit(values);
	return snapshot.documents.filter((document) => urls.has(document.source_url));
}
