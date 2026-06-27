"use client";

import dynamic from "next/dynamic";
import { Stage3D } from "@/webgl/core/Stage3D";
import { useDriveProgress } from "@/webgl/core/useDriveProgress";

const CubeScene = dynamic(
  () => import("@/webgl/demo/CubeScene").then((m) => m.CubeScene),
  { ssr: false },
);

/** Dev-only proof of the 3D runtime: gate + off-screen pause + scroll-drive. */
export function Demo3D() {
  const { triggerRef, progressRef } = useDriveProgress<HTMLDivElement>();

  return (
    <main className="bg-stage text-cream">
      <div ref={triggerRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <Stage3D
            className="absolute inset-0"
            poster={
              <div className="flex h-full w-full items-center justify-center bg-crimson/20">
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-stone">
                  static poster (fallback)
                </span>
              </div>
            }
            renderScene={(active) => (
              <CubeScene active={active} progressRef={progressRef} />
            )}
          />
          <p className="pointer-events-none relative z-10 font-sans text-xs uppercase tracking-[0.3em] text-cream/70 mix-blend-difference">
            3D runtime - scroll to spin
          </p>
        </div>
      </div>

      <section className="flex h-screen items-center justify-center">
        <p className="font-display text-3xl">end</p>
      </section>
    </main>
  );
}
