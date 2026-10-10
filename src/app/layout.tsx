import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, Geist, Noto_Serif_Tibetan } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from "@/data/site";
import { themeInitScript } from "@/lib/theme";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SkipLink } from "@/components/layout/SkipLink";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

// Only used for the short Dzongkha line; not worth a preload on every page.
const notoTibetan = Noto_Serif_Tibetan({
  subsets: ["tibetan"],
  variable: "--font-noto-tibetan",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · ${TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_GB" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0C" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets data-theme before React hydrates, hence suppressHydrationWarning.
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${cormorant.variable} ${dmMono.variable} ${notoTibetan.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-svh">
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}"}</style>
        </noscript>
        <MotionProvider>
          <SkipLink label="Skip to content" />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
