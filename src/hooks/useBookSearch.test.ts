import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBookSearch } from '../hooks/useBookSearch';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useBookSearch 무한 스크롤 연동', () => {
  it('executeSearch 후 loadMore 호출 시 다음 페이지 데이터가 추가 누적되어야 한다', async () => {
    const { result } = renderHook(() => useBookSearch(), {
      wrapper: createWrapper(),
    });

    // 1페이지 검색 실행
    act(() => {
      result.current.executeSearch('리액트');
    });

    await waitFor(() => {
      expect(result.current.books.length).toBe(10);
    });
    const firstPageFirstBook = result.current.books[0].title;

    // 2페이지 loadMore 실행 (무한 스크롤 트리거 시점)
    act(() => {
      result.current.loadMore();
    });

    // 10권 + 10권 = 총 20권 누적 확인
    await waitFor(() => {
      expect(result.current.books.length).toBe(20);
    });
    expect(result.current.books[0].title).toBe(firstPageFirstBook);
  });
});
