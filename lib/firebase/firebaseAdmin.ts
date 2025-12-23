import { credential } from "firebase-admin";
import { getApp, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Ensure environment variables are set for emulators
if (process.env.NODE_ENV === "development") {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
}

function createAdminApp(): App {
  try {
    // Validate required environment variables
    const requiredEnvVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_PRIVATE_KEY",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_STORAGE_BUCKET",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing Firebase environment variables: ${missingVars.join(", ")}`
      );
    }

    const adminCredentials = {
      credential: credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    };

    const app = initializeApp(adminCredentials);

    if (process.env.NODE_ENV === "development") {
      getFirestore(app).settings({
        host: "127.0.0.1:8080",
        ssl: false,
        ignoreUndefinedProperties: true,
      });
    }

    return app;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

// Ensure only one app is initialized
const app = getApps().length === 0 ? createAdminApp() : getApp();

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);
const adminBucket = getStorage(app);

export { adminAuth, adminDb, adminBucket };
