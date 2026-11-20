// Saving and reading tool photos on the server's disk, in the project's "uploads" folder.
import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { detectImageType, imageTypes, type ImageExtension } from "@/lib/image-type";

// A stored photo is always "<random uuid>.<png|jpg|webp>"; anything else is refused.
const STORED_NAME = /^[0-9a-f-]{36}\.(png|jpg|webp)$/;

// A fixed folder inside the project. (Next.js warns if a file path is built from a
// variable it cannot follow, because it then copies the whole project into the build.)
function uploadPath(fileName: string): string {
  return path.join(process.cwd(), "uploads", fileName);
}

export async function savePhoto(bytes: Uint8Array): Promise<string> {
  const extension = detectImageType(bytes);
  if (!extension) throw new Error("savePhoto was called with bytes that are not an image");

  const fileName = `${randomUUID()}.${extension}`;
  await mkdir(path.dirname(uploadPath(fileName)), { recursive: true });
  await writeFile(uploadPath(fileName), bytes);
  return `/photos/${fileName}`;
}

export async function readPhoto(fileName: string) {
  if (!STORED_NAME.test(fileName)) return null;
  const extension = fileName.split(".").pop() as ImageExtension;

  try {
    const bytes = await readFile(uploadPath(fileName));
    return { bytes, contentType: imageTypes[extension] };
  } catch {
    return null;
  }
}
