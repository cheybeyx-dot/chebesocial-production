import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organic SMM Panel – Real Global Social Media Growth | Chebe Social",
  description:
    "Chebe Social offers the best organic SMM panel worldwide. Get real engagement, safe growth, and affordable pricing for all major social media platforms.",
};

export default function OrganicSmmPanelPage() {
  return (
    <main className="container mx-auto py-10 space-y-12">
      {/* HERO */}
      <section className="text-center">
        <h1 className="text-4xl font-bold">
          Organic SMM Panel for Real Social Media Growth
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Chebe Social provides professional organic SMM panel services designed
          to help creators, businesses, and brands grow safely and sustainably.
          We deliver real engagement across all major platforms with full
          transparency and global coverage.
        </p>
      </section>

      {/* WHY CHOOSE US */}
      <section>
        <h2 className="text-3xl font-semibold text-center">
          Why Choose Chebe Social
        </h2>
        <ul className="mt-6 max-w-3xl mx-auto space-y-2 text-gray-700">
          <li>• 100% organic and safe engagement</li>
          <li>• Global services for all major platforms</li>
          <li>• Affordable pricing with high-quality delivery</li>
          <li>• Trusted by creators and businesses worldwide</li>
          <li>• PWA, iOS, and Android app access</li>
        </ul>
      </section>

      {/* PLATFORMS */}
      <section>
        <h2 className="text-3xl font-semibold text-center">
          Supported Platforms
        </h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-center">
          Our organic SMM panel supports YouTube, Facebook, TikTok, Instagram,
          Twitter/X, and other popular social media platforms. Each service is
          designed to meet platform guidelines and ensure long-term growth.
        </p>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-semibold text-center">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 max-w-3xl mx-auto space-y-4 text-gray-700">
          <p>
            <strong>Is your organic SMM panel safe?</strong>
            <br />
            Yes. All our services are designed to follow platform rules and
            promote real, organic engagement.
          </p>

          <p>
            <strong>Do you offer worldwide services?</strong>
            <br />
            Yes. Chebe Social provides global social media growth solutions.
          </p>

          <p>
            <strong>Can beginners use your services?</strong>
            <br />
            Absolutely. Our services are suitable for beginners, creators, and
            businesses.
          </p>
        </div>
      </section>
    </main>
  );
}
