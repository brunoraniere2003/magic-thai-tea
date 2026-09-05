"use client";

import { useState, type FormEvent } from "react";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";
import { subscribe, type NewsletterConfig } from "@/lib/newsletter/subscribe";
import {
  validateSignup,
  hasSignupErrors,
  type SignupErrors,
} from "@/lib/newsletter/validateSignup";

type Status = "idle" | "submitting" | "success" | "error";

// The email service is not chosen yet (blocker B4). Until it is, signups fall
// back to the owner's inbox; picking a provider is only this env var.
const CONFIG: NewsletterConfig = {
  fallbackEmail: SITE.contact.email,
  endpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
};

const fieldClasses =
  "w-full rounded-xl border border-stone/25 bg-stage px-4 py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-stone/50 focus:border-cream/60";

/** "Join the Tea List" signup: optional name, required email (spec 033 / R7). */
export function TeaListForm() {
  const copy = HOME.teaList;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignup({ name, email });
    setErrors(nextErrors);
    if (hasSignupErrors(nextErrors)) return;

    setStatus("submitting");
    const result = await subscribe({ name, email, honeypot }, CONFIG);
    if (result.ok) {
      setName("");
      setEmail("");
      setStatus("success");
      return;
    }
    setStatus("error");
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col items-center gap-4"
    >
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2 text-left">
          <label
            htmlFor="tea-list-name"
            className="font-sans text-sm text-cream"
          >
            {copy.nameLabel} <span className="text-stone/70">(optional)</span>
          </label>
          <input
            id="tea-list-name"
            name="tea-list-name"
            type="text"
            autoComplete="name"
            className={fieldClasses}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 text-left">
          <label
            htmlFor="tea-list-email"
            className="font-sans text-sm text-cream"
          >
            {copy.emailLabel}
          </label>
          <input
            id="tea-list-email"
            name="tea-list-email"
            type="email"
            autoComplete="email"
            required
            className={fieldClasses}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "tea-list-email-error" : undefined}
          />
          {errors.email ? (
            <span
              id="tea-list-email-error"
              role="alert"
              className="font-sans text-xs text-ember"
            >
              {errors.email}
            </span>
          ) : null}
        </div>
      </div>

      {/* Honeypot: off-screen, hidden from assistive tech and tab order. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="tea-list-company">Company</label>
        <input
          id="tea-list-company"
          name="tea-list-company"
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
        {status === "submitting" ? "Joining..." : copy.buttonLabel}
      </button>

      <p aria-live="polite" className="min-h-5 text-center font-sans text-sm text-stone">
        {status === "success" ? copy.successMessage : null}
        {status === "error" ? copy.errorMessage : null}
      </p>
    </form>
  );
}
