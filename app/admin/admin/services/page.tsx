import AdminExtraOrderFormSection from "@/components/admin/AdminExtraOrderForm";
import OrganicService from "@/components/admin/OrganicServicesAdmin";
import { Card } from "@/components/ui/card";
import { FormattedServiceData } from "@/lib/action/organicMockData.action";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import {
  FirebaseService,
  processOrganicData,
} from "@/lib/processDataOrganicAdmin/processData";

import { currentUser } from "@clerk/nextjs/server";

const AddServices = async () => {
  const user = await currentUser();
  let organicServices: FormattedServiceData[] = [];
  try {
    const organicService = adminDb
      .collection("classic-media-extra-services")
      .get();
    organicServices = (await organicService).docs.map((doc) => ({
      description: doc.data().description,
      createdBy: doc.data().createdBy,
      updatedBy: doc.data().updatedBy,
      hours: doc.data().hours,
      maxQty: doc.data().maxQty,
      minQty: doc.data().minQty,
      minutes: doc.data().minutes,
      rate: doc.data().rate,
      serviceId: doc.data().serviceId,
      approved: doc.data().approved,
      id: doc.id,
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("API Error:", error.message);
    } else {
      console.log("API Error: An unknown error occurred");
    }
  }

  const { organicCategories, organicServicesByCategory } =
    processOrganicData(organicServices);
  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-lg">
        <div className="mb-6 text-center md:text-left">
          <h3 className="text-2xl font-bold mb-4 mt-4 ml-4 text-center md:text-left text-blue-700 dark:text-blue-300">
            Choose Your Platform
          </h3>
          <OrganicService
            organicCategories={organicCategories}
            organicServicesByCategory={
              organicServicesByCategory as Record<string, FirebaseService[]>
            }
          />
        </div>
      </Card>
      <Card>
        <AdminExtraOrderFormSection
          user={user?.id ?? ""}
          organicServices={organicServices}
          organicServicesByCategory={organicServicesByCategory}
        />
      </Card>
    </>
  );
};

export default AddServices;
