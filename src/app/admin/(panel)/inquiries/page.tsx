import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { InquiriesClient, type InquiryRow } from "./inquiries-client";

export default async function AdminInquiriesPage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];

  let inquiries: InquiryRow[] = [];

  if (prisma) {
    try {
      const rows = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
      inquiries = rows.map((i) => ({
        id:        i.id,
        name:      i.name,
        company:   i.company,
        email:     i.email,
        phone:     i.phone,
        market:    i.market,
        message:   i.message,
        language:  i.language,
        source:    i.source ?? null,
        status:    i.status,
        createdAt: i.createdAt,
      }));
    } catch {
      /* DB unavailable */
    }
  }

  return <InquiriesClient initialInquiries={inquiries} locale={locale} />;
}
