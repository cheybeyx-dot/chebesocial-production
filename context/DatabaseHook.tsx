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
import { useUserData } from "./AuthProvider";
import { db } from "@/lib/firebase/firebaseConfig";
import { useUser } from "@clerk/nextjs";

type FirestoreData = DocumentData | null;

interface BalanceUpdateParams {
  userId: string;
  amount: number;
  description?: string;
  type: "credit" | "debit";
  category?: string;
  collectBalanceName: string;
}

interface BalanceHistoryEntry {
  previousBalance: number;
  newBalance: number;
  amount: number;
  type: "credit" | "debit";
  description?: string;
  category?: string;
  createdAt: Timestamp;
  createdBy: string;
}

interface FirestoreState {
  documentData: FirestoreData;
  documentData1: FirestoreData;
  collectionData: FirestoreData[];
  collectionDataWithQ: FirestoreData[];
  collectionWithoutQData: FirestoreData[];
  loading: boolean;
  error: Error | null;
}

interface FirestoreDocument extends DocumentData {
  id: string;
}

type UnsubscribeFn = () => void;
type SubscriptionMap = { [key: string]: UnsubscribeFn };

export function useFirestoreCRUD() {
  const [state, setState] = useState<FirestoreState>({
    documentData: null,
    documentData1: null,
    collectionData: [],
    collectionDataWithQ: [],
    collectionWithoutQData: [],
    loading: true,
    error: null,
  });

  const unsubscribeRefs = useRef<SubscriptionMap>({});
  const { user } = useUser();
  const { firebaseUser, isAuthenticated } = useUserData();

  const updateState = useCallback((updates: Partial<FirestoreState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback(
    (error: unknown) => {
      const formattedError =
        error instanceof Error ? error : new Error("An unknown error occurred");
      console.error("Firestore error:", error);
      updateState({ error: formattedError, loading: false });
      return formattedError;
    },
    [updateState]
  );

  const checkAuth = useCallback(() => {
    return isAuthenticated && firebaseUser !== null;
  }, [firebaseUser, isAuthenticated]);

  const waitForAuth = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (checkAuth()) {
        resolve();
      } else {
        const checkInterval = setInterval(() => {
          if (checkAuth()) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100); // Check every 100ms
      }
    });
  }, [checkAuth]);

  const listenToDocument = useCallback(
    (collectionName: string, documentId: string): UnsubscribeFn => {
      updateState({ loading: true, error: null });

      const subscriptionKey = `${collectionName}-${documentId}`;
      if (unsubscribeRefs.current[subscriptionKey]) {
        unsubscribeRefs.current[subscriptionKey]();
      }

      const unsubscribe = onSnapshot(
        doc(db, collectionName, documentId),
        (docSnapshot: DocumentSnapshot<DocumentData>) => {
          updateState({
            documentData: docSnapshot.exists()
              ? { id: docSnapshot.id, ...docSnapshot.data() }
              : null,
            loading: false,
          });
        },
        (err: FirestoreError) => handleError(err)
      );

      unsubscribeRefs.current[subscriptionKey] = unsubscribe;
      return unsubscribe;
    },
    [handleError, updateState]
  );
  const listenToDocument1 = useCallback(
    (collectionName: string, documentId: string): UnsubscribeFn => {
      updateState({ loading: true, error: null });

      const subscriptionKey = `${collectionName}-${documentId}`;
      if (unsubscribeRefs.current[subscriptionKey]) {
        unsubscribeRefs.current[subscriptionKey]();
      }

      const unsubscribe = onSnapshot(
        doc(db, collectionName, documentId),
        (docSnapshot: DocumentSnapshot<DocumentData>) => {
          updateState({
            documentData1: docSnapshot.exists()
              ? { id: docSnapshot.id, ...docSnapshot.data() }
              : null,
            loading: false,
          });
        },
        (err: FirestoreError) => handleError(err)
      );

      unsubscribeRefs.current[subscriptionKey] = unsubscribe;
      return unsubscribe;
    },
    [handleError, updateState]
  );

  const listenToCollection = useCallback(
    (
      collectionName: string,
      queryConstraints: QueryConstraint[] = []
    ): UnsubscribeFn => {
      updateState({ loading: true, error: null });

      if (unsubscribeRefs.current[collectionName]) {
        unsubscribeRefs.current[collectionName]();
      }

      const q = query(collection(db, collectionName), ...queryConstraints);
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const documents: FirestoreDocument[] = querySnapshot.docs.map(
            (doc: QueryDocumentSnapshot<DocumentData>) => ({
              id: doc.id,
              ...doc.data(),
            })
          );
          updateState({ collectionData: documents, loading: false });
        },
        (err: FirestoreError) => handleError(err)
      );

      unsubscribeRefs.current[collectionName] = unsubscribe;
      return unsubscribe;
    },
    [handleError, updateState]
  );

 const listenToCollectionWithQuery2 = useCallback(
   (
     collectionName: string,
     queryConstraints: QueryConstraint[] = []
   ): UnsubscribeFn => {
     updateState({ loading: true, error: null });

     const subscriptionKey = `${collectionName}-withQ`;
     if (unsubscribeRefs.current[subscriptionKey]) {
       unsubscribeRefs.current[subscriptionKey]();
     }

     const q = query(collection(db, collectionName), ...queryConstraints);
     const unsubscribe = onSnapshot(
       q,
       (querySnapshot: QuerySnapshot<DocumentData>) => {
         const documents: FirestoreDocument[] = querySnapshot.docs.map(
           (doc: QueryDocumentSnapshot<DocumentData>) => ({
             id: doc.id,
             ...doc.data(),
           })
         );
         updateState({ collectionDataWithQ: documents, loading: false });
       },
       (err: FirestoreError) => handleError(err)
     );

     unsubscribeRefs.current[subscriptionKey] = unsubscribe;
     return unsubscribe;
   },
   [handleError, updateState]
 );

  const listenToCollectionWithoutQuery = useCallback(
    (collectionName: string): UnsubscribeFn => {
      return listenToCollection(collectionName, []);
    },
    [listenToCollection]
  );

  const addDocument = useCallback(
    async (
      collectionName: string,
      userId: string,
      data: DocumentData
    ): Promise<ReturnType<typeof doc>> => {
      await waitForAuth();
      try {
        const docRef = doc(db, collectionName, userId);
        await setDoc(
          docRef,
          {
            ...data,
            createdBy: firebaseUser!.uid,
            createdAt: new Date(),
            email: user?.emailAddresses[0].emailAddress,
          },
          { merge: true }
        );
        return docRef;
      } catch (err) {
        throw handleError(err);
      }
    },
    [waitForAuth, firebaseUser, user?.emailAddresses, handleError]
  );

  const addCollection = useCallback(
    async (collectionName: string, data: DocumentData): Promise<string> => {
      await waitForAuth();
      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdBy: firebaseUser!.uid,
          createdAt: new Date(),
          email: user?.emailAddresses[0].emailAddress,
        });
        return docRef.id;
      } catch (err) {
        throw handleError(err);
      }
    },
    [waitForAuth, firebaseUser, user?.emailAddresses, handleError]
  );

  const updateDocument = useCallback(
    async (
      collectionName: string,
      documentId: string,
      data: Partial<DocumentData>
    ): Promise<void> => {
      await waitForAuth();
      try {
        await updateDoc(doc(db, collectionName, documentId), {
          ...data,
          updatedBy: firebaseUser!.uid,
          updatedAt: new Date(),
          email: user?.emailAddresses[0].emailAddress,
        });
      } catch (err) {
        throw handleError(err);
      }
    },
    [waitForAuth, firebaseUser, user?.emailAddresses, handleError]
  );

  const deleteDocument = useCallback(
    async (collectionName: string, documentId: string): Promise<void> => {
      await waitForAuth();
      try {
        await deleteDoc(doc(db, collectionName, documentId));
      } catch (err) {
        throw handleError(err);
      }
    },
    [waitForAuth, handleError]
  );

  const updateBalance = useCallback(
    async ({
      userId,
      amount,
      description,
      type,
      category,
      collectBalanceName,
    }: BalanceUpdateParams): Promise<{
      newBalance: number;
      historyEntry: BalanceHistoryEntry;
    }> => {
      await waitForAuth();
      try {
        const userRef = doc(db, collectBalanceName, userId);
        let userDoc = await getDoc(userRef);

        let currentBalance = 0;
        let existingBalanceHistory: BalanceHistoryEntry[] = [];

        if (!userDoc.exists()) {
          // Create a new user document if it doesn't exist
          await setDoc(userRef, {
            balance: 0,
            balanceHistory: [],
            createdAt: Timestamp.now(),
            createdBy: firebaseUser!.uid,
            email: user?.emailAddresses[0].emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName,
            lastSignInAt: user?.lastSignInAt,
          });
          userDoc = await getDoc(userRef);
        } else {
          currentBalance = userDoc.data()?.balance ?? 0;
          existingBalanceHistory = userDoc.data()?.balanceHistory ?? [];
        }
       
        const newBalance =
          type === "credit"
            ? Number(currentBalance) + Number(amount)
            : Number(currentBalance) - Number(amount);

        const historyEntry: BalanceHistoryEntry = {
          previousBalance: currentBalance,
          newBalance: Number(newBalance.toFixed(2)),
          amount: Number(amount),
          type,
          description,
          category,
          createdAt: Timestamp.now(),
          createdBy: firebaseUser!.uid,
        };

        await setDoc(
          userRef,
          {
            balance: newBalance,
            lastUpdated: Timestamp.now(),
            lastUpdatedBy: firebaseUser!.uid,
            balanceHistory: [...existingBalanceHistory, historyEntry],
            email: user?.emailAddresses[0].emailAddress,
          },
          { merge: true }
        );

        updateState({ loading: false });
        return { newBalance, historyEntry };
      } catch (err) {
        throw handleError(err);
      }
    },
    [
      firebaseUser,
      handleError,
      updateState,
      user?.emailAddresses,
      user?.firstName,
      user?.lastName,
      user?.lastSignInAt,
      waitForAuth,
    ]
  );

  useEffect(() => {
    const unsubscribeRefsCurrent = unsubscribeRefs.current;
    return () => {
      Object.values(unsubscribeRefsCurrent).forEach(
        (unsubscribe: UnsubscribeFn) => unsubscribe()
      );
    };
  }, []);

  return useMemo(
    () => ({
      ...state,
      updateBalance,
      listenToDocument,
      listenToDocument1,
      listenToCollection,
      addDocument,
      addCollection,
      updateDocument,
      deleteDocument,
      listenToCollectionWithoutQuery,
      listenToCollectionWithQuery2,
    }),
    [
      state,
      updateBalance,
      listenToDocument,
      listenToDocument1,
      listenToCollection,
      addDocument,
      addCollection,
      updateDocument,
      deleteDocument,
      listenToCollectionWithoutQuery,
      listenToCollectionWithQuery2,
    ]
  );
}
