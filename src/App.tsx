import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { DetailSearchPopover } from './components/DetailSearchPopover';
import { BookList } from './components/BookList';
import { BookmarksView } from './components/BookmarksView';
import { useBookSearch } from './hooks/useBookSearch';
import { useBookmarks } from './hooks/useBookmarks';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import type { SearchTarget } from './types/book';

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isSearchRoute = location.pathname.startsWith('/search');
  const urlQuery = isSearchRoute ? (searchParams.get('q') ?? '') : '';
  const urlTarget = isSearchRoute
    ? ((searchParams.get('target') as SearchTarget | null) ?? undefined)
    : undefined;

  const [lastSearchUrl, setLastSearchUrl] = useState('/search');
  const currentSearchUrl = `${location.pathname}${location.search}`;
  if (isSearchRoute && currentSearchUrl !== lastSearchUrl) {
    setLastSearchUrl(currentSearchUrl);
  }
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [globalResetTrigger, setGlobalResetTrigger] = useState(0);
  const [detailResetTrigger, setDetailResetTrigger] = useState(0);

  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();

  const {
    books,
    totalCount,
    isLoading,
    isEnd,
    error,
    executeSearch,
    loadMore,
    refetch,
  } = useBookSearch();

  // /search 경로의 쿼리 파라미터 변경 시 검색 실행
  useEffect(() => {
    if (isSearchRoute) {
      executeSearch(urlQuery, urlTarget);
    }
  }, [isSearchRoute, urlQuery, urlTarget, executeSearch]);

  // 무한 스크롤 센서 옵저버 연동
  const sentinelRef = useIntersectionObserver(
    () => {
      if (!isEnd && !isLoading) {
        loadMore();
      }
    },
    { enabled: isSearchRoute && !isEnd && books.length > 0 }
  );

  const handleGlobalSearch = useCallback(
    (keyword: string) => {
      setIsDetailOpen(false);
      setDetailResetTrigger((c) => c + 1);
      const trimmed = keyword.trim();
      navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    },
    [navigate]
  );

  const handleDetailSearch = useCallback(
    (target: SearchTarget, query: string) => {
      setGlobalResetTrigger((c) => c + 1);
      setIsDetailOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}&target=${target}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-white text-text-primary flex flex-col">
      <Header bookmarkCount={bookmarks.length} lastSearchUrl={lastSearchUrl} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route
            path="/search"
            element={
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-title1 font-bold text-black mb-4">도서 검색</h2>
                  <SearchBar
                    initialKeyword={urlTarget ? '' : urlQuery}
                    onSearch={handleGlobalSearch}
                    resetTrigger={globalResetTrigger}
                    rightAction={
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDetailOpen((prev) => !prev)}
                          className="h-12 px-4 border border-gray rounded-[var(--radius-button)] text-body2 text-text-subtitle hover:text-text-primary hover:border-text-subtitle transition-colors cursor-pointer bg-white"
                        >
                          상세검색
                        </button>
                        <DetailSearchPopover
                          isOpen={isDetailOpen}
                          onClose={() => setIsDetailOpen(false)}
                          onSearch={handleDetailSearch}
                          resetTrigger={detailResetTrigger}
                        />
                      </div>
                    }
                  />
                </div>

                <BookList
                  books={books}
                  totalCount={totalCount}
                  isLoading={isLoading}
                  error={error}
                  onRetry={() => void refetch()}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                  sentinelRef={sentinelRef}
                />
              </div>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <BookmarksView
                bookmarks={bookmarks}
                isBookmarked={isBookmarked}
                onToggleBookmark={toggleBookmark}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
