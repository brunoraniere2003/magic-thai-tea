"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { SITE } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";
import { buildSmsHref } from "@/lib/contact/sms";
import {
  validateContactForm,
  hasErrors,
  type ContactValues,
  type ContactErrors,
} from "@/lib/contact/validateContactForm";

// Phone starts with the US code pre-filled; the visitor can change it.
const DEFAULT_DIAL = "+1 ";
const EMPTY: ContactValues = { name: "", email: "", phone: DEFAULT_DIAL };
type Status = "idle" | "submitting" | "success" | "error";

/**
 * Light phone mask. Defaults to "+1" and formats a US number as
 * "+1 (415) 699-1715"; if the visitor changes the country code it keeps "+" plus
 * their digits so any international number still works.
 */
function formatPhone(input: string): string {
  let v = input.replace(/[^\d+]/g, "");
  v = "+" + v.replace(/\+/g, ""); // exactly one leading "+"
  if (v.startsWith("+1")) {
    const d = v.slice(2).replace(/\D/g, "").slice(0, 10);
    let out = "+1";
    if (d.length) out += " (" + d.slice(0, 3);
    if (d.length >= 3) out += ") " + d.slice(3, 6);
    if (d.length >= 6) out += "-" + d.slice(6, 10);
    return out;
  }
  return "+" + v.slice(1).replace(/\D/g, "").slice(0, 15);
}

// Leads go straight to Ethan's Flying Dragon Tea inbox via FormSubmit, sent from
// the browser (their server-side endpoint blocks datacenter IPs). Account-free.
// Recipient is the single source of truth in SITE.contact.email.
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${SITE.contact.email}`;

const fieldClasses =
  "w-full rounded-xl border border-stone/25 bg-stage px-4 py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-stone/50 focus:border-cream/60";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label htmlFor={id} className="font-sans text-sm text-cream">
        {label}
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
 * Contact form (name, email, phone). Sends the lead to the owner's inbox via
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
          Phone: values.phone.trim(),
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

        <Field id="phone" label="Phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+1 (415) 699-1715"
            className={fieldClasses}
            value={values.phone}
            onChange={(event) => update("phone", formatPhone(event.target.value))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
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
        {status === "success"
          ? "Thank you. Ethan will be in touch soon."
          : null}
        {status === "error"
          ? "Something went wrong. Please text Ethan instead."
          : null}
      </p>

      {smsHref ? (
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-stone/70">
            Prefer to text?
          </span>
          <a href={smsHref} className={buttonClasses("secondary")}>
            Text Ethan
          </a>
        </div>
      ) : null}
    </div>
  );
}
