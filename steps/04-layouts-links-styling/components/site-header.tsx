import Link from "next/link";

const links = [
  { href: "/tools", label: "Catalog" },
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
      </nav>
    </header>
  );
}
