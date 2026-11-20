import Link from "next/link";
import { logOut } from "@/app/(auth)/actions";
import { getCurrentMember } from "@/lib/current-member";

export async function UserMenu() {
  const member = await getCurrentMember();

  if (!member) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Link href="/login" className="text-stone-600 hover:text-stone-900">
          Log in
        </Link>
        <Link href="/signup" className="rounded-md bg-emerald-700 px-3 py-1.5 font-medium text-white">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <form action={logOut} className="flex items-center gap-4 text-sm">
      <span className="text-stone-600">Hi, {member.name}</span>
      <button type="submit" className="text-stone-600 underline hover:text-stone-900">
        Log out
      </button>
    </form>
  );
}
