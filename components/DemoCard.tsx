import React from "react";
import { ApiService } from "./users/OrderFormSection";
import { Card } from "./ui/card";
import { FirebaseService } from "@/lib/processDataOrganic/processData";

interface DemoCardProps {
  selectedServiceApi?: string | null;
  selectedServiceCategoryDb: string | null;
  apiService: ApiService | null;
  selectedOrganicServicesDes: FirebaseService | null;
}
const DemoCard = ({
  selectedServiceCategoryDb,
  apiService,
  selectedServiceApi,
  selectedOrganicServicesDes,
}: DemoCardProps) => {
  const hours = apiService?.hours.toString().padStart(2, "0");
  const minutes = apiService?.minutes.toString().padStart(2, "0");
  const organicHour = selectedOrganicServicesDes?.hours
    ?.toString()
    .padStart(2, "0");
  const organicMinutes = selectedOrganicServicesDes?.minutes
    ?.toString()
    .padStart(2, "0");
  return (
    <Card className="p-4 shadow-lg">
      <div>
        <div className="mb-4">
          <label className="text-sm">Example Link</label>
          <div className="p-2 rounded-md text-sm">
            <i>https://facebook.com/...</i>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Start Time</label>
            <div className="p-2 rounded-md text-sm">
              {hours && minutes
                ? `${hours}:${minutes}`
                : organicHour && organicMinutes
                ? `${organicHour}:${organicMinutes}`
                : "Loading..."}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Speed</label>
            <div className="p-2 rounded-md text-sm">Loading...</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm">Description</label>
          <div className="p-2 rounded-md text-sm">
            {apiService?.name ||
              selectedServiceCategoryDb ||
              selectedServiceApi ||
              selectedOrganicServicesDes?.description}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-600">How to Place Order</label>
          <div className="relative w-full">
            <iframe
              className="w-full aspect-video rounded-md"
              src="https://www.youtube.com/embed/Arn_9yE3IDg"
              title="How to Place Order"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DemoCard;
