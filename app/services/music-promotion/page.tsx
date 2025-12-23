import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Promotion & Distribution | Chebe Social",
  description:
    "Promote and distribute your music on Spotify, Apple Music, Audiomack, Boomplay, and all major streaming platforms with Chebe Social.",
};

export default function MusicPromotionPage() {
  return (
    <main className="container mx-auto py-10 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold">
          Music Promotion & Distribution Services
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Chebe Social helps artists promote their music globally and register
          songs on all major streaming platforms with real listeners and organic
          engagement.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">
          Platforms Covered
        </h2>
        <ul className="mt-6 max-w-3xl mx-auto space-y-2 text-gray-700">
          <li>• Spotify</li>
          <li>• Apple Music</li>
          <li>• Audiomack</li>
          <li>• Boomplay</li>
          <li>• YouTube Music</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center">Why Choose Us</h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-center">
          We offer real promotion, global reach, and professional music
          distribution services for independent artists and labels.
        </p>
      </section>
    </main>
  );
}
