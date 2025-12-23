"use client";

import { useState } from "react";
import Image from "next/image";

export default function TwoFactorSetup({ userId }: { userId: string }) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  const setupTwoFactor = async () => {
    const response = await fetch("/users/api/generate-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      setQrCode(data.qrCodeDataUrl);
      setSecret(data.secret);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 rounded-lg shadow-xl">
      <h6 className="font-bold mb-4">
        Set Up Two-Factor Authentication
      </h6>
      {!qrCode && (
        <button
          onClick={setupTwoFactor}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Set up 2FA
        </button>
      )}
      {qrCode && (
        <div className="mt-4">
          <p className="mb-2">Scan this QR code with Google Authenticator:</p>
          <Image
            src={qrCode || "/placeholder.svg"}
            alt="2FA QR Code"
            width={200}
            height={200}
          />
          <p className="mt-2">Or enter this secret manually: {secret}</p>
        </div>
      )}
    </div>
  );
}
