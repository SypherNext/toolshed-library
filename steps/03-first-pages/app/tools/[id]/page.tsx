import { findTool } from "@/lib/catalog";

export default async function ToolPage({ params }: PageProps<"/tools/[id]">) {
  const { id } = await params;
  const tool = findTool(Number(id));

  if (!tool) {
    return (
      <main>
        <h1>Tool not found</h1>
        <p>There is no tool with the number {id}.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{tool.name}</h1>
      <p>{tool.description}</p>
      <p>Category: {tool.category}</p>
      <p>Owner: {tool.ownerName}</p>
    </main>
  );
}
