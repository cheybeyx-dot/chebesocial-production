import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Organic Followers",
  description:
    "Get real and organic Instagram followers and engagement with Chebe Social. Safe delivery, no password required, and trusted worldwide.",
};

export default function InstagramServicePage() {
  return (
    <main className="container mx-auto py-16">
      <h1 className="text-4xl font-bold">Instagram Organic Followers</h1>

      <p className="mt-4 text-gray-600 max-w-3xl">
        Chebe Social offers real and organic Instagram followers and engagement
        designed to grow your profile safely. Our services use gradual delivery
        and real users to ensure long-term account safety.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Why Choose Our Instagram Services?
      </h2>

      <ul className="mt-4 space-y-2 text-gray-700">
        <li>• 100% organic growth</li>
        <li>• No password required</li>
        <li>• Safe for personal and business accounts</li>
        <li>• Global reach and affordable pricing</li>
      </ul>
    </main>
  );
}
