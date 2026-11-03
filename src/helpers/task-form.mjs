export const preferenceTable = "selectFromTable-'studentPreferences'";

export function visibleTaskFields(fields, values) {
	return Object.entries(fields ?? {}).filter(([, { type }]) =>
		type !== "var-string" && !(type === preferenceTable && values.odabir_prihvacen === "false"));
}

export function taskFormAnswers(fields, values) {
	if (!fields.length) return null;
	const answers = {};
	for (const [key, { type }] of fields) {
		const value = values[key];
		switch (type) {
			case "yes-no-boolean":
				if (key === "ocjena_unesena_studomat") {
					answers[key] = "true";
					continue;
				}
				if (value !== "true" && value !== "false") return null;
				break;
			case "input":
				if (typeof value !== "string" || !value.trim()) return null;
				break;
			case preferenceTable:
				if (value == null || value === "") return null;
				break;
			default: return null;
		}
		answers[key] = value;
	}
	return answers;
}
