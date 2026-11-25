import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface RecentSearchItem {
  id: string;
  keyword: string;
  timestamp: number;
}

export const RECENT_SEARCHES_STORAGE_KEY = 'certicos_recent_searches';
export const MAX_RECENT_SEARCHES = 8;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearchItem[]>(
    RECENT_SEARCHES_STORAGE_KEY,
    []
  );

  const addSearch = useCallback(
    (keyword: string) => {
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
    },
    [setRecentSearches]
  );

  const removeSearch = useCallback(
    (id: string) => {
      setRecentSearches((prev) => prev.filter((item) => item.id !== id));
    },
    [setRecentSearches]
  );

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}
