"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface TwoFactorVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TwoFactorVerification({
  onSuccess,
  onCancel,
}: TwoFactorVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch("/api/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationCode }),
      });

      if (response.ok) {
        const { isValid } = await response.json();
        if (isValid) {
          onSuccess();
        } else {
          toast("Error",{
            description: "Invalid verification code. Please try again.",
            className: "bg-red-500 text-white",
          });
        }
      } else {
        throw new Error("Failed to verify 2FA");
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      toast("Error",{
        description: "An error occurred during verification. Please try again.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Two-Factor Authentication</h3>
      <p>
        Please enter the 6-digit code from your authenticator app to complete
        the withdrawal.
      </p>
      <Input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Enter 6-digit code"
        maxLength={6}
      />
      <div className="flex gap-4">
        <Button onClick={onCancel} variant="outline" className="w-1/2">
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          disabled={isVerifying || verificationCode.length !== 6}
          className="w-1/2"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  );
}
