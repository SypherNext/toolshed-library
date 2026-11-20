import { describe, expect, test } from "vitest";
import { detectImageType } from "@/lib/image-type";

describe("recognising photos by their first bytes", () => {
  test("PNG and JPEG are recognised", () => {
    expect(detectImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]))).toBe("png");
    expect(detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("jpg");
  });

  test("a web page renamed to photo.png is not a photo", () => {
    expect(detectImageType(new TextEncoder().encode("<html><script>"))).toBeNull();
  });
});
