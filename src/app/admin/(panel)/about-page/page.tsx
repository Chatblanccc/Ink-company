import { getPrismaClient } from "@/lib/prisma";
import { getAdminLocale } from "@/lib/admin-lang";
import { aboutPageDefaults } from "@/lib/about-page-defaults";
import { AboutPageForm } from "./about-page-form";

export default async function AboutPageAdmin() {
  const locale = await getAdminLocale();

  const prisma = getPrismaClient();
  let data = aboutPageDefaults;

  if (prisma) {
    try {
      const row = await prisma.aboutPageContent.findUnique({ where: { id: "about-page" } });
      if (row) {
        const heroCards = Array.isArray(row.heroCards) && (row.heroCards as unknown[]).length > 0
          ? row.heroCards as typeof data.heroCards
          : data.heroCards;
        data = {
          hero:      row.hero   as typeof data.hero,
          heroCards,
          stats:     row.stats  as typeof data.stats,
          team:      row.team   as typeof data.team,
          values:    row.values as typeof data.values,
          cta:       row.cta    as typeof data.cta,
        };
      }
    } catch {
      /* use defaults */
    }
  }

  return <AboutPageForm initial={data} locale={locale} />;
}
