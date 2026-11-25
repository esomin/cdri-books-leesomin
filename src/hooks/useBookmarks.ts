import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { BookItem } from '../types/book';

export const BOOKMARKS_STORAGE_KEY = 'certicos_bookmarked_books';

export function getBookKey(book: Pick<BookItem, 'isbn' | 'url'>): string {
  return book.isbn || book.url;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<BookItem[]>(
    BOOKMARKS_STORAGE_KEY,
    []
  );

  const bookmarkedKeySet = useMemo(
    () => new Set(bookmarks.map((item) => getBookKey(item))),
    [bookmarks]
  );

  const isBookmarked = useCallback(
    (key: string) => bookmarkedKeySet.has(key),
    [bookmarkedKeySet]
  );

  const toggleBookmark = useCallback(
    (book: BookItem) => {
      const targetKey = getBookKey(book);
      setBookmarks((prev) => {
        const exists = prev.some((item) => getBookKey(item) === targetKey);
        if (exists) {
          return prev.filter((item) => getBookKey(item) !== targetKey);
        }
        const snapshot: BookItem = {
          ...book,
          bookmarkedAt: new Date().toISOString(),
        };
        return [snapshot, ...prev];
      });
    },
    [setBookmarks]
  );

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
  };
}
