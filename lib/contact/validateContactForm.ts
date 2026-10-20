export interface ContactValues {
  name: string;
  email: string;
  /** Optional. */
  phone: string;
  /** Optional: one of EVENT_TYPES. */
  eventType: string;
  location: string;
  /** Optional: a whole number. */
  guests: string;
  /** Optional: yyyy-mm-dd from the date picker. */
  date: string;
  /** Optional. */
  message: string;
}

export const EVENT_TYPES = [
  "Corporate",
  "Wedding",
  "Private party",
  "Venue residency",
  "Community or festival",
  "Other",
] as const;

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
 * Pure validation for the contact form. Required: name, email, event location.
 * Phone, guest count and date are optional but must make sense when given.
 * Returns field -> message; an empty map means the values are valid.
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
  if (values.phone.trim() && (digits < MIN_DIGITS || digits > MAX_DIGITS)) {
    errors.phone = "Please enter a valid phone number, or leave it empty.";
  }

  if (!values.location.trim()) {
    errors.location = "Please tell us where the event is.";
  }

  const guests = values.guests.trim();
  if (guests && !/^\d{1,5}$/.test(guests)) {
    errors.guests = "Please enter a number of guests, or leave it empty.";
  }

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}
