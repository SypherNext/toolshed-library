import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { safeNextPath } from "@/lib/redirects";

export const metadata: Metadata = {
  title: "Create an account",
};

export default async function SignUpPage({ searchParams }: PageProps<"/signup">) {
  const { next } = await searchParams;

  return (
    <section className="max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Create your Toolshed account</h1>
      <AuthForm mode="signup" next={safeNextPath(next)} />
    </section>
  );
}
