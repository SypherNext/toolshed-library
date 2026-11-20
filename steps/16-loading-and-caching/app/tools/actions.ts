"use server";

import { redirect } from "next/navigation";
import { requireMember } from "@/lib/current-member";
import { createTool, deleteTool, updateTool } from "@/lib/data/tools";
import { invalidFormState, type FormState } from "@/lib/form-state";
import { savePhoto } from "@/lib/photos";
import { requireOwnedTool } from "@/lib/tool-access";
import { toolFormSchema } from "@/lib/validation/tool";

const NO_PHOTO_URL = "/seed-photos/no-photo.png";

// Both the add form and the edit form send the same fields, so they share this step.
async function readToolForm(formData: FormData) {
  // safeParseAsync, because checking the photo's bytes has to wait for the file to be read.
  const parsed = await toolFormSchema.safeParseAsync({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    photo: formData.get("photo"),
  });
  if (!parsed.success) return { error: invalidFormState(parsed.error, formData) };

  const { photo, ...details } = parsed.data;
  const newPhotoUrl =
    photo.size > 0 ? await savePhoto(new Uint8Array(await photo.arrayBuffer())) : null;
  return { details, newPhotoUrl };
}

export async function addTool(_previousState: FormState, formData: FormData): Promise<FormState> {
  const member = await requireMember("/tools/new");
  const form = await readToolForm(formData);
  if (form.error) return form.error;

  const toolId = await createTool({
    ...form.details,
    ownerId: member.id,
    photoUrl: form.newPhotoUrl ?? NO_PHOTO_URL,
  });
  redirect(`/tools/${toolId}`);
}

export async function editTool(
  toolId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireOwnedTool(toolId);
  const form = await readToolForm(formData);
  if (form.error) return form.error;

  // No new photo chosen: keep the one the tool already has.
  await updateTool(toolId, form.newPhotoUrl ? { ...form.details, photoUrl: form.newPhotoUrl } : form.details);
  redirect(`/tools/${toolId}`);
}

export async function removeTool(toolId: number) {
  await requireOwnedTool(toolId);
  await deleteTool(toolId);
  redirect("/dashboard");
}
