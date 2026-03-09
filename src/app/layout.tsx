import type { Metadata } from "next";
import { Bodoni_Moda, DM_Sans, Poppins } from "next/font/google";

import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayFont = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | 工业级油墨解决方案`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "油墨公司提供水性、UV 与功能型油墨方案，服务包装、标签、商业印刷与工业应用，并支持中英双语内容与全球客户沟通。",
  keywords: [
    "油墨", "工业油墨", "包装印刷", "标签油墨", "UV油墨", "水性油墨",
    "ink supplier", "industrial ink", "packaging ink",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@inkcompany",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} ${displayFont.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
