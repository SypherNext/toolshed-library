"use client";

import { useState } from "react";

const COPIED_MESSAGE_MS = 2000;

export function ShareButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.origin + path);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MESSAGE_MS);
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm hover:bg-stone-100"
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
