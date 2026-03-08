"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/sign-in" })}
      className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
    >
      <LogOut className="size-3.5" />
      {label}
    </button>
  );
}
