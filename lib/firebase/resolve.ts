import { rateLimit } from "@/lib/security/rateLimit";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { validateResolveInput } from "@/lib/validators/resolveValidator";

export async function submitResolveRequest(data: {
  user: string;
  platform: string;
  issue: string;
}) {
  // 1️⃣ Server-side validation (VERY IMPORTANT)
  validateResolveInput({
    platform: data.platform,
    issue: data.issue,
  });

  // 2️⃣ Save to Firestore
  await addDoc(collection(db, "resolveRequests"), {
    user: data.user,
    platform: data.platform,
    issue: data.issue,
    createdAt: serverTimestamp(),
  });
}
