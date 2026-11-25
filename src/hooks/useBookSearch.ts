import { useState, useCallback, useRef } from 'react';
import { searchBooks } from '../api/bookApi';
import type { BookItem, SearchCondition } from '../types/book';

export function useBookSearch() {
  const [query, setQuery] = useState('');
  const [condition, setCondition] = useState<SearchCondition | null>(null);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 실행 중인 검색 조건을 추적하기 위한 ref
  const activeParamsRef = useRef<{ query: string; target?: SearchCondition['target'] }>({
    query: '',
  });

  // 새 검색어 또는 상세 조건으로 첫 페이지 검색 실행
  const executeSearch = useCallback(
    async (newQuery: string, searchTarget?: SearchCondition['target']) => {
      const trimmed = newQuery.trim();
      if (!trimmed) {
        setQuery('');
        setBooks([]);
        setTotalCount(0);
        setPage(1);
        setIsEnd(true);
        return;
      }

      setQuery(trimmed);
      setPage(1);
      setIsLoading(true);
      setError(null);
      activeParamsRef.current = { query: trimmed, target: searchTarget };

      try {
        const response = await searchBooks({
          query: trimmed,
          page: 1,
          size: 10,
          target: searchTarget,
        });

        setBooks(response.documents);
        setTotalCount(response.meta.total_count);
        setIsEnd(response.meta.is_end);
      } catch (err) {
        setError(err instanceof Error ? err.message : '도서 검색 중 오류가 발생했습니다.');
        setBooks([]);
        setTotalCount(0);
        setIsEnd(true);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 무한 스크롤을 통한 다음 페이지 로드
  const loadMore = useCallback(async () => {
    if (isLoading || isEnd || !activeParamsRef.current.query) {
      return;
    }

    const nextPage = page + 1;
    setIsLoading(true);

    try {
      const response = await searchBooks({
        query: activeParamsRef.current.query,
        page: nextPage,
        size: 10,
        target: activeParamsRef.current.target,
      });

      setBooks((prev) => [...prev, ...response.documents]);
      setPage(nextPage);
      setIsEnd(response.meta.is_end);
    } catch (err) {
      setError(err instanceof Error ? err.message : '추가 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isEnd, page]);

  return {
    query,
    condition,
    setCondition,
    books,
    totalCount,
    isLoading,
    isEnd,
    error,
    executeSearch,
    loadMore,
  };
}

