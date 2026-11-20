// Serves the photos members upload. Only names that savePhoto() could have created are read.
import { readPhoto } from "@/lib/photos";

export async function GET(_request: Request, { params }: RouteContext<"/photos/[fileName]">) {
  const { fileName } = await params;
  const photo = await readPhoto(fileName);
  if (!photo) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(photo.bytes), {
    headers: {
      "Content-Type": photo.contentType,
      // A stored photo never changes (a new upload gets a new name), so browsers may keep it.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
