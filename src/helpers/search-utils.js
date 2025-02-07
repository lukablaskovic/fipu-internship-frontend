export const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, "").trim();

export const filterStudentsByName = (students, terms) => {
	return students.filter((student) => {
		const ime = normalizeString(student.ime);
		const prezime = normalizeString(student.prezime);
		return terms.length > 1 ? ime.includes(terms[0]) && prezime.includes(terms[1]) : ime.includes(terms[0]) || prezime.includes(terms[0]);
	});
};

export const filterByEmail = (students, searchTerm) => {
	return students.filter((student) => normalizeString(student.email).includes(searchTerm));
};

export const filterByJMBAG = (students, searchTerm) => {
	return students.filter((student) => normalizeString(student.JMBAG).includes(searchTerm));
};

export const filterByCompany = (companies, searchTerm) => {
	return companies.filter((company) => normalizeString(company.naziv).includes(searchTerm));
};

export const filterByAssignmentId = (assignments, searchTerm) => {
	return assignments.filter((assignment) => assignment.id_zadatak.split(" - ").some((part) => normalizeString(part).includes(searchTerm)));
};
