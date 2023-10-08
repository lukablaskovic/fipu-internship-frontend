function croatianAlpha(value) {
	return /^[A-Za-zčćšđžČĆŠĐŽ]+$/i.test(value);
}

const containsAlpha = (value) => /[a-zA-Z]/.test(value);
const containsNumeric = (value) => /\d/.test(value);

function isUnipuEmail(value) {
	return value && (value.endsWith("@unipu.hr") || value.endsWith("@fipu.hr"));
}

function exactLength(length) {
	return function (value) {
		if (value === null || value === undefined) {
			return false;
		}

		if (typeof value === "string" || Array.isArray(value)) {
			return value.length === length;
		}

		if (typeof value === "object") {
			return Object.keys(value).length === length;
		}

		return String(value).length === length;
	};
}

function getFirstErrorForField(v$, fieldName) {
	const error = v$.$errors.find((error) => error.$property === fieldName);
	return error ? error.$message : null;
}

export { croatianAlpha, containsAlpha, containsNumeric, isUnipuEmail, getFirstErrorForField, exactLength };
