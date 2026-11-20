// The rules a new tool must follow. The form shows these messages next to each field.
import * as z from "zod";
import { categorySlugs } from "@/lib/categories";
import { detectImageType, IMAGE_HEADER_BYTES } from "@/lib/image-type";

export const TOOL_NAME_MAX = 80;
export const TOOL_DESCRIPTION_MAX = 1000;
export const PHOTO_MAX_MEGABYTES = 2;

export const toolFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Give the tool a name of at least 2 characters." })
    .max(TOOL_NAME_MAX, { error: `Keep the name under ${TOOL_NAME_MAX} characters.` }),
  category: z.enum(categorySlugs, { error: "Choose a category from the list." }),
  description: z
    .string()
    .trim()
    .min(10, { error: "Add a short description (at least 10 characters)." })
    .max(TOOL_DESCRIPTION_MAX, {
      error: `Keep the description under ${TOOL_DESCRIPTION_MAX} characters.`,
    }),
  // The browser sends an empty file when nobody picked a photo; that is allowed.
  photo: z
    .instanceof(File, { error: "Choose a photo file." })
    .refine((file) => file.size <= PHOTO_MAX_MEGABYTES * 1024 * 1024, {
      error: `The photo must be ${PHOTO_MAX_MEGABYTES} MB or smaller.`,
    })
    .refine(async (file) => file.size === 0 || (await isImage(file)), {
      error: "The photo must be a PNG, JPEG or WebP image.",
    }),
});

async function isImage(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, IMAGE_HEADER_BYTES).arrayBuffer());
  return detectImageType(header) !== null;
}

export type ToolFormInput = z.infer<typeof toolFormSchema>;
