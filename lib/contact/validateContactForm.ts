export interface ContactValues {
  name: string;
  email: string;
  phone: string;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// A usable phone has 10 (US) to 15 (E.164 max) digits, ignoring formatting.
const MIN_DIGITS = 10;
const MAX_DIGITS = 15;

function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

/**
 * Pure validation for the contact form (name / email / phone). Returns a map of
 * field → message; an empty map means the values are valid.
 */
export function validateContactForm(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL.test(values.email.trim())) {
    errors.email = "Please enter a valid email.";
  }

  const digits = digitCount(values.phone);
  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (digits < MIN_DIGITS || digits > MAX_DIGITS) {
    errors.phone = "Please enter a valid phone number.";
  }

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}
