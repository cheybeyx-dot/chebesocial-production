"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with null to handle SSR
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    // Set initial value on mount to prevent hydration mismatch
    setMatches(window.matchMedia(query).matches);

    // Create the media query list
    const media = window.matchMedia(query);

    // Define the listener function
    const listener = () => setMatches(media.matches);

    // Add the listener
    media.addEventListener("change", listener);

    // Clean up
    return () => media.removeEventListener("change", listener);
  }, [query]); // Only depend on query

  // Return false during SSR, then the actual value once mounted
  return matches ?? false;
}
