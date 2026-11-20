"use client"; // error boundaries must run in the browser

import { primaryButtonStyle } from "@/components/styles";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  // In production the browser only receives a short code (the digest), never the real message.
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <section className="max-w-xl space-y-4">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-stone-600">
        Toolshed could not load this page. This is usually a short hiccup, so try again in a moment.
      </p>
      {digest && <p className="text-sm text-stone-500">Error code: {digest}</p>}
      <button type="button" onClick={retry} className={primaryButtonStyle}>
        Try again
      </button>
    </section>
  );
}
