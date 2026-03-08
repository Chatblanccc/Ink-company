import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cmsModules } from "@/lib/demo-data";

export default function AdminCmsPage() {
  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-950">
            CMS sections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cmsModules.map((module) => (
            <div
              key={module.name}
              className="rounded-[1.5rem] border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{module.name}</p>
                  <p className="text-sm text-slate-500">{module.owner}</p>
                </div>
                <Badge variant="outline">{module.status}</Badge>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                Updated {module.updatedAt}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-950">
            Homepage SEO defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title-zh">Title (ZH)</Label>
              <Input id="title-zh" defaultValue="油墨公司 | 工业级油墨、包装印刷与标签应用方案" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title-en">Title (EN)</Label>
              <Input id="title-en" defaultValue="Ink Company | Industrial ink solutions for packaging and labels" />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description-zh">Description (ZH)</Label>
              <Textarea
                id="description-zh"
                rows={6}
                defaultValue="油墨公司提供水性、UV 与功能型油墨方案，服务包装、标签、商业印刷与工业应用。"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description-en">Description (EN)</Label>
              <Textarea
                id="description-en"
                rows={6}
                defaultValue="Ink Company supplies water-based, UV, and specialty ink systems for packaging, labels, commercial printing, and industrial applications."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
