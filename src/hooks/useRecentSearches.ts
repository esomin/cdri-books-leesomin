import { useState, useCallback, useEffect } from 'react';

export interface RecentSearchItem {
  id: string;
  keyword: string;
  timestamp: number;
}

export const RECENT_SEARCHES_STORAGE_KEY = 'certicos_recent_searches';
export const MAX_RECENT_SEARCHES = 8;

function loadRecentSearches(): RecentSearchItem[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(items: RecentSearchItem[]): void {
  try {
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota or serialization errors
  }
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() =>
    loadRecentSearches(),
  );

  useEffect(() => {
    saveRecentSearches(recentSearches);
  }, [recentSearches]);

  const addSearch = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.keyword !== trimmed);
      const newItem: RecentSearchItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        keyword: trimmed,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  }, []);

  const removeSearch = useCallback((id: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}

