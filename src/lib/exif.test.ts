import { describe, it, expect } from "vitest";
import { mapExif } from "./exif";

describe("mapExif", () => {
  it("maps a full EXIF object", () => {
    const r = mapExif({
      Make: "SONY",
      Model: "ILCE-7M3",
      LensModel: "FE 24-70mm F2.8 GM",
      FNumber: 1.8,
      ExposureTime: 0.004,
      ISO: 100,
      DateTimeOriginal: new Date(2026, 6, 1, 10, 30),
    });
    expect(r.camera).toBe("SONY ILCE-7M3");
    expect(r.lens).toBe("FE 24-70mm F2.8 GM");
    expect(r.aperture).toBe("f/1.8");
    expect(r.shutter_speed).toBe("1/250s");
    expect(r.iso).toBe("ISO 100");
    expect(r.taken_at).toBe("2026-07-01");
  });

  it("dedupes brand when Model already contains Make", () => {
    expect(mapExif({ Make: "NIKON CORPORATION", Model: "NIKON D850" }).camera).toBe(
      "NIKON D850"
    );
  });

  it("formats slow shutter speeds as seconds", () => {
    expect(mapExif({ ExposureTime: 2 }).shutter_speed).toBe("2s");
  });

  it("returns all nulls for an empty object", () => {
    const r = mapExif({});
    expect(r).toEqual({
      camera: null,
      lens: null,
      aperture: null,
      shutter_speed: null,
      iso: null,
      taken_at: null,
    });
  });

  it("treats undefined input as empty", () => {
    expect(mapExif(undefined).camera).toBe(null);
  });
});
