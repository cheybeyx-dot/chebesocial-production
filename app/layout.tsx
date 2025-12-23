import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Chebe Social – Global Organic SMM Panel",
    template: "%s | Chebe Social",
  },
  description:
    "Chebe Social is a global organic SMM panel offering real social media engagement, monetized accounts, account management, ads solutions, music promotion, and digital growth services worldwide.",
  applicationName: "Chebe Social",
  authors: [{ name: "Chebe Social" }],
  creator: "Chebe Social",
  openGraph: {
    title: "Chebe Social – Global Organic SMM Panel",
    description:
      "Grow organically on YouTube, Facebook, TikTok, Instagram, and more.",
    url: "https://www.chebesocial.com",
    siteName: "Chebe Social",
    images: [
      {
        url: "https://www.chebesocial.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chebe Social – Global Organic SMM Panel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chebe Social – Global Organic SMM Panel",
    description:
      "Grow organically on YouTube, Facebook, TikTok, Instagram, and more.",
    images: ["https://www.chebesocial.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="google3867fe0832cbaac2"
        />
      </head>

      <body>
        {/* Structured Data */}
        <Script
          id="chebe-organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Chebe Social",
              url: "https://www.chebesocial.com",
              logo: "https://www.chebesocial.com/og-image.png",
              description:
                "Chebe Social is a global organic SMM panel offering social media growth, monetized accounts, ads solutions, music promotion, and digital services worldwide.",
            }),
          }}
        />

        {/* Payment scripts can stay – they will NOT break deploy */}
        <Script
          src="https://korapay.com/inline-checkout.js"
          strategy="afterInteractive"
        />

        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
