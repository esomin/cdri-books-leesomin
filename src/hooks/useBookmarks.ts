import { useState, useCallback, useEffect } from 'react';
import type { BookItem } from '../types/book';

export const BOOKMARKS_STORAGE_KEY = 'certicos_bookmarked_books';

function loadBookmarks(): BookItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBookmarks(items: BookItem[]): void {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota or serialization errors
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookItem[]>(() => loadBookmarks());

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (isbn: string) => bookmarks.some((item) => item.isbn === isbn),
    [bookmarks]
  );

  const toggleBookmark = useCallback((book: BookItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((item) => item.isbn === book.isbn);
      if (exists) {
        return prev.filter((item) => item.isbn !== book.isbn);
      }
      const snapshot: BookItem = {
        ...book,
        bookmarkedAt: new Date().toISOString(),
      };
      return [snapshot, ...prev];
    });
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
  };
}

