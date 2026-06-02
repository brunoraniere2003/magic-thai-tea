"use client";

import { buttonClasses } from "@/components/ui/Button";
import {
  getBookingHref,
  isBookingConfigured,
  type BookingWorld,
} from "@/lib/booking/config";

export interface BookingEmbedProps {
  world: BookingWorld;
  title?: string;
  note?: string;
}

/**
 * Booking card. Placeholder until Cal.com is connected: shows "Request a date"
 * pointing to contact. Once a Cal.com link is configured for the world, it
 * becomes "Check availability" opening the scheduler — no code change needed.
 */
export function BookingEmbed({
  world,
  title = "Book a session",
  note,
}: BookingEmbedProps) {
  const href = getBookingHref(world);
  const ready = isBookingConfigured(world);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-3xl border border-stone/15 bg-cream/[0.03] px-8 py-12 text-center">
      <h3 className="font-display text-2xl text-cream">{title}</h3>
      {note ? <p className="font-sans text-sm text-stone">{note}</p> : null}
      <a
        href={href}
        className={buttonClasses("primary")}
        {...(ready
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {ready ? "Check availability" : "Request a date"}
      </a>
      {!ready ? (
        <p className="font-sans text-xs text-stone/60">
          Online booking is coming soon — tap above to reach Ethan directly.
        </p>
      ) : null}
    </div>
  );
}
