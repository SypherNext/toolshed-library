import Link from "next/link";
import { ToolGrid } from "@/components/tool-grid";
import { latestTools } from "@/lib/catalog";

const steps = [
  { title: "Find a tool", text: "Search the catalog for what you need this weekend." },
  { title: "Borrow it", text: "Ask the owner, agree the dates and pick it up." },
  { title: "Bring it back", text: "Return it on time so the next neighbour can use it." },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Borrow tools from your neighbours</h1>
        <p className="max-w-2xl text-lg text-stone-600">
          Most tools sit in a shed for months between jobs. Toolshed lets the
          people on your street share the tools they already own.
        </p>
        <Link
          href="/tools"
          className="inline-block rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
        >
          Browse the catalog
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-sm font-medium text-emerald-700">Step {index + 1}</p>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-stone-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Recently added</h2>
        <ToolGrid tools={latestTools(4)} />
      </section>
    </div>
  );
}
