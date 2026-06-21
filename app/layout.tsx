import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Nissan AI Market Intelligence",
  description:
    "日産株のAI予測・SHAP説明・世界情勢ニュース・マクロ指標を統合した投資ダッシュボード。",
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        <div className="aurora" />
        <Navbar />
        <main className="animate-fade-in">{children}</main>
        <footer className="border-t border-white/[0.06] py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-xs text-white/30 sm:px-6">
            Nissan AI Market Intelligence · データ提供: Yahoo Finance / NewsAPI ·
            予測は研究目的であり投資助言ではありません
          </div>
        </footer>
      </body>
    </html>
  );
}
