"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import DemoCard from "../DemoCard";

import ApiServices from "./form/ApiServiceForm";
import OrganicServiceForm from "./form/OrganicFormService";

import { submitResolveRequest } from "@/lib/firebase/resolve";

import type { Service } from "@/lib/processDataApi/processData";
import type { FirebaseService } from "@/lib/processDataOrganic/processData";

/* =====================
   SMALL REUSABLE UI
===================== */
function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-lg font-semibold mb-4 border-b pb-2">{title}</h2>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-4 text-sm text-blue-500 hover:underline"
    >
      ← Back
    </button>
  );
}

/* =====================
   MAIN COMPONENT
===================== */
interface OrderFormSectionProps {
  servicesByCategory: Record<string, Service[]>;
  user: string;
  organicServices: FirebaseService[];
  organicServicesByCategory: Record<string, FirebaseService[]>;
}

export default function OrderFormSection({
  servicesByCategory,
  user,
  organicServices,
  organicServicesByCategory,
}: OrderFormSectionProps) {
  const [activeCategory, setActiveCategory] = useState<
    "api" | "organic" | "resolve" | null
  >(null);

  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [selectedServiceApi, setSelectedServiceApi] = useState<string | null>(
    null
  );
  const [apiService, setApiService] = useState<any>(null);

  const [selectedOrganicServicesDes, setSelectedOrganicServicesDes] =
    useState<FirebaseService | null>(null);

  /* =====================
     RESOLVE FORM STATE
  ===================== */
  const [platform, setPlatform] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  /* =====================
     RESOLVE SUBMIT HANDLER
  ===================== */
  const handleResolveSubmit = async () => {
    if (!platform || issueDescription.length < 10) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      await submitResolveRequest({
        user,
        platform,
        issue: issueDescription,
      });

      alert("Your request has been submitted successfully");

      setPlatform("");
      setIssueDescription("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    }
  };

  const apiPlatforms = Object.keys(servicesByCategory || {});
  const organicPlatforms = Object.keys(organicServicesByCategory || {});

  const handleCategorySelect = (category: "api" | "organic" | "resolve") => {
    setActiveCategory(category);
    setActivePlatform(null);
    setShowOrderForm(false);
  };

  const handlePlatformSelect = (platform: string) => {
    setActivePlatform(platform);
    setShowOrderForm(true);
  };

  const handleBack = () => {
    setActivePlatform(null);
    setShowOrderForm(false);
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        <Card className="p-5 shadow-lg min-h-[400px]">
          {!activeCategory && (
            <>
              <SectionHeader title="Choose Service Category" />

              <div className="space-y-3">
                <button
                  onClick={() => handleCategorySelect("api")}
                  className="w-full border rounded-lg p-4 hover:bg-muted text-left"
                >
                  🚀 Automated API Services
                </button>

                <button
                  onClick={() => handleCategorySelect("organic")}
                  className="w-full border rounded-lg p-4 hover:bg-muted text-left"
                >
                  🌱 Polished Organic Services
                </button>

                <button
                  onClick={() => handleCategorySelect("resolve")}
                  className="w-full border rounded-lg p-4 hover:bg-muted text-left"
                >
                  🛠 Account Support & Recovery
                </button>
              </div>
            </>
          )}

          {activeCategory === "api" && !showOrderForm && (
            <>
              <SectionHeader title="Automated API Services" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {apiPlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformSelect(platform)}
                    className="border rounded-lg p-4 hover:bg-muted"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </>
          )}

          {activeCategory === "organic" && !showOrderForm && (
            <>
              <SectionHeader title="Organic Services" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {organicPlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformSelect(platform)}
                    className="border rounded-lg p-4 hover:bg-muted"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </>
          )}

          {activeCategory === "api" && showOrderForm && activePlatform && (
            <>
              <BackButton onClick={handleBack} />
              <ApiServices
                servicesByCategory={servicesByCategory}
                selectedCategoryApi={activePlatform}
                setSelectedServiceApi={setSelectedServiceApi}
                user={user}
                setApiService={setApiService}
              />
            </>
          )}

          {activeCategory === "organic" && showOrderForm && activePlatform && (
            <>
              <BackButton onClick={handleBack} />
              <OrganicServiceForm
                organicServices={organicServices}
                selectedCategoryApi={activePlatform}
                setSelectedServiceApi={setSelectedServiceApi}
                user={user}
                setApiService={setApiService}
                setSelectedOrganicServicesDes={setSelectedOrganicServicesDes}
                organicServicesByCategory={organicServicesByCategory}
              />
            </>
          )}

          {activeCategory === "resolve" && (
            <>
              <SectionHeader title="Account Support & Recovery" />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Platform
                  </label>
                  <input
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Describe Your Issue
                  </label>
                  <textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows={5}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResolveSubmit}
                  disabled={!platform || issueDescription.length < 10}
                  className="w-full bg-black text-white rounded-lg py-2 hover:opacity-90 disabled:opacity-50"
                >
                  Submit Request
                </button>
              </div>
            </>
          )}
        </Card>

        {/* RIGHT */}
        <DemoCard
          selectedServiceApi={selectedServiceApi}
          selectedServiceCategoryDb={null}
          apiService={apiService}
          selectedOrganicServicesDes={selectedOrganicServicesDes}
        />
      </div>
    </div>
  );
}
