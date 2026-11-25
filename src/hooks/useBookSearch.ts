import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchBooks } from '../api/bookApi';
import type { BookItem, SearchCondition } from '../types/book';

interface ActiveSearchParams {
  query: string;
  target?: SearchCondition['target'];
}

export function useBookSearch() {
  const [searchParams, setSearchParams] = useState<ActiveSearchParams>({
    query: '',
  });

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['books', searchParams.query, searchParams.target],
    queryFn: ({ pageParam }) =>
      searchBooks({
        query: searchParams.query,
        page: pageParam,
        size: 10,
        target: searchParams.target,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.meta.is_end ? undefined : allPages.length + 1,
    enabled: Boolean(searchParams.query),
  });

  const executeSearch = useCallback(
    (newQuery: string, searchTarget?: SearchCondition['target']) => {
      const trimmed = newQuery.trim();
      setSearchParams({
        query: trimmed,
        target: trimmed ? searchTarget : undefined,
      });
    },
    []
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const books: BookItem[] = useMemo(
    () => data?.pages.flatMap((page) => page.documents) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.meta.total_count ?? 0;
  const isEnd = searchParams.query ? !hasNextPage : false;
  const isLoading = isFetching || isFetchingNextPage;
  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? '도서 검색 중 오류가 발생했습니다.'
        : null;

  return {
    query: searchParams.query,
    books,
    totalCount,
    isLoading,
    isEnd,
    error: errorMessage,
    executeSearch,
    loadMore,
    refetch,
  };
}
