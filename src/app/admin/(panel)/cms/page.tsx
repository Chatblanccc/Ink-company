import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";

import { CmsSaveButton } from "./cms-save-button";

export default async function AdminCmsPage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];
  const t = getAdminT(locale);

  type SeoValues = { titleZh: string; titleEn: string; descZh: string; descEn: string };

  let seo: SeoValues = { titleZh: "", titleEn: "", descZh: "", descEn: "" };

  if (prisma) {
    try {
      const settings = await prisma.siteSetting.findUnique({ where: { id: "site" } });
      if (settings) {
        const title = settings.defaultSeoTitle as Record<string, string>;
        const desc = settings.defaultSeoDescription as Record<string, string>;
        seo = {
          titleZh: title.zh ?? "",
          titleEn: title.en ?? "",
          descZh: desc.zh ?? "",
          descEn: desc.en ?? "",
        };
      }
    } catch {
      // DB unavailable
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          {t.cmsSeoTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title-zh">{t.labelTitleZh}</Label>
            <Input id="title-zh" name="titleZh" defaultValue={seo.titleZh} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title-en">{t.labelTitleEn}</Label>
            <Input id="title-en" name="titleEn" defaultValue={seo.titleEn} />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="description-zh">{t.labelDescZh}</Label>
            <Textarea
              id="description-zh"
              name="descZh"
              rows={6}
              defaultValue={seo.descZh}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description-en">{t.labelDescEn}</Label>
            <Textarea
              id="description-en"
              name="descEn"
              rows={6}
              defaultValue={seo.descEn}
            />
          </div>
        </div>
        <CmsSaveButton locale={locale} t={{ savingBtn: t.savingBtn, savedBtn: t.savedBtn, saveBtn: t.saveBtn }} />
      </CardContent>
    </Card>
  );
}
