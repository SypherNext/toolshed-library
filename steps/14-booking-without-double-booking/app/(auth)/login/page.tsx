import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { safeNextPath } from "@/lib/redirects";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <section className="max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Log in</h1>
      <AuthForm mode="login" next={safeNextPath(next)} />
    </section>
  );
}
