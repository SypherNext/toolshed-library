// Works out what kind of image some bytes are by looking at their first bytes ("magic numbers").
// Trust this, not the file name or the type the browser claims.
export const imageTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
} as const;

export type ImageExtension = keyof typeof imageTypes;

// The most bytes detectImageType ever looks at.
export const IMAGE_HEADER_BYTES = 12;

export function detectImageType(bytes: Uint8Array): ImageExtension | null {
  const startsWith = (...values: number[]) => values.every((value, i) => bytes[i] === value);
  if (startsWith(0x89, 0x50, 0x4e, 0x47)) return "png";
  if (startsWith(0xff, 0xd8, 0xff)) return "jpg";
  const riff = new TextDecoder().decode(bytes.slice(0, 4));
  const webp = new TextDecoder().decode(bytes.slice(8, IMAGE_HEADER_BYTES));
  if (riff === "RIFF" && webp === "WEBP") return "webp";
  return null;
}
