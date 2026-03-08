import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/zh/", "/en/"],
        disallow: ["/admin/", "/api/", "/drafts/", "/test/"],
      },
    ],
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
  };
}
