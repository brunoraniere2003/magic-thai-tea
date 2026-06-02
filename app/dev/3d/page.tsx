import { notFound } from "next/navigation";
import { Demo3D } from "./Demo3D";

/** Dev-only route (404 in production) that proves the gated 3D runtime. */
export default function Dev3DPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <Demo3D />;
}
