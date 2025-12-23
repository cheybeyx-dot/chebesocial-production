"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  type QueryConstraint,
  type DocumentData,
  Timestamp,
  getDoc,
  type QuerySnapshot,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { useUser } from "@clerk/nextjs";

type FirestoreData = DocumentData | null;

interface FirestoreState {
  documentData: FirestoreData;
  documentData1: FirestoreData;
  collectionData: FirestoreData[];
  collectionDataWithQ: FirestoreData[];
  loading: boolean;
  error: Error | null;
}

interface FirestoreDocument extends DocumentData {
  id: string;
}

type UnsubscribeFn = () => void;
type SubscriptionMap = Record<string, UnsubscribeFn>;

export function useFirestoreCRUD() {
  const { user, isLoaded } = useUser();

  const [state, setState] = useState<FirestoreState>({
    documentData: null,
    documentData1: null,
    collectionData: [],
    collectionDataWithQ: [],
    loading: false,
    error: null,
  });

  const unsubscribeRefs = useRef<SubscriptionMap>({});

  const updateState = useCallback((updates: Partial<FirestoreState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const requireAuth = useCallback(() => {
    if (!isLoaded || !user) {
      throw new Error("User not authenticated");
    }
    return user;
  }, [isLoaded, user]);

  const handleError = useCallback(
    (error: unknown) => {
      const formatted =
        error instanceof Error ? error : new Error("Unknown Firestore error");
      console.error(formatted);
      updateState({ error: formatted, loading: false });
      throw formatted;
    },
    [updateState]
  );

  const listenToDocument = useCallback(
    (collectionName: string, documentId: string): UnsubscribeFn => {
      updateState({ loading: true, error: null });

      const key = `${collectionName}-${documentId}`;
      unsubscribeRefs.current[key]?.();

      const unsub = onSnapshot(
        doc(db, collectionName, documentId),
        (snap: DocumentSnapshot<DocumentData>) => {
          updateState({
            documentData: snap.exists()
              ? { id: snap.id, ...snap.data() }
              : null,
            loading: false,
          });
        },
        (err: FirestoreError) => handleError(err)
      );

      unsubscribeRefs.current[key] = unsub;
      return unsub;
    },
    [handleError, updateState]
  );

  const listenToCollection = useCallback(
    (
      collectionName: string,
      constraints: QueryConstraint[] = []
    ): UnsubscribeFn => {
      updateState({ loading: true, error: null });

      unsubscribeRefs.current[collectionName]?.();

      const q = query(collection(db, collectionName), ...constraints);
      const unsub = onSnapshot(
        q,
        (snap: QuerySnapshot<DocumentData>) => {
          const docs: FirestoreDocument[] = snap.docs.map(
            (d: QueryDocumentSnapshot<DocumentData>) => ({
              id: d.id,
              ...d.data(),
            })
          );
          updateState({ collectionData: docs, loading: false });
        },
        (err: FirestoreError) => handleError(err)
      );

      unsubscribeRefs.current[collectionName] = unsub;
      return unsub;
    },
    [handleError, updateState]
  );

  const addCollection = useCallback(
    async (collectionName: string, data: DocumentData) => {
      const currentUser = requireAuth();
      try {
        const ref = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: Timestamp.now(),
          createdBy: currentUser.id,
          email: currentUser.emailAddresses[0]?.emailAddress,
        });
        return ref.id;
      } catch (e) {
        handleError(e);
      }
    },
    [requireAuth, handleError]
  );

  const updateDocument = useCallback(
    async (collectionName: string, docId: string, data: DocumentData) => {
      const currentUser = requireAuth();
      try {
        await updateDoc(doc(db, collectionName, docId), {
          ...data,
          updatedAt: Timestamp.now(),
          updatedBy: currentUser.id,
        });
      } catch (e) {
        handleError(e);
      }
    },
    [requireAuth, handleError]
  );

  useEffect(() => {
    return () => {
      Object.values(unsubscribeRefs.current).forEach((fn) => fn());
    };
  }, []);

  return useMemo(
    () => ({
      ...state,
      listenToDocument,
      listenToCollection,
      addCollection,
      updateDocument,
    }),
    [state, listenToDocument, listenToCollection, addCollection, updateDocument]
  );
}
