import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adult Platform Engagement Services | Chebe Social",
  description:
    "Chebe Social offers professional engagement services for adult platforms, helping creators grow visibility, followers, and interactions safely.",
};

export default function AdultPlatformEngagementPage() {
  return (
    <main className="container mx-auto py-10 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold">
          Adult Platform Engagement Services
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Chebe Social provides discreet and professional engagement services
          for adult content creators, helping increase reach, visibility, and
          audience interaction.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">What We Offer</h2>
        <ul className="mt-6 max-w-3xl mx-auto space-y-2 text-gray-700">
          <li>• Profile engagement</li>
          <li>• Content interaction</li>
          <li>• Audience growth</li>
          <li>• Safe and discreet services</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">
          Confidential & Secure
        </h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-center">
          We prioritize privacy, safety, and professionalism for all adult
          platform engagement services.
        </p>
      </section>
    </main>
  );
}
