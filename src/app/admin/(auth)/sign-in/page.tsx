import { SignInForm } from "@/components/admin/sign-in-form";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";

export default async function AdminSignInPage() {
  const locale = await getAdminLocale();
  const t = getAdminT(locale);
  const isZh = locale === "zh";

  return (
    <div
      className="flex h-screen bg-white"
      style={{ padding: 32, gap: 32 }}
    >
      {/* ── Left side ── */}
      <div className="relative flex flex-1 items-center justify-center self-stretch">
        <div className="flex w-[388px] flex-col items-start" style={{ gap: 48 }}>
          {/* Intro */}
          <div className="flex w-full flex-col items-start" style={{ gap: 28 }}>
            <h1
              className="text-[36px] font-semibold leading-none tracking-[0.01em]"
              style={{ color: "#0C1421" }}
            >
              {isZh ? "欢迎回来 👋" : "Welcome Back 👋"}
            </h1>
            <p
              className="w-full text-[20px] leading-[160%] tracking-[0.01em]"
              style={{ color: "#313957" }}
            >
              {isZh
                ? "今天是美好的一天。登录以开始管理您的项目。"
                : "Today is a new day. It\u2019s your day. You shape it. Sign in to start managing your projects."}
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

        {/* Copyright — pinned to bottom of left side */}
        <p
          className="absolute bottom-0 left-0 w-full text-center text-[16px] tracking-[0.01em]"
          style={{ color: "#959CB6" }}
        >
          &copy; 2023 ALL RIGHTS RESERVED
        </p>
      </div>

      {/* ── Right side: art ── */}
      <div className="relative flex-1 self-stretch overflow-hidden rounded-[24px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
