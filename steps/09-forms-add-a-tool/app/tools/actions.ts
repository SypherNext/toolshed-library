"use server";

import { redirect } from "next/navigation";
import type { CategorySlug } from "@/lib/categories";
import { getCurrentMember } from "@/lib/current-member";
import { createTool } from "@/lib/data/tools";

const NO_PHOTO_URL = "/seed-photos/no-photo.png";

export async function addTool(formData: FormData) {
  const member = await getCurrentMember();

  const toolId = await createTool({
    ownerId: member.id,
    name: String(formData.get("name")),
    category: String(formData.get("category")) as CategorySlug,
    description: String(formData.get("description")),
    photoUrl: NO_PHOTO_URL,
  });

  redirect(`/tools/${toolId}`);
}
