import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { tools } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog",
};

export default function CatalogPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">All tools</h1>
      <ul className="grid gap-6 sm:grid-cols-3">
        {tools.map((tool) => (
          <li key={tool.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <Link href={`/tools/${tool.id}`}>
              <Image src={tool.photo} alt={tool.name} width={640} height={480} />
              <div className="p-4">
                <h2 className="font-semibold">{tool.name}</h2>
                <p className="text-sm text-stone-500">{tool.category}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
