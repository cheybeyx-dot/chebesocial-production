"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { apiOrderSchema } from "@/lib/validators/orderSchemas";
import { validateInput } from "@/lib/validators/validate";

interface ApiServiceFormProps {
  servicesByCategory: Record<string, any[]>;
  selectedCategoryApi: string;
  setSelectedServiceApi: (id: string | null) => void;
  user: string;
  setApiService: (service: any) => void;
}

export default function ApiServiceForm({
  servicesByCategory,
  selectedCategoryApi,
  setSelectedServiceApi,
  user,
  setApiService,
}: ApiServiceFormProps) {
  const [serviceId, setServiceId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [link, setLink] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const services = servicesByCategory[selectedCategoryApi] || [];

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    const validation = validateInput(apiOrderSchema, {
      userId: user,
      email: user,
      serviceId,
      quantity,
      link,
      instructions,
    });

    if (!validation.success) {
      setError(validation.error);
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "api_orders"), {
        ...validation.data,
        category: selectedCategoryApi,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setServiceId("");
      setQuantity(0);
      setLink("");
      setInstructions("");
      setSelectedServiceApi(null);
      setApiService(null);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <h3 className="text-lg font-semibold">Automated API Service</h3>

      <select
        className="w-full border rounded-md p-2"
        value={serviceId}
        onChange={(e) => {
          setServiceId(e.target.value);
          const svc = services.find((s) => s.id === e.target.value);
          setApiService(svc || null);
          setSelectedServiceApi(e.target.value);
        }}
      >
        <option value="">Select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      <Input
        type="number"
        placeholder="Quantity"
        value={quantity || ""}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <Input
        placeholder="Target link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <Textarea
        placeholder="Custom instructions (optional)"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={4}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Order placed successfully.</p>
      )}

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Place Order"}
      </Button>
    </Card>
  );
}
