import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Chebe Social’s privacy policy to understand how we collect, use, and protect user information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>

      <p className="mt-6 text-gray-700 max-w-3xl">
        Chebe Social respects your privacy. We collect only the information
        necessary to provide our services and improve user experience.
      </p>

      <p className="mt-4 text-gray-700 max-w-3xl">
        We do not sell, trade, or share personal information with third parties
        except when required to deliver services or comply with legal
        obligations.
      </p>

      <p className="mt-4 text-gray-700 max-w-3xl">
        By using Chebe Social, you consent to this privacy policy.
      </p>
    </main>
  );
}
