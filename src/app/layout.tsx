import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlogAI - AI 博客写作助手 | 几秒钟生成优质文章",
  description: "使用先进的 AI 技术，在几秒钟内生成高质量、SEO 优化的博客文章。支持中英文、专业/平衡/轻松多种风格。免费使用，每天 5 次机会。",
  keywords: ["AI 博客写作", "AI 写作工具", "博客生成器", "SEO 文章生成", "AI 内容创作"],
  authors: [{ name: "BlogAI" }],
  openGraph: {
    title: "BlogAI - AI 博客写作助手",
    description: "几秒钟生成优质博客文章，支持中英文，多种风格",
    type: "website",
    locale: "zh_CN",
    siteName: "BlogAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogAI - AI 博客写作助手",
    description: "几秒钟生成优质博客文章",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
