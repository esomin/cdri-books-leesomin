import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookmarks, BOOKMARKS_STORAGE_KEY } from './useBookmarks';
import type { BookItem } from '../types/book';

const mockBook: BookItem = {
  title: '클린 코드',
  contents: '애자일 소프트웨어 장인 정신',
  url: 'https://example.com/clean-code',
  isbn: '9788966260959',
  datetime: '2013-12-24T00:00:00.000+09:00',
  authors: ['로버트 C. 마틴'],
  publisher: '인사이트',
  translators: ['박재호', '이해영'],
  price: 33000,
  sale_price: 29700,
  thumbnail: 'https://example.com/thumb.jpg',
  status: '정상판매',
};

describe('useBookmarks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('초기 상태는 localStorage가 비어있을 때 빈 배열이어야 한다', () => {
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([]);
    expect(result.current.isBookmarked(mockBook.isbn)).toBe(false);
  });

  it('toggleBookmark 호출 시 도서 스냅샷과 bookmarkedAt을 저장하고 localStorage에 영속화한다', () => {
    const { result } = renderHook(() => useBookmarks());

    act(() => {
      result.current.toggleBookmark(mockBook);
    });

    expect(result.current.bookmarks).toHaveLength(1);
    expect(result.current.bookmarks[0].isbn).toBe(mockBook.isbn);
    expect(result.current.bookmarks[0].bookmarkedAt).toBeDefined();
    expect(result.current.isBookmarked(mockBook.isbn)).toBe(true);

    const stored = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('클린 코드');
  });

  it('이미 찜한 도서에 대해 toggleBookmark를 다시 호출하면 목록에서 제거된다', () => {
    const { result } = renderHook(() => useBookmarks());

    act(() => {
      result.current.toggleBookmark(mockBook);
    });
    expect(result.current.isBookmarked(mockBook.isbn)).toBe(true);

    act(() => {
      result.current.toggleBookmark(mockBook);
    });
    expect(result.current.bookmarks).toEqual([]);
    expect(result.current.isBookmarked(mockBook.isbn)).toBe(false);
  });
});

