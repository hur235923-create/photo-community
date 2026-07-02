import { describe, it, expect } from "vitest";
import { CATEGORIES, getCategory } from "./category";

describe("category", () => {
  it("has 6 fixed categories", () => {
    expect(CATEGORIES).toHaveLength(6);
  });
  it("finds a category by slug", () => {
    expect(getCategory("food")?.label).toBe("음식");
  });
  it("returns undefined for unknown slug", () => {
    expect(getCategory("nope")).toBeUndefined();
  });
});
