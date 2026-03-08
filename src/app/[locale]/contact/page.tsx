import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { getLocaleFromString } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromString(locale);

  return buildMetadata({
    locale: safeLocale,
    pathname: "/contact",
    title: safeLocale === "zh" ? "联系我们 | 油墨公司" : "Contact | Ink Company",
    description:
      safeLocale === "zh"
        ? "提交油墨产品、打样、规格与合作咨询，支持中英双语沟通。"
        : "Contact Ink Company for product selection, sampling, specifications, and partnership requests.",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = getLocaleFromString(locale);
  const zh = c === "zh";

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] min-h-screen">

          {/* ── Left panel ─────────────────────────────────────────── */}
          <div className="flex flex-col justify-center gap-[40px] lg:gap-[48px] pt-[100px] lg:pt-[0px] pb-[48px] lg:pb-[0px] lg:pr-[80px]">

            {/* Heading */}
            <div className="flex flex-col gap-[16px] lg:gap-[20px]">
              <h1 className="font-display text-[52px] sm:text-[64px] lg:text-[80px] leading-[0.88] tracking-[-0.04em] text-[#000]">
                {zh ? "开始对话。" : "Let's Talk."}
              </h1>
              <p className="text-[14px] lg:text-[15px] leading-[1.65] tracking-[-0.005em] text-[#6F6F6F] max-w-[380px]">
                {zh
                  ? "有油墨产品需求、打样申请或合作意向？告诉我们您的项目，我们的工程师将在 48 小时内回复。"
                  : "Have a product inquiry, sampling request, or partnership idea? Tell us about your project and our engineers will respond within 48 hours."}
              </p>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-[28px] lg:gap-[32px]">

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <p className="font-bold text-[16px] lg:text-[18px] leading-[1.2] tracking-[-0.025em] text-[#000]">
                  Email
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[14px] lg:text-[15px] leading-[1.4] tracking-[-0.005em] text-[#6F6F6F] hover:text-[#000] transition-colors underline underline-offset-2 decoration-[#CCCCCC] hover:decoration-[#000]"
                >
                  {siteConfig.email}
                </a>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-[8px]">
                <p className="font-bold text-[16px] lg:text-[18px] leading-[1.2] tracking-[-0.025em] text-[#000]">
                  {zh ? "电话" : "Phone"}
                </p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-[14px] lg:text-[15px] leading-[1.4] tracking-[-0.005em] text-[#6F6F6F] hover:text-[#000] transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>

              {/* Socials */}
              <div className="flex flex-col gap-[10px]">
                <p className="font-bold text-[16px] lg:text-[18px] leading-[1.2] tracking-[-0.025em] text-[#000]">
                  {zh ? "社交媒体" : "Socials"}
                </p>
                <div className="flex flex-col gap-[6px]">
                  <Link
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] lg:text-[15px] leading-[1.4] tracking-[-0.005em] text-[#6F6F6F] hover:text-[#000] transition-colors underline underline-offset-2 decoration-[#CCCCCC] hover:decoration-[#000] w-fit"
                  >
                    LinkedIn
                  </Link>
                  {zh && (
                    <span className="text-[14px] leading-[1.4] tracking-[-0.005em] text-[#6F6F6F]">
                      微信：inkcompany_official
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-[8px]">
                <p className="font-bold text-[16px] lg:text-[18px] leading-[1.2] tracking-[-0.025em] text-[#000]">
                  {zh ? "地址" : "Address"}
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[1.6] tracking-[-0.005em] text-[#6F6F6F] max-w-[300px]">
                  {siteConfig.address[c]}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right panel: form ───────────────────────────────────── */}
          <div className="flex flex-col justify-center py-[40px] lg:py-[100px] lg:pl-[80px]">
            <ContactForm locale={c} />
          </div>

        </div>
      </div>
    </main>
  );
}
