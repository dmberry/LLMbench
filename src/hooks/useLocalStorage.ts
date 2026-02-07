"use client";

import { useState, useCallback, useEffect } from "react";
import type { SavedComparison } from "@/types";

const STORAGE_KEY = "llmbench-comparisons";

function loadComparisons(): SavedComparison[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore
  }
  return [];
}

function persistComparisons(comparisons: SavedComparison[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisons));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

/**
 * Hook for saving and loading comparisons from localStorage
 */
export function useLocalStorage() {
  // Start empty to match server render, then hydrate from localStorage
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);

  useEffect(() => {
    setComparisons(loadComparisons());
  }, []);

  const saveComparison = useCallback(
    (comparison: SavedComparison) => {
      setComparisons((prev) => {
        const existing = prev.findIndex((c) => c.id === comparison.id);
        let updated: SavedComparison[];
        if (existing >= 0) {
          updated = [...prev];
          updated[existing] = {
            ...comparison,
            updatedAt: new Date().toISOString(),
          };
        } else {
          updated = [comparison, ...prev];
        }
        persistComparisons(updated);
        return updated;
      });
    },
    []
  );

  const deleteComparison = useCallback((id: string) => {
    setComparisons((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      persistComparisons(updated);
      return updated;
    });
  }, []);

  const getComparison = useCallback(
    (id: string): SavedComparison | undefined => {
      return comparisons.find((c) => c.id === id);
    },
    [comparisons]
  );

  const refreshComparisons = useCallback(() => {
    setComparisons(loadComparisons());
  }, []);

  return {
    comparisons,
    saveComparison,
    deleteComparison,
    getComparison,
    refreshComparisons,
  };
}
