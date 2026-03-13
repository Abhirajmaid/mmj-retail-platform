"use client";

import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStored(value);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
          // ignore
        }
      }
    },
    [key]
  );

  return [stored, setValue];
}