import { Card } from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";

import { adminDb } from "@/lib/firebase/firebaseAdmin";
import AdminCategoryButtonGroup from "@/components/admin/AdCategoryButtonGroup";
import AdminBuyAccountSections from "@/components/admin/AdminBuyAccountSection";
import AdminOrderFormSection from "@/components/admin/AdminOrderFormSection";
import {
  FirebaseProcessProps,
  processData,
  processDataFirebase,
  Service,
} from "@/lib/processDataAdminApi/processData";

export default async function AdminEditServices() {
  const user = await currentUser();

  const refLink = user?.id ? user.id.slice(9, 18) : "";
  let fetchedData: Service[] = [];
  let fetchedFirebase: FirebaseProcessProps = {
    logoUrl: "",
    name: "",
    serviceId: "",
    subcategories: [],
  };
  try {
    const response = await fetch("https://reallysimplesocial.com/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.SOCIAL_API_KEY,
        action: "services",
      }),
    });
    const firebaseData = await adminDb
      .collection("classic-media-admin-services")
      .doc("cgqJWX1hbSib8N9qBYO9")
      .get();

    fetchedFirebase = (firebaseData.data() as FirebaseProcessProps) || {
      logoUrl: "",
      name: "",
      serviceId: "",
      subcategories: [],
    };

    fetchedData = await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("API Error:", error.message);
    } else {
      console.log("API Error: An unknown error occurred");
    }
  }

  const { categories, servicesByCategory } = processData(fetchedData);
  const { logoUrl, subcategories, name, serviceId } =
    processDataFirebase(fetchedFirebase);

  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-lg">
        <div className="mb-6 text-center md:text-left">
          <h3 className="text-2xl font-bold mb-4 mt-4 ml-4 text-center md:text-left text-blue-700 dark:text-blue-300">
            Choose Your Platform
          </h3>
          <AdminCategoryButtonGroup
            categories={categories}
            servicesByCategory={servicesByCategory as Record<string, Service[]>}
            refLink={refLink}
            user={user?.id ?? ""}
          />
          <AdminBuyAccountSections
            logoUrl={logoUrl ?? ""}
            name={name ?? ""}
            serviceId={serviceId ?? ""}
            subCategories={subcategories}
          />
        </div>
      </Card>
      <Card>
        <AdminOrderFormSection
          servicesByCategory={servicesByCategory}
          user={user?.id ?? ""}
        />
      </Card>
    </>
  );
}
