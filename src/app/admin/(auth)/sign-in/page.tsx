import { SignInForm } from "@/components/admin/sign-in-form";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";

export default async function AdminSignInPage() {
  const locale = await getAdminLocale();
  const t = getAdminT(locale);
  const isZh = locale === "zh";

  return (
    <div className="flex min-h-screen bg-white">

      {/* ── Left: form panel ───────────────────────────────────── */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 sm:px-12 md:w-1/2 md:px-10 lg:px-16 xl:px-24">

        {/* Card shell */}
        <div className="w-full max-w-[400px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-2 text-[26px] font-bold leading-tight tracking-tight text-[#0C1421] sm:text-[28px]">
              {isZh ? "欢迎回来 👋" : "Welcome Back 👋"}
            </h1>
            <p className="text-[14px] leading-relaxed text-[#6B7280]">
              {isZh
                ? "登录以开始管理您的项目。"
                : "Sign in to start managing your projects."}
            </p>
          </div>

          {/* Form */}
          <SignInForm
            locale={locale}
            t={{
              accountLabel: t.accountLabel,
              passwordLabel: t.passwordLabel,
              signingIn: t.signingIn,
              signInBtn: t.signInBtn,
              signInError: t.signInError,
              signInHint: t.signInHint,
            }}
          />
        </div>

        {/* Copyright */}
        <p className="absolute bottom-5 left-0 w-full text-center text-[12px] text-[#9CA3AF]">
          &copy; 2023 ALL RIGHTS RESERVED
        </p>
      </div>

      {/* ── Right: artwork (hidden on mobile) ─────────────────── */}
      <div className="relative hidden overflow-hidden rounded-none md:block md:w-1/2 md:m-4 md:rounded-[20px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1400&q=85&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* subtle dark gradient at bottom for depth */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

    </div>
  );
}
