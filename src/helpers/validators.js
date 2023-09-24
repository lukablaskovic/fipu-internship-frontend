function isUnipuEmail(value) {
  return value && value.endsWith("@unipu.hr");
}

function getFirstErrorForField(fieldName) {
  const error = this.v$.$errors.find((error) => error.$property === fieldName);
  return error ? error.$message : null;
}

export { isUnipuEmail, getFirstErrorForField };
