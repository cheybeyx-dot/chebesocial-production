import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Chebe Social for support, inquiries, and professional social media growth services.",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto py-16">
      <h1 className="text-4xl font-bold">Contact Us</h1>

      <p className="mt-4 text-gray-700 max-w-2xl">
        Need help or have questions about our services? Reach out to Chebe
        Social and our support team will assist you as soon as possible.
      </p>

      <p className="mt-6 text-gray-700">📧 Email: support@chebesocial.com</p>
    </main>
  );
}
