import { Card } from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";
import {
  processData,
  processDataFirebase,
} from "@/lib/processDataApi/processData";
import type {
  FirebaseProcessProps,
  Service,
} from "@/lib/processDataApi/processData";
import CategoryButtonGroup from "@/components/users/CategoryButtonGroup";
import HeaderForm from "@/components/users/StatHeader";
import UserStats from "@/components/users/UserStat";
import OrderFormSection from "@/components/users/OrderFormSection";
import QuickActions from "@/components/users/QuickAction";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import BuyAccountSection from "@/components/users/BuyAccountSection";
import { FieldValue } from "firebase-admin/firestore";
import {
  FirebaseService,
  processOrganicData,
} from "@/lib/processDataOrganic/processData";
import OrganicService from "@/components/users/OrganicServices";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  const params = await searchParams;
  const refLinks = params?.refLink as string | undefined;
  const refLink = user?.id ? user.id.slice(9, 18) : "";
  let fetchedData: Service[] = [];
  let referredById = "";
  let fetchedFirebase: FirebaseProcessProps = {
    logoUrl: "",
    name: "",
    serviceId: "",
    subcategories: [],
  };
  let firebaseServices: FirebaseService[] = [];

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

    if (refLinks && user?.id) {
      const existingLinkSnapshot = adminDb.collection("classic-media-referral");
      const fetchedData = await existingLinkSnapshot
        .where("referralLink", "==", refLinks)
        .get();
      if (!fetchedData.empty) {
        const existingLinkDoc = fetchedData.docs[0];
        referredById = existingLinkDoc.id;
        await adminDb
          .collection("classic-media-referral")
          .doc(existingLinkDoc.id)
          .set(
            {
              referredUserId: FieldValue.arrayUnion(user.id),
              referredUserLink: FieldValue.arrayUnion({
                refLink,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                createdAt: user.createdAt,
              }),
            },
            { merge: true }
          );
      }

      await adminDb
        .collection("classic-media-users")
        .doc(user.id)
        .set(
          { referreredBy: refLinks, referredById: referredById },
          { merge: true }
        );
    }

    const firebaseData = await adminDb
      .collection("classic-media-admin-services")
      .doc("cgqJWX1hbSib8N9qBYO9")
      .get();
    const servicesDoc = await adminDb
      .collection("classic-media-extra-services")
      .get();
    firebaseServices = servicesDoc.docs.map((service) => ({
      id: service.id,
      maxQty: service.data().maxQty,
      minQty: service.data().minQty,
      description: service.data().description,
      hours: service.data().hours,
      minutes: service.data().minutes,
      rate: service.data().rate,
      serviceId: service.data().serviceId,
    }));
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

  const emailAddress = user?.emailAddresses?.[0]?.emailAddress ?? null;

  const { categories, servicesByCategory } = processData(fetchedData);
  const { organicCategories, organicServicesByCategory } =
    processOrganicData(firebaseServices);
  const { logoUrl, subcategories, name, serviceId } =
    processDataFirebase(fetchedFirebase);
  // Destructure firebaseServices
  const organicServices = firebaseServices.map((service) => ({
    serviceId: service.serviceId,
    description: service.description,
    hours: service.hours,
    minutes: service.minutes,
    name: service.serviceId,
    rate: service.rate,
    minQty: service.minQty,
    maxQty: service.maxQty,
    iconPath: service.iconPath,
  }));
  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-lg">
        <div className="mt-4 text-center md:text-left text-blue-700 dark:text-blue-300"></div>
        <HeaderForm user={user?.firstName ?? ""} />
      </Card>
      <UserStats user={user?.id ?? ""} refLink={refLink} />
      <Card className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-lg">
        <div className="mt-4 text-center md:text-left text-blue-700 dark:text-blue-300"></div>
        <QuickActions
          user={user?.id ?? ""}
          emailAddress={emailAddress}
          refLink={refLink}
        />
      </Card>

      <Card className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-lg">
        <div className="mb-6 text-center md:text-left">
          <h3 className="text-2xl font-bold mb-4 mt-4 ml-4 text-center md:text-left text-blue-700 dark:text-blue-300">
            Choose Your Platform
          </h3>
          <CategoryButtonGroup
            categories={categories}
            servicesByCategory={servicesByCategory as Record<string, Service[]>}
            refLink={refLink}
            user={user?.id ?? ""}
          />

          <OrganicService
            organicCategories={organicCategories}
            organicServicesByCategory={
              organicServicesByCategory as Record<string, FirebaseService[]>
            }
          />

          <BuyAccountSection
            logoUrl={logoUrl ?? ""}
            name={name ?? ""}
            serviceId={serviceId ?? ""}
            subCategories={subcategories}
          />
        </div>
      </Card>

      <Card>
        <OrderFormSection
          servicesByCategory={servicesByCategory}
          user={user?.id ?? ""}
          organicServices={organicServices}
          organicServicesByCategory={organicServicesByCategory}
        />
      </Card>
    </>
  );
}
