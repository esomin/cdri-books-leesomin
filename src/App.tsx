import { useState, useCallback } from 'react';
import { Header, type TabType } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { BookList } from './components/BookList';
import { useBookSearch } from './hooks/useBookSearch';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import type { BookItem } from './types/book';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('search');
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, BookItem>>({});

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

  const isBookmarked = useCallback(
    (isbn: string) => {
      return Boolean(bookmarkedMap[isbn]);
    },
    [bookmarkedMap]
  );

  const handleToggleBookmark = useCallback((book: BookItem) => {
    setBookmarkedMap((prev) => {
      const next = { ...prev };
      if (next[book.isbn]) {
        delete next[book.isbn];
      } else {
        next[book.isbn] = {
          ...book,
          bookmarkedAt: new Date().toISOString(),
        };
      }
      return next;
    });
  }, []);

  const bookmarkList = Object.values(bookmarkedMap);

  return (
    <div className="min-h-screen bg-white text-text-primary flex flex-col">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        bookmarkCount={bookmarkList.length}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {currentTab === 'search' ? (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-title1 font-bold text-black mb-4">도서 검색</h2>
              <SearchBar onSearch={(keyword) => executeSearch(keyword)} />
            </div>

            <BookList
              books={books}
              totalCount={totalCount}
              isLoading={isLoading}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
              sentinelRef={sentinelRef}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="text-title1 font-bold text-black">내가 찜한 책</h2>
            <BookList
              books={bookmarkList}
              totalCount={bookmarkList.length}
              isLoading={false}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
              countLabel="찜한 책"
              emptyMessage="찜한 책이 없습니다."
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
