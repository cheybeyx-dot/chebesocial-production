import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const faqCollection = collection(db, "faqs");

// Admin: create FAQ
export async function createFaq(data: Omit<FaqItem, "id">) {
  return await addDoc(faqCollection, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Admin: update FAQ
export async function updateFaq(id: string, data: Partial<FaqItem>) {
  const ref = doc(db, "faqs", id);
  return await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Admin: delete FAQ
export async function deleteFaq(id: string) {
  const ref = doc(db, "faqs", id);
  return await deleteDoc(ref);
}

// Admin: get all FAQs
export async function getAllFaqs() {
  const q = query(faqCollection, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FaqItem),
  }));
}

// Public: get published FAQs
export async function getPublishedFaqs() {
  const q = query(
    faqCollection,
    where("isPublished", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FaqItem),
  }));
}

// Admin: get single FAQ
export async function getFaqById(id: string) {
  const ref = doc(db, "faqs", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as FaqItem),
  };
}
