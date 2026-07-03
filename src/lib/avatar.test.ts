import { describe, it, expect } from "vitest";
import { getAvatar, AVATAR_COLORS } from "./avatar";

describe("getAvatar", () => {
  it("uses the uppercased first character as the initial", () => {
    expect(getAvatar("alice").initial).toBe("A");
  });
  it("returns '?' for an empty nickname", () => {
    expect(getAvatar("").initial).toBe("?");
  });
  it("is deterministic — same nickname always yields the same color", () => {
    expect(getAvatar("bob").color).toBe(getAvatar("bob").color);
  });
  it("picks a color from the palette", () => {
    expect(AVATAR_COLORS).toContain(getAvatar("charlie").color);
  });
});
