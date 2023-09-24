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
    return value && value.length === length;
  };
}

function getFirstErrorForField(fieldName) {
  const error = this.v$.$errors.find((error) => error.$property === fieldName);
  return error ? error.$message : null;
}

export {
  croatianAlpha,
  containsAlpha,
  containsNumeric,
  isUnipuEmail,
  getFirstErrorForField,
  exactLength,
};
