import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { SITE } from "@/content/site";
import { MotionProvider } from "@/lib/animations/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Eggs } from "@/components/eggs/Eggs";
import "./globals.css";

// Fraunces with the SOFT and optical-size axes: the same headings as entertheteatemple.com
// (SOFT 50 is set in globals.css). Plex Mono is for small uppercase labels only.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.seo.url),
  title: SITE.seo.title,
  description: SITE.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.seo.url,
    siteName: SITE.name,
    title: SITE.seo.title,
    description: SITE.seo.description,
    // /og.png - 1200×630 social image (provided by the owner).
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seo.title,
    description: SITE.seo.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#14100d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} grain h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-stage"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header />
          {children}
          <Footer />
          <Eggs />
        </MotionProvider>
      </body>
    </html>
  );
}
