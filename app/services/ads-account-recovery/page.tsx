import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ads Account Recovery & Management | Chebe Social",
  description:
    "Chebe Social helps recover restricted ads accounts and provides professional ads setup and management services for Facebook, Google, TikTok, and more.",
};

export default function AdsAccountRecoveryPage() {
  return (
    <main className="container mx-auto py-10 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold">
          Ads Account Recovery & Management Services
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Chebe Social provides professional ads account recovery and management
          services. We help resolve account restrictions, policy violations, and
          ad disapprovals while ensuring long-term account stability.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">
          Platforms We Support
        </h2>
        <ul className="mt-6 max-w-3xl mx-auto space-y-2 text-gray-700">
          <li>• Facebook Ads</li>
          <li>• Google Ads</li>
          <li>• TikTok Ads</li>
          <li>• Instagram Ads</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">What We Do</h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-center">
          We fix restricted ads accounts, handle appeals, set up campaigns,
          manage ads, and ensure compliance with platform policies.
        </p>
      </section>
    </main>
  );
}
