import { useState } from "react";
import type { PostImage } from "@/types/db";

export default function ImageCarousel({ images }: { images: PostImage[] }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) return null;
  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-muted">
        <img
          src={images[idx].image_url}
          alt=""
          className="mx-auto max-h-[70vh] w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIdx(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded border-2 ${
                i === idx ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={img.image_url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
