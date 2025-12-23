"use server";
import { readFile } from "fs/promises";
import { adminDb } from "../firebase/firebaseAdmin";

export interface FormattedServiceData {
  description: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  createdBy: string;
  updatedBy: string;
  hours: number;
  maxQty: number;
  minQty: number;
  minutes: number;
  rate: number;
  approved: boolean;
  serviceId: string;
  id: string;
}
const SERVICES_COLLECTION = "classic-media-extra-services";
export const mockOrganicDataFromFirebase = async () => {
  try {
    const data = JSON.parse(
      await readFile("firestore-export/organic-export.json", "utf8")
    );

    for (const [userId, serviceData] of Object.entries(
      data["classic-media-extra-services"] as { [key: string]: FormattedServiceData }
    )) {
      const {
        description,
        createdAt,
        createdBy,
        hours,
        maxQty,
        minQty,
        minutes,
        serviceId,
        rate,
      } = serviceData;  

      await adminDb.collection(SERVICES_COLLECTION).doc(userId).set(
        {
          serviceId,
          description,
          createdAt,
          createdBy,
          hours,
          maxQty,
          minQty,
          minutes,
          rate,
          approved: false,
        },
        { merge: true }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
  }
};
