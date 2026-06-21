"use client";

import { useEffect, useState, useCallback } from "react";

export function useFetch<T>(url: string, refreshMs?: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData((await res.json()) as T);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    load();
    if (refreshMs) {
      const id = setInterval(() => load(true), refreshMs);
      return () => clearInterval(id);
    }
  }, [load, refreshMs]);

  return { data, error, loading, reload: () => load() };
}
