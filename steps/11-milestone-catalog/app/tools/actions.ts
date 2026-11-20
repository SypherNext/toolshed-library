"use server";

import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/current-member";
import { createTool } from "@/lib/data/tools";
import { invalidFormState, type FormState } from "@/lib/form-state";
import { savePhoto } from "@/lib/photos";
import { toolFormSchema } from "@/lib/validation/tool";

const NO_PHOTO_URL = "/seed-photos/no-photo.png";

export async function addTool(_previousState: FormState, formData: FormData): Promise<FormState> {
  // safeParseAsync, because checking the photo's bytes has to wait for the file to be read.
  const parsed = await toolFormSchema.safeParseAsync({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    photo: formData.get("photo"),
  });
  if (!parsed.success) return invalidFormState(parsed.error, formData);

  const { photo, ...details } = parsed.data;
  const photoUrl =
    photo.size > 0 ? await savePhoto(new Uint8Array(await photo.arrayBuffer())) : NO_PHOTO_URL;

  const member = await getCurrentMember();
  const toolId = await createTool({ ...details, ownerId: member.id, photoUrl });

  redirect(`/tools/${toolId}`);
}
