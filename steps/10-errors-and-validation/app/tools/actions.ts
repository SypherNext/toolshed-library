"use server";

import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/current-member";
import { createTool } from "@/lib/data/tools";
import { invalidFormState, type FormState } from "@/lib/form-state";
import { toolFormSchema } from "@/lib/validation/tool";

const NO_PHOTO_URL = "/seed-photos/no-photo.png";

export async function addTool(_previousState: FormState, formData: FormData): Promise<FormState> {
  const parsed = toolFormSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
  });
  if (!parsed.success) return invalidFormState(parsed.error, formData);

  const member = await getCurrentMember();
  const toolId = await createTool({
    ...parsed.data,
    ownerId: member.id,
    photoUrl: NO_PHOTO_URL,
  });

  redirect(`/tools/${toolId}`);
}
