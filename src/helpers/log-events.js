export function searchAndSortEvents(events, query, sort) {
	const search = query.trim().toLocaleLowerCase("hr");
	return events.filter((event) => [event.student_ime, event.student_prezime, event.student_JMBAG, event.student_email].join(" ").toLocaleLowerCase("hr").includes(search)).sort((a, b) => {
		if (typeof sort === "function") return sort(a, b);
		if (sort === "student") return [a.student_ime, a.student_prezime].filter(Boolean).join(" ").localeCompare([b.student_ime, b.student_prezime].filter(Boolean).join(" "), "hr");
		return sort === "oldest" ? new Date(a.timestamp) - new Date(b.timestamp) : new Date(b.timestamp) - new Date(a.timestamp);
	});
}
