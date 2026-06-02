export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;

/**
 * Pure validation for the contact form. Returns a map of field → message;
 * an empty map means the values are valid.
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

  if (!values.message.trim()) {
    errors.message = "Please tell Ethan what you have in mind.";
  } else if (values.message.trim().length < MIN_MESSAGE) {
    errors.message = "A little more detail helps (at least 10 characters).";
  }

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}
