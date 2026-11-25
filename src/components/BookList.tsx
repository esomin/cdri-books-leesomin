import React from 'react';
import { BookOpen } from 'lucide-react';
import type { BookItem } from '../types/book';
import { BookItemCard } from './BookItemCard';

interface BookListProps {
  books: BookItem[];
  totalCount: number;
  isLoading: boolean;
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
  isBookmarked,
  onToggleBookmark,
  countLabel = '도서 검색 결과',
  emptyMessage = '검색된 결과가 없습니다.',
  sentinelRef,
}) => {
  return (
    <section className="w-full">
      {/* 결과 헤더 카운트 */}
      <div className="py-4 border-b border-gray">
        <h2 className="text-body2 font-bold text-text-primary">
          {countLabel} 총 <span className="text-primary">{totalCount.toLocaleString('ko-KR')}</span>건
        </h2>
      </div>

      {/* 도서 목록이 비어있는 경우 */}
      {books.length === 0 && !isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-light-gray flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-text-subtitle" />
          </div>
          <p className="text-body2 text-text-subtitle">{emptyMessage}</p>
        </div>
      )}

      {/* 도서 아이템 카드 리스트 */}
      <div className="flex flex-col">
        {books.map((book, idx) => (
          <BookItemCard
            key={`${book.isbn || book.url}-${idx}`}
            book={book}
            isBookmarked={isBookmarked(book.isbn)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>

      {/* 로딩 표시 */}
      {isLoading && (
        <div className="py-8 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 무한 스크롤 감지 센서 */}
      {sentinelRef && <div ref={sentinelRef} className="h-4 w-full" />}
    </section>
  );
};

