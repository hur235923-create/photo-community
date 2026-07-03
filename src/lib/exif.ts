import exifr from "exifr";
import type { ShootingInfo } from "@/types/db";

export const EMPTY_SHOOTING: ShootingInfo = {
  camera: null,
  lens: null,
  aperture: null,
  shutter_speed: null,
  iso: null,
  taken_at: null,
};

function formatDate(d: unknown): string | null {
  const date = d instanceof Date ? d : d ? new Date(d as string) : null;
  if (!date || isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// exifr 원시 객체 → 우리 6개 필드로 매핑(순수 함수).
export function mapExif(raw: Record<string, any> | undefined | null): ShootingInfo {
  if (!raw) return { ...EMPTY_SHOOTING };

  const make = typeof raw.Make === "string" ? raw.Make.trim() : "";
  const model = typeof raw.Model === "string" ? raw.Model.trim() : "";
  let camera: string | null = null;
  if (make && model) {
    const firstWord = make.split(" ")[0].toLowerCase();
    camera = model.toLowerCase().includes(firstWord) ? model : `${make} ${model}`;
  } else {
    camera = model || make || null;
  }

  const lens = typeof raw.LensModel === "string" ? raw.LensModel.trim() : null;

  const aperture = typeof raw.FNumber === "number" ? `f/${raw.FNumber}` : null;

  let shutter_speed: string | null = null;
  if (typeof raw.ExposureTime === "number" && raw.ExposureTime > 0) {
    shutter_speed =
      raw.ExposureTime < 1
        ? `1/${Math.round(1 / raw.ExposureTime)}s`
        : `${raw.ExposureTime}s`;
  }

  const iso = typeof raw.ISO === "number" ? `ISO ${raw.ISO}` : null;

  const taken_at = formatDate(raw.DateTimeOriginal);

  return { camera, lens, aperture, shutter_speed, iso, taken_at };
}

// File의 EXIF를 파싱해 ShootingInfo로. 실패 시 전 필드 null(throw 안 함).
export async function parseExif(file: File): Promise<ShootingInfo> {
  try {
    const raw = await exifr.parse(file, [
      "Make",
      "Model",
      "LensModel",
      "FNumber",
      "ExposureTime",
      "ISO",
      "DateTimeOriginal",
    ]);
    return mapExif(raw);
  } catch {
    return { ...EMPTY_SHOOTING };
  }
}
