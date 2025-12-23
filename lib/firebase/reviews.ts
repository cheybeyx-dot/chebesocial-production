import { db } from "./firebaseAdmin";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

/**
 * Review shape:
 * {
 *  name: string
 *  message: string
 *  rating: number (1–5)
 *  approved: boolean
 *  createdAt: Timestamp
 * }
 */

const reviewsRef = collection(db, "reviews");

// USER — submit review
export async function submitReview(data: {
  name: string;
  message: string;
  rating: number;
}) {
  await addDoc(reviewsRef, {
    ...data,
    approved: false,
    createdAt: Timestamp.now(),
  });
}

// ADMIN — get all reviews
export async function getAllReviews() {
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ADMIN — approve / reject review
export async function updateReviewStatus(id: string, approved: boolean) {
  const ref = doc(db, "reviews", id);
  await updateDoc(ref, { approved });
}

// PUBLIC — get approved reviews only
export async function getApprovedReviews() {
  const q = query(
    reviewsRef,
    where("approved", "==", true),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
