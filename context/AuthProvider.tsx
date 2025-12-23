"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  type User,
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@/lib/firebase/firebaseConfig";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  firebaseUser: User | null;
  retryAuthentication: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const signInWithFirebase = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken({ template: "integration_firebase" });
        if (!token) {
          toast("Authentication Error",{
            description: "Error loging in",
            className: "bg-red-500 text-white",
          });
          return;
        }
        const userCredential = await signInWithCustomToken(auth, token);
        setFirebaseUser(userCredential.user);
        setIsAuthenticated(true);
        setRetryCount(0);
      } catch (err) {
        console.error("Error signing in to Firebase:", err);
        if (err instanceof Error) {
          if (err.message === "Failed to get Firebase token from Clerk") {
            setError(
              new Error(
                "Authentication failed. Please try again or contact support if the issue persists."
              )
            );
          } else {
            setError(err);
          }
        } else {
          setError(
            new Error("An unknown error occurred during authentication")
          );
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }, [getToken]);

    const retryAuthentication = useCallback(async () => {
      if (retryCount < 3) {
        setRetryCount((prevCount) => prevCount + 1);
        await signInWithFirebase();
      } else {
        setError(
          new Error(
            "Maximum retry attempts reached. Please try again later or contact support."
          )
        );
      }
    }, [signInWithFirebase, retryCount]);

    const handleSignOut = useCallback(async () => {
      setLoading(true);
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error("Error signing out from Firebase:", err);
      } finally {
        setIsAuthenticated(false);
        setFirebaseUser(null);
        setLoading(false);
        setError(null);
      }
    }, []);

    useEffect(() => {
      if (isLoaded) {
        if (isSignedIn) {
          signInWithFirebase();
        } else {
          handleSignOut();
        }
      }
    }, [isLoaded, isSignedIn, signInWithFirebase, handleSignOut]);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setFirebaseUser(user);
        setIsAuthenticated(!!user);
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    const contextValue = useMemo(
      () => ({
        isAuthenticated,
        loading,
        error,
        firebaseUser,
        retryAuthentication,
      }),
      [isAuthenticated, loading, error, firebaseUser, retryAuthentication]
    );

    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  }
);

AuthProvider.displayName = "AuthProvider";

export const useUserData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserData must be used within an AuthProvider");
  }
  return context;
};
