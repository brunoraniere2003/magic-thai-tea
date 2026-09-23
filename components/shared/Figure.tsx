import Image from "next/image";
import { captionFor } from "@/content/captions";
import type { PracticeImage } from "@/content/home";

export interface FigureProps {
  image: PracticeImage;
  sizes: string;
  /** Tailwind aspect/rounding for the frame. */
  frameClassName?: string;
  imageClassName?: string;
  priority?: boolean;
}

/**
 * A photo with its house-format caption (spec 033 / R6).
 * An image with no caption yet simply renders without a `<figcaption>`, so new
 * captions from Ethan are a data edit in `content/captions.ts`, nothing more.
 */
export function Figure({
  image,
  sizes,
  frameClassName = "relative aspect-[4/5] w-full overflow-hidden rounded-2xl",
  imageClassName = "object-cover",
  priority = false,
}: FigureProps) {
  const caption = captionFor(image.src);
  const position = image.position === "top" ? "object-top" : "object-center";

  return (
    <figure className="flex flex-col gap-3">
      <div className={frameClassName}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${imageClassName} ${position}`}
        />
      </div>
      {caption ? (
        <figcaption className="font-sans text-xs leading-relaxed text-stone/80">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
