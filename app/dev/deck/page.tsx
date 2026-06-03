import { notFound } from "next/navigation";
import { DeckDemo } from "./DeckDemo";

/** Dev-only route (404 in production) to visually inspect the 3D card deck. */
export default function DevDeckPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <DeckDemo />;
}
