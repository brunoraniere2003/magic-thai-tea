"use client";

import { useState, type FormEvent } from "react";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";
import { subscribe } from "@/lib/newsletter/subscribe";
import {
  validateSignup,
  hasSignupErrors,
  type SignupErrors,
} from "@/lib/newsletter/validateSignup";

type Status = "idle" | "submitting" | "success" | "error";


const fieldClasses =
  "w-full rounded-xl border border-stone/40 bg-stage/60 px-4 py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-stone/80 focus:border-cream/60";

/**
 * "Join the Tea List": email only, into the one list both sites share
 * (The Tea Temple's Netlify form, SITE.newsletter).
 */
export function TeaListForm() {
  const copy = HOME.teaList;
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignup({ email });
    setErrors(nextErrors);
    if (hasSignupErrors(nextErrors)) return;

    setStatus("submitting");
    const result = await subscribe({ email, honeypot }, SITE.newsletter);
    if (result.ok) {
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
      className="flex w-full flex-col items-stretch gap-4"
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2 text-left">
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
        className={buttonClasses("primary", "self-start")}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Joining..." : copy.buttonLabel}
      </button>

      <p aria-live="polite" className="min-h-5 font-sans text-sm text-stone">
        {status === "success" ? copy.successMessage : null}
        {status === "error" ? copy.errorMessage : null}
      </p>
    </form>
  );
}
