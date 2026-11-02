const attributeLabels = {
	Prvi_odabir: "Prvi odabir",
	Drugi_odabir: "Drugi odabir",
	Treci_odabir: "Treći odabir",
	napomena: "Napomena",
	Alocirani_zadatak: "Alocirani zadatak",
	zadatak_odobren: "Zadatak odobren",
	mentor_ime: "Ime mentora",
	mentor_prezime: "Prezime mentora",
	mentor_email: "E-mail mentora",
	student_broj_mobitela: "Mobitel studenta",
	student_OIB: "OIB studenta",
	dogovoreni_broj_sati: "Dogovoreni broj sati",
	pocetak_prakse: "Početak prakse",
	kraj_prakse: "Kraj prakse",
	mjesto_izvrsavanja: "Mjesto izvršavanja",
	prijavljen_rok: "Prijavljen rok",
	nastavak_radnog_odnosa: "Nastavak radnog odnosa",
	kandidat_odobren: "Kandidat odobren",
	ocjena_unesena_studomat: "Ocjena unesena u Studomat",
};

export function completedTaskRows(fields, variables) {
	return Object.entries(fields ?? {})
		.filter(([key]) => Object.hasOwn(attributeLabels, key))
		.map(([key, field]) => ({
			key,
			label: field.label?.trim() && field.label !== key ? field.label : attributeLabels[key],
			value: Array.isArray(variables[key]) ? variables[key].join(", ") : variables[key],
		}));
}
