"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const supportServices = [
  "Buy Verified Account",
  "Account Recovery",
  "Disabled Account Appeal",
  "Suspended Account Fix",
];

export default function AccountSupportPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [issue, setIssue] = useState("");

  const submitRequest = () => {
    if (!selectedService || !issue) return;

    alert("Your request has been submitted. Our team will review it.");

    setSelectedService(null);
    setIssue("");
  };

  return (
    <div className="container mx-auto py-10 max-w-xl">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Account Support & Recovery
        </h1>

        {!selectedService && (
          <div className="grid grid-cols-1 gap-3">
            {supportServices.map((service) => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className="border rounded-lg p-4 hover:bg-muted transition text-left"
              >
                {service}
              </button>
            ))}
          </div>
        )}

        {selectedService && (
          <>
            <button
              onClick={() => setSelectedService(null)}
              className="text-sm text-blue-500"
            >
              ← Back
            </button>

            <p className="font-semibold">{selectedService}</p>

            <Textarea
              placeholder="Describe the issue you are having with your account..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />

            <Button className="w-full" onClick={submitRequest}>
              Submit Request
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
