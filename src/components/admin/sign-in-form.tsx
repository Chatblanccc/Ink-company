"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { type AdminLocale } from "@/lib/admin-i18n";

type Props = {
  locale: AdminLocale;
  t: {
    accountLabel: string;
    passwordLabel: string;
    signingIn: string;
    signInBtn: string;
    signInError: string;
    signInHint: string;
  };
};

export function SignInForm({ t }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      account: fd.get("account"),
      password: fd.get("password"),
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    setLoading(false);

    if (result?.error) {
      setError(t.signInError);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col gap-6">

      {/* Credentials form */}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">

        {/* Account */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="account" className="text-[13px] font-medium text-[#374151]">
            {t.accountLabel}
          </label>
          <input
            id="account"
            name="account"
            type="text"
            defaultValue="admin"
            placeholder="Example@email.com"
            autoComplete="username"
            required
            className="h-10 w-full rounded-lg border border-[#D4D7E3] bg-[#F7FBFF] px-3.5 text-[14px] text-[#0C1421] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#4880FF] focus:bg-white focus:ring-2 focus:ring-[#4880FF]/20"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[13px] font-medium text-[#374151]">
              {t.passwordLabel}
            </label>
            <Link
              href="mailto:admin@ink-company.com"
              className="text-[12px] font-medium text-[#4880FF] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue="admin123"
            placeholder="At least 8 characters"
            autoComplete="current-password"
            required
            className="h-10 w-full rounded-lg border border-[#D4D7E3] bg-[#F7FBFF] px-3.5 text-[14px] text-[#0C1421] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#4880FF] focus:bg-white focus:ring-2 focus:ring-[#4880FF]/20"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-1 flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-[#162D3A] text-[14px] font-semibold leading-none tracking-wide text-white transition-all duration-200 hover:bg-[#1f3d50] hover:shadow-[0_6px_20px_rgba(22,45,58,0.30)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-white/10 skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[200%]" />
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {t.signingIn}
            </span>
          ) : (
            t.signInBtn
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[12px] text-[#9CA3AF]">Or</span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      {/* Social buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled
          className="flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <button
          type="button"
          disabled
          className="flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FacebookIcon />
          Sign in with Facebook
        </button>
      </div>

    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-.1 2.73.44 3.9l3.78-2.93c-.76-2.2-2.37-3.97-4.58-4.98z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.024 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.532-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.097 24 18.103 24 12.073z" fill="#1877F2" />
      <path d="M16.671 15.563l.532-3.49h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.373-.235-2.686-.235c-2.74 0-4.532 1.662-4.532 4.669v2.643H7.078v3.49h3.047v8.437a12.085 12.085 0 003.75 0v-8.437h2.796z" fill="#fff" />
    </svg>
  );
}
