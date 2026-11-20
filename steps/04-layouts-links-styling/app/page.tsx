import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-bold">Toolshed</h1>
      <p className="text-lg text-stone-600">
        Borrow tools from your neighbours instead of buying them.
      </p>
      <Link
        href="/tools"
        className="inline-block rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
      >
        Browse the catalog
      </Link>
    </section>
  );
}
