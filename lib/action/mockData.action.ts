"use server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { readFile } from "fs/promises";
import { adminDb } from "../firebase/firebaseAdmin";
interface ServiceData {
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
  subcategories?: string[];
  logoUrl?: string;
}
export const mockDataFromFirebase = async () => {
  const SERVICES_COLLECTION = "classic-media-admin-services";
  if (process.env.NODE_ENV === "development") {
    try {
      const data = JSON.parse(
        await readFile("firestore-export/firestore-export.json", "utf8")
      );

      // Process each service
      for (const [serviceId, serviceData] of Object.entries(
        data["classic-media-admin-services"] as { [key: string]: ServiceData }
      )) {
        // Extract relevant fields
        const {
          name,
          createdAt,
          updatedAt,
          createdBy,
          updatedBy,
          subcategories,
          logoUrl,
        } = serviceData;

        // Format the data for insertion
        const formattedData = {
          approved: false,
          name,
          serviceId,
          createdBy,
          updatedBy,
          createdAt: createdAt?.seconds
            ? Timestamp.fromMillis(createdAt.seconds * 1000)
            : Timestamp.now(),
          updatedAt: updatedAt?.seconds
            ? Timestamp.fromMillis(updatedAt.seconds * 1000)
            : Timestamp.now(),
          subcategories,
          logoUrl,
          lastSignInAt: null, // Assuming this isn't provided in the original data
          username: null, // Assuming this isn't provided in the original data
        };

        // Insert into the database
        await adminDb
          .collection(SERVICES_COLLECTION)
          .doc(serviceId)
          .set(
            {
              ...formattedData,
              createdAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );

        console.log(`Processed service: ${name}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
  } else {
    console.log("Not permitted");
  }
};
