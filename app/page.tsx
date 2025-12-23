import type { Metadata } from "next";
import PageFade from "@/components/animation/PageFade";
import TrustBadges from "@/components/trust/TrustBadges";
import InstallPrompt from "@/components/pwa/InstallPrompt";

export const metadata: Metadata = {
  title: {
    default: "Chebe Social – Global Organic SMM Panel",
    template: "%s | Chebe Social",
  },
  description:
    "Chebe Social is the world’s leading organic SMM panel offering real social media growth, monetized accounts, ads solutions, music promotion, watch hours, and digital services worldwide.",

  openGraph: {
    title: "Chebe Social – Global Organic SMM Panel",
    description:
      "Grow organically on YouTube, Facebook, TikTok, Instagram, and more. Monetized accounts, ads management, music promotion, adult engagement services, and content mentorship worldwide.",
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
      "Grow organically on YouTube, Facebook, TikTok, Instagram, and more. Monetized accounts, ads management, music promotion, adult engagement services, and content mentorship worldwide.",
    images: ["https://www.chebesocial.com/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <PageFade>
      <main className="container mx-auto py-10 space-y-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold">
            Chebe Social – Global Organic SMM Panel
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            At Chebe Social, we provide professional organic growth services
            worldwide. We solve account restrictions, manage ads setup, sell
            monetized YouTube, Facebook, and TikTok accounts, and offer adult
            platform engagement. Our services include organic engagement, music
            promotion, watch hours, content creation mentorship, and both new
            and aged social media accounts.
          </p>
        </section>

        <TrustBadges />

        <section>
          <h2 className="text-3xl font-semibold text-center">Our Services</h2>
          <ul className="mt-8 max-w-3xl mx-auto space-y-3 text-gray-700">
            <li>• Organic growth for all major social media platforms</li>
            <li>• Monetized and aged accounts for YouTube, Facebook, TikTok</li>
            <li>• Ads setup, management, and account recovery</li>
            <li>• Adult platform engagement services</li>
            <li>
              • Music promotion and registration on all streaming platforms
            </li>
            <li>• Watch hours for YouTube, Facebook, TikTok</li>
            <li>• Content creation mentorship and growth consulting</li>
          </ul>
        </section>

        <InstallPrompt />
      </main>
    </PageFade>
  );
}
