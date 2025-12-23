// app/privacy-policy/page.tsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Privacy Policy for ChebeSocial.com
      </h1>
      <p className="mb-4">
        <strong>Last Updated:</strong> {new Date().toISOString()}
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          1. Information We Collect
        </h2>
        <p className="mb-3">
          We may collect the following information when you use our service:
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li>
            <strong>Personal Information:</strong> Name, email, contact details,
            payment information.
          </li>
          <li>
            <strong>Social Media Data:</strong> Usernames, profile information
            (only for boosting services).
          </li>
          <li>
            <strong>Usage Data:</strong> IP address, browser type, device
            information, interactions with our service.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 mb-3">
          <li>To provide and improve our boosting services.</li>
          <li>To process transactions and send confirmations.</li>
          <li>To communicate with you (customer support, updates).</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          3. Data Sharing & Disclosure
        </h2>
        <p className="mb-3">
          We do not sell your personal data. However, we may share information
          with:
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li>
            <strong>Service Providers</strong> (payment processors, hosting
            providers).
          </li>
          <li>
            <strong>Legal Authorities</strong> (if required by law).
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
        <p className="mb-3">
          We implement security measures to protect your data, but no method is
          100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">5. Third-Party Links</h2>
        <p className="mb-3">
          Our service may link to third-party websites. We are not responsible
          for their privacy practices.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
        <p className="mb-3">Depending on your location, you may:</p>
        <ul className="list-disc pl-6 mb-3">
          <li>Access, update, or delete your data.</li>
          <li>Opt out of marketing communications.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          7. Changes to This Policy
        </h2>
        <p className="mb-3">
          We may update this Privacy Policy. Check this page for the latest
          version.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
        <p className="mb-3">For questions, contact us at:</p>
        <ul className="list-disc pl-6 mb-3">
          <li>
            <strong>Email:</strong> chebesocial@gmail.com
          </li>
          <li>
            <strong>Website:</strong>{" "}
            <a
              href="https://chebesocial.com"
              className="text-blue-500 hover:underline"
            >
              https://chebesocial.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
