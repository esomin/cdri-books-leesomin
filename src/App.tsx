import { useState, useCallback } from 'react';
import { Header, type TabType } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { DetailSearchPopover } from './components/DetailSearchPopover';
import { BookList } from './components/BookList';
import { BookmarksView } from './components/BookmarksView';
import { useBookSearch } from './hooks/useBookSearch';
import { useBookmarks } from './hooks/useBookmarks';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import type { SearchTarget } from './types/book';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('search');
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [globalResetTrigger, setGlobalResetTrigger] = useState(0);
  const [detailResetTrigger, setDetailResetTrigger] = useState(0);

  const {
    books,
    totalCount,
    isLoading,
    isEnd,
    executeSearch,
    loadMore,
  } = useBookSearch();

  // 무한 스크롤 센서 옵저버 연동
  const sentinelRef = useIntersectionObserver(
    () => {
      if (!isEnd && !isLoading) {
        loadMore();
      }
    },
    { enabled: currentTab === 'search' && !isEnd && books.length > 0 }
  );

  const handleGlobalSearch = useCallback(
    (keyword: string) => {
      setIsDetailOpen(false);
      setDetailResetTrigger((c) => c + 1);
      executeSearch(keyword);
    },
    [executeSearch]
  );

  const handleDetailSearch = useCallback(
    (target: SearchTarget, query: string) => {
      setGlobalResetTrigger((c) => c + 1);
      setIsDetailOpen(false);
      executeSearch(query, target);
    },
    [executeSearch]
  );

  return (
    <div className="min-h-screen bg-white text-text-primary flex flex-col">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        bookmarkCount={bookmarks.length}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {currentTab === 'search' ? (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-title1 font-bold text-black mb-4">도서 검색</h2>
              <SearchBar
                onSearch={handleGlobalSearch}
                resetTrigger={globalResetTrigger}
                rightAction={
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDetailOpen((prev) => !prev)}
                      className="h-12 px-4 border border-gray-300 rounded-[var(--radius-button)] text-body2 text-text-subtitle hover:text-text-primary hover:border-gray-400 transition-colors cursor-pointer bg-white"
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
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              sentinelRef={sentinelRef}
            />
          </div>
        ) : (
          <BookmarksView
            bookmarks={bookmarks}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </main>
    </div>
  );
}

export default App;
