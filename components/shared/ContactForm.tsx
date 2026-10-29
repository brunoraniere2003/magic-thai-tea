"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import { SITE } from "@/content/site";
import { HOME } from "@/content/home";
import { buttonClasses } from "@/components/ui/Button";
import { buildSmsHref } from "@/lib/contact/sms";
import {
  EVENT_TYPES,
  validateContactForm,
  hasErrors,
  type ContactValues,
  type ContactErrors,
} from "@/lib/contact/validateContactForm";

const EMPTY: ContactValues = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  location: "",
  guests: "",
  date: "",
  message: "",
};
type Status = "idle" | "submitting" | "success" | "error";

// Leads go straight to Ethan's Flying Dragon Tea inbox via FormSubmit, sent from
// the browser (their server-side endpoint blocks datacenter IPs). Account-free.
// Recipient is the single source of truth in SITE.contact.email.
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${SITE.contact.email}`;

const fieldClasses =
  "w-full rounded-xl border border-stone/25 bg-stage px-4 py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-stone/80 focus:border-cream/60";

function Field({
  id,
  label,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label htmlFor={id} className="font-sans text-sm text-cream">
        {label}
        {optional ? (
          <span className="ml-1.5 text-xs text-stone">(optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <span id={`${id}-error`} role="alert" className="font-sans text-xs text-ember">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Contact form (brief 2026-10-20): name, email and event location required;
 * phone, event type, guest count, date and message optional. Sends the lead to the owner's inbox via
 * FormSubmit (account-free, from the browser). A hidden honeypot (`_honey`)
 * blocks bots. "Text Ethan" (SMS) is always offered too.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");

  const smsHref = buildSmsHref(SITE.contact.sms);

  function update(field: keyof ContactValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setStatus("submitting");
    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Name: values.name.trim(),
          Email: values.email.trim(),
          Phone: values.phone.trim() || "(not given)",
          "Event type": values.eventType || "(not given)",
          "Event location": values.location.trim(),
          "Guest count": values.guests.trim() || "(not given)",
          "Event date": values.date || "(not given)",
          Message: values.message.trim() || "(none)",
          _replyto: values.email.trim(),
          _subject: `New enquiry from ${values.name.trim()} (The Red Flying Dragon)`,
          _template: "table",
          _captcha: "false",
          _honey: honeypot,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: string;
      };
      if (response.ok && data.success === "true") {
        setValues(EMPTY);
        setStatus("success");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field id="name" label="Your name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className={fieldClasses}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClasses}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>

        <Field id="phone" label="Phone" error={errors.phone} optional>
          {/* Country-aware phone mask: pick a country (flag dropdown), and the
              number formats as you type for THAT country. Defaults to US (+1).

              countryCallingCodeEditable={false} pins that "+1": without it, a
              visitor who clears the field by reflex and retypes "(415) 699-1715"
              silently gets "+41 56 991 71 5" - a Swiss number that still has 10
              digits, so validation waves it through and the lead arrives wrong.
              The country now changes only through the flag dropdown.

              flags={flags} serves the flag artwork from the package instead of
              the library's default CDN (a personal GitHub Pages host), so the
              page makes no third-party request. */}
          <PhoneInput
            id="phone"
            international
            countryCallingCodeEditable={false}
            flags={flags}
            defaultCountry="US"
            value={values.phone || undefined}
            onChange={(value) => update("phone", value ?? "")}
            placeholder="(415) 699-1715"
            className="phone-field"
            numberInputProps={{
              className:
                "w-full bg-transparent font-sans text-base text-cream outline-none placeholder:text-stone/80",
              "aria-invalid": Boolean(errors.phone),
              "aria-describedby": errors.phone ? "phone-error" : undefined,
            }}
          />
        </Field>

        <Field id="eventType" label="Event type" optional>
          <select
            id="eventType"
            name="eventType"
            className={`${fieldClasses} appearance-none [&_option]:text-ink bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2012%208'%3E%3Cpath%20d='M1%201l5%205%205-5'%20fill='none'%20stroke='%23a39b8e'%20stroke-width='1.5'/%3E%3C/svg%3E")] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10`}
            value={values.eventType}
            onChange={(event) => update("eventType", event.target.value)}
          >
            <option value="">Choose one</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field id="location" label="Event location" error={errors.location}>
          <input
            id="location"
            name="location"
            type="text"
            required
            autoComplete="off"
            placeholder="Venue name, or city and neighborhood"
            className={fieldClasses}
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="guests" label="Approximate guest count" error={errors.guests} optional>
            <input
              id="guests"
              name="guests"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 40"
              className={fieldClasses}
              value={values.guests}
              onChange={(event) => update("guests", event.target.value)}
              aria-invalid={Boolean(errors.guests)}
              aria-describedby={errors.guests ? "guests-error" : undefined}
            />
          </Field>
          <Field id="date" label="Event date" optional>
            <input
              id="date"
              name="date"
              type="date"
              className={`${fieldClasses} [color-scheme:dark]`}
              value={values.date}
              onChange={(event) => update("date", event.target.value)}
            />
          </Field>
        </div>

        <Field id="message" label="Message" error={errors.message} optional>
          <textarea
            id="message"
            name="message"
            rows={4}
            autoComplete="off"
            placeholder="What are you planning? A tasting, a class, a private event..."
            className={`${fieldClasses} min-h-28 resize-y`}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
        </Field>

        {/* Honeypot: off-screen, hidden from assistive tech and tab order. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <button
          type="submit"
          className={buttonClasses("primary")}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
      </form>

      <p aria-live="polite" className="min-h-5 text-center font-sans text-sm text-stone">
        {status === "success" ? HOME.contact.successMessage : null}
        {status === "error"
          ? "Something went wrong. Please text Ethan instead."
          : null}
      </p>

      {/* The two ways around the form: a call or a text. */}
      <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-stone/80">
            Prefer to talk?
          </span>
          <a
            href={SITE.introCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a 15-min call (opens Cal.com in a new tab)"
            className={buttonClasses("primary")}
          >
            Book a 15-min call <span aria-hidden>↗</span>
          </a>
        </div>
        {smsHref ? (
          <div className="flex flex-col items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-stone/80">
              Prefer to text?
            </span>
            <a href={smsHref} className={buttonClasses("secondary")}>
              Text Ethan
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
