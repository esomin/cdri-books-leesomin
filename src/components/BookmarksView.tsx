import React, { useState } from 'react';
import { BookList } from './BookList';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { BookItem } from '../types/book';

const PAGE_SIZE = 10;

interface BookmarksViewProps {
  bookmarks: BookItem[];
  isBookmarked: (isbn: string) => boolean;
  onToggleBookmark: (book: BookItem) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const hasMore = visibleCount < bookmarks.length;
  const visibleBooks = bookmarks.slice(0, visibleCount);

  const sentinelRef = useIntersectionObserver(
    () => {
      if (hasMore) {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, bookmarks.length));
      }
    },
    { enabled: hasMore }
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-title1 font-bold text-black">내가 찜한 책</h2>
      <BookList
        books={visibleBooks}
        totalCount={bookmarks.length}
        isLoading={false}
        isBookmarked={isBookmarked}
        onToggleBookmark={onToggleBookmark}
        sentinelRef={hasMore ? sentinelRef : undefined}
        countLabel="찜한 책"
        emptyMessage="찜한 책이 없습니다."
      />
    </div>
  );
};

