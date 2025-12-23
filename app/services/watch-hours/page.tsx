import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Watch Hours for YouTube, Facebook & TikTok | Chebe Social",
  description:
    "Get real watch hours for YouTube, Facebook, and TikTok to grow your account and meet monetization requirements safely.",
};

export default function WatchHoursPage() {
  return (
    <main className="container mx-auto py-10 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold">
          Watch Hours for YouTube, Facebook & TikTok
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Chebe Social provides real and organic watch hours to help creators
          reach monetization goals faster without risking their accounts.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">
          Supported Platforms
        </h2>
        <ul className="mt-6 max-w-3xl mx-auto space-y-2 text-gray-700">
          <li>• YouTube watch hours</li>
          <li>• Facebook watch time</li>
          <li>• TikTok video watch time</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">
          Safe & Organic Delivery
        </h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-center">
          All watch hours are delivered gradually to ensure account safety and
          compliance with platform policies.
        </p>
      </section>
    </main>
  );
}
