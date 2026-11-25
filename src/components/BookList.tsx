import React from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import { BookItemCard } from './BookItemCard';
import { Button } from './ui/Button';
import { getBookKey } from '../hooks/useBookmarks';
import type { BookItem } from '../types/book';

interface BookListProps {
  books: BookItem[];
  totalCount: number;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  isBookmarked: (isbn: string) => boolean;
  onToggleBookmark: (book: BookItem) => void;
  countLabel?: string;
  emptyMessage?: string;
  sentinelRef?: React.RefObject<HTMLDivElement | null>;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  totalCount,
  isLoading,
  error = null,
  onRetry,
  isBookmarked,
  onToggleBookmark,
  countLabel = '도서 검색 결과',
  emptyMessage = '검색된 결과가 없습니다.',
  sentinelRef,
}) => {
  return (
    <section className="w-full">
      <div className="mb-4 text-body2 text-text-primary flex items-center gap-1.5">
        <span>{countLabel}</span>
        <span>
          총 <strong className="text-primary font-bold">{totalCount.toLocaleString()}</strong>건
        </span>
      </div>

      {error && !isLoading && books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-light-gray flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red" />
          </div>
          <p className="text-body2 text-text-secondary mb-4">{error}</p>
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="rounded-[var(--radius-button)] text-[12px] font-medium px-3 py-1.5 h-8"
            >
              다시 시도
            </Button>
          )}
        </div>
      )}

      {!error && !isLoading && books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-light-gray flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-text-subtitle" />
          </div>
          <p className="text-body2 text-text-subtitle">{emptyMessage}</p>
        </div>
      )}

      {books.length > 0 && (
        <div className="border-t border-gray">
          {books.map((book) => {
            const bookKey = getBookKey(book);
            return (
              <BookItemCard
                key={bookKey}
                book={book}
                isBookmarked={isBookmarked(bookKey)}
                onToggleBookmark={onToggleBookmark}
              />
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="py-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {sentinelRef && <div ref={sentinelRef} className="h-4" />}
    </section>
  );
};
