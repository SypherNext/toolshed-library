import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">About Toolshed</h1>
      <p className="text-stone-700">
        Toolshed is a lending library run by the people on your street. Members
        list the tools they own, and anyone in the group can borrow them.
      </p>
    </section>
  );
}
