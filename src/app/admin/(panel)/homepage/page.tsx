import { getPrismaClient } from "@/lib/prisma";
import { getAdminLocale } from "@/lib/admin-lang";
import { homepageDefaults, type HomepageData } from "@/lib/homepage-defaults";

import { HomepageForm } from "./homepage-form";

export default async function AdminHomepagePage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];

  let data: HomepageData = homepageDefaults;

  if (prisma) {
    try {
      const row = await prisma.homepageContent.findUnique({ where: { id: "home" } });
      if (row) {
        data = {
          hero: row.hero as HomepageData["hero"],
          device: (row.device ?? homepageDefaults.device) as HomepageData["device"],
          benefits: row.benefits as HomepageData["benefits"],
          bigPicture: row.bigPicture as HomepageData["bigPicture"],
          specs: row.specs as HomepageData["specs"],
          testimonial: row.testimonial as HomepageData["testimonial"],
          howTo: row.howTo as HomepageData["howTo"],
          cta: row.cta as HomepageData["cta"],
          images: row.images as HomepageData["images"],
        };
      }
    } catch {
      // fall back to defaults
    }
  }

  return <HomepageForm initialData={data} locale={locale} />;
}
