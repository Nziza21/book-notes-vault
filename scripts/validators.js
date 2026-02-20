export function validateText(input) {
  const re = /^\S(?:.*\S)?$/;
  return re.test(input);
}

export function validatePages(input) {
  const re = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  return re.test(input);
}

export function validateDate(input) {
  const re = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return re.test(input);
}

export function validateTag(input) {
  const re = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  return re.test(input);
}

export function validateNoDuplicateWords(input) {
  const re = /\b(\w+)\s+\1\b/i;
  return !re.test(input);
}