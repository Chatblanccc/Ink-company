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
    <>
      {/* Form section — gap 24px */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-end"
        style={{ gap: 24 }}
      >
        {/* Account input */}
        <div className="flex w-full flex-col items-start" style={{ gap: 8 }}>
          <label
            htmlFor="account"
            className="text-[16px] leading-none tracking-[0.01em]"
            style={{ color: "#0C1421" }}
          >
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
            className="h-12 w-full rounded-xl border px-4 text-[16px] tracking-[0.01em] outline-none placeholder:tracking-[0.01em]"
            style={{
              background: "#F7FBFF",
              borderColor: "#D4D7E3",
              color: "#0C1421",
            }}
          />
        </div>

        {/* Password input */}
        <div className="flex w-full flex-col items-start" style={{ gap: 8 }}>
          <label
            htmlFor="password"
            className="text-[16px] leading-none tracking-[0.01em]"
            style={{ color: "#0C1421" }}
          >
            {t.passwordLabel}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue="admin123"
            placeholder="At least 8 characters"
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-xl border px-4 text-[16px] tracking-[0.01em] outline-none placeholder:tracking-[0.01em]"
            style={{
              background: "#F7FBFF",
              borderColor: "#D4D7E3",
              color: "#0C1421",
            }}
          />
        </div>

        {/* Forgot Password */}
        <Link
          href="mailto:admin@ink-company.com"
          className="text-[16px] leading-none tracking-[0.01em]"
          style={{ color: "#1E4AE9" }}
        >
          Forgot Password?
        </Link>

        {/* Error */}
        {error ? (
          <p className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {/* Sign in button */}
        <button
          type="submit"
          disabled={loading}
          className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl text-[20px] leading-none tracking-[0.01em] text-white transition-all duration-200 hover:shadow-[0_8px_24px_rgba(22,45,58,0.35)] active:scale-[0.98] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: "#162D3A" }}
        >
          {/* Hover shimmer overlay */}
          <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-white/10 skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[200%]" />
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              {t.signingIn}
            </span>
          ) : (
            t.signInBtn
          )}
        </button>
      </form>

      {/* Social sign-in section — gap 24px */}
      <div className="flex w-full flex-col items-start" style={{ gap: 24 }}>
        {/* Or divider */}
        <div
          className="flex w-full items-center justify-center"
          style={{ gap: 16, padding: "10px 0" }}
        >
          <div className="h-px flex-1" style={{ background: "#CFDFE2" }} />
          <span
            className="text-[16px] leading-none tracking-[0.01em]"
            style={{ color: "#294957" }}
          >
            Or
          </span>
          <div className="h-px flex-1" style={{ background: "#CFDFE2" }} />
        </div>

        {/* Social buttons — gap 16px */}
        <div className="flex w-full flex-col" style={{ gap: 16 }}>
          <button
            type="button"
            disabled
            className="flex h-[52px] w-full items-center justify-center rounded-xl text-[16px] tracking-[0.01em] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "#F3F9FA", color: "#313957", gap: 16 }}
          >
            <GoogleIcon />
            Sign in with Google
          </button>
          <button
            type="button"
            disabled
            className="flex h-[52px] w-full items-center justify-center rounded-xl text-[16px] tracking-[0.01em] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "#F3F9FA", color: "#313957", gap: 16 }}
          >
            <FacebookIcon />
            Sign in with Facebook
          </button>
        </div>
      </div>

      {/* Don't have an account */}
      <p
        className="w-full text-center text-[18px] leading-[160%] tracking-[0.01em]"
        style={{ color: "#313957" }}
      >
        Don&apos;t you have an account?{" "}
        <span style={{ color: "#1E4AE9" }}>Sign up</span>
      </p>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
      <path
        d="M25.32 14.29c0-.9-.08-1.77-.23-2.6H14v4.92h6.34c-.27 1.42-1.1 2.62-2.34 3.43v2.85h3.78c2.21-2.04 3.54-5.04 3.54-8.6z"
        fill="#4285F4"
      />
      <path
        d="M14 26c3.16 0 5.81-1.05 7.78-2.85l-3.78-2.85c-1.05.7-2.4 1.12-4 1.12-3.08 0-5.69-2.08-6.62-4.88H3.48v2.94C5.44 23.38 9.48 26 14 26z"
        fill="#34A853"
      />
      <path
        d="M7.38 16.54c-.24-.7-.37-1.45-.37-2.22s.13-1.52.37-2.22V9.16H3.48A12 12 0 002 14.32c0 1.94.47 3.77 1.28 5.4l4.1-3.18z"
        fill="#FBBC04"
      />
      <path
        d="M14 7.44c1.74 0 3.3.6 4.52 1.77l3.38-3.38C19.8 3.92 17.16 2.64 14 2.64 9.48 2.64 5.44 5.26 3.48 9.16l3.9 3.02C8.3 9.38 10.92 7.44 14 7.44z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
      <path
        d="M28 14.084C28 6.305 21.732 0 14 0S0 6.305 0 14.084c0 7.027 5.122 12.854 11.813 13.916V18.15H8.258v-4.066h3.555v-3.1c0-3.525 2.092-5.472 5.293-5.472 1.534 0 3.139.275 3.139.275v3.46h-1.768c-1.742 0-2.284 1.084-2.284 2.195v2.642h3.883l-.621 4.066h-3.262v9.85C22.878 26.938 28 21.111 28 14.084z"
        fill="#1877F2"
      />
      <path
        d="M19.455 18.15l.62-4.066h-3.882V11.44c0-1.11.542-2.195 2.284-2.195h1.768V5.786s-1.605-.275-3.14-.275c-3.2 0-5.292 1.947-5.292 5.473v3.1H8.258v4.066h3.555v9.85a14.15 14.15 0 004.38 0V18.15h3.262z"
        fill="#fff"
      />
    </svg>
  );
}
