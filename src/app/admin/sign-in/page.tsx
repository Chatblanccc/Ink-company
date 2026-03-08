import { LockKeyhole, Sparkles } from "lucide-react";

import { SignInForm } from "@/components/admin/sign-in-form";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminSignInPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="rounded-[2rem] border-slate-200">
        <CardContent className="space-y-6 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <LockKeyhole className="size-6" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Sign in to the admin console
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              This entry point protects the dashboard, CMS modules, product
              operations, and SEO management tools.
            </p>
          </div>
          <SignInForm />
        </CardContent>
      </Card>

      <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
          <Sparkles className="size-6" />
        </div>
        <div className="mt-8 space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight">
            Built for bilingual content and SEO operations
          </h2>
          <p className="text-base leading-8 text-slate-300">
            The admin structure is designed to support homepage CMS blocks,
            product pages, article publishing, inquiry management, and role-based
            team access from a single Next.js codebase.
          </p>
          <div className="space-y-4">
            {[
              "Homepage sections and global SEO defaults",
              "Product catalog, specs, and bilingual copy",
              "Article workflow, lead inbox, and analytics snapshots",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
