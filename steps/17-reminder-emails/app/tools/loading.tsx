import { ToolGridSkeleton } from "@/components/tool-grid-skeleton";

export default function Loading() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">All tools</h1>
      <ToolGridSkeleton />
    </section>
  );
}
