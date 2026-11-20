import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "@/components/user-menu";

const links = [
  { href: "/tools", label: "Catalog" },
  { href: "/tools/new", label: "Add a tool" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-emerald-800">
          Toolshed
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-stone-600 hover:text-stone-900"
          >
            {link.label}
          </Link>
        ))}
        <div className="ml-auto">
          {/* The menu reads the login cookie, so the rest of the page does not wait for it. */}
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
