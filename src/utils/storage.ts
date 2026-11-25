/**
 * LocalStorage 안전 래퍼 유틸리티
 */
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'certicos_recent_searches',
  BOOKMARKS: 'certicos_bookmarked_books',
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`[storage] Error reading key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[storage] Error saving key "${key}":`, error);
    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[storage] Error removing key "${key}":`, error);
    return false;
  }
}

