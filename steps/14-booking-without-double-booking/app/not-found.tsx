import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-xl space-y-4">
      <h1 className="text-3xl font-bold">We could not find that</h1>
      <p className="text-stone-600">
        The tool may have been removed by its owner, or the address has a typo.
      </p>
      <Link href="/tools" className="underline">
        Back to the catalog
      </Link>
    </section>
  );
}
