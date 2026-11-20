import { tools } from "@/lib/catalog";

export default function CatalogPage() {
  return (
    <main>
      <h1>All tools</h1>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id}>
            <a href={`/tools/${tool.id}`}>{tool.name}</a> ({tool.category})
          </li>
        ))}
      </ul>
    </main>
  );
}
