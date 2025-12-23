import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Chebe Social’s organic social media growth services including engagement, monetized accounts, ads solutions, music promotion, and account management worldwide.",
};

export default function ServicesPage() {
  return (
    <main className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center">Our Services</h1>

      <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
        Chebe Social provides a complete range of organic social media growth
        and digital services for creators, brands, and businesses worldwide.
      </p>

      <ul className="mt-10 space-y-4 max-w-xl mx-auto text-lg text-gray-700">
        <li>• Instagram Organic Followers & Engagement</li>
        <li>• TikTok Engagement & Growth</li>
        <li>• YouTube Watch Hours & Monetization Support</li>
        <li>• Monetized, New & Aged Accounts</li>
        <li>• Ads Setup, Management & Issue Resolution</li>
        <li>• Music Promotion & Music Distribution</li>
        <li>• Adult Platform Engagement Services</li>
      </ul>
    </main>
  );
}
