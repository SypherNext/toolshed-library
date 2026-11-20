// The rules a new tool must follow. The form shows these messages next to each field.
import * as z from "zod";
import { categorySlugs } from "@/lib/categories";

export const TOOL_NAME_MAX = 80;
export const TOOL_DESCRIPTION_MAX = 1000;

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
});

export type ToolFormInput = z.infer<typeof toolFormSchema>;
