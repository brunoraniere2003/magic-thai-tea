export interface SignupValues {
  /** Optional, per the handoff. */
  name: string;
  email: string;
}

export type SignupField = keyof SignupValues;
export type SignupErrors = Partial<Record<SignupField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pure validation for the "Join the Tea List" form. Name is optional (R7),
 * email is required. Returns a map of field → message; empty means valid.
 */
export function validateSignup(values: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL.test(email)) {
    errors.email = "Please enter a valid email.";
  }

  return errors;
}

export function hasSignupErrors(errors: SignupErrors): boolean {
  return Object.keys(errors).length > 0;
}
