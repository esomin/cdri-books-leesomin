import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { BookmarkButton } from './BookmarkButton';
import { formatCurrency } from '../utils/format';
import type { BookItem } from '../types/book';

interface BookItemCollapsedProps {
  book: BookItem;
  authorsText: string;
  displayPrice: number;
  isBookmarked: boolean;
  isExpanded: boolean;
  onToggleBookmark: () => void;
  onPurchase: (e: React.MouseEvent) => void;
  onToggleExpand: (e: React.MouseEvent) => void;
}

export const BookItemCollapsed: React.FC<BookItemCollapsedProps> = ({
  book,
  authorsText,
  displayPrice,
  isBookmarked,
  isExpanded,
  onToggleBookmark,
  onPurchase,
  onToggleExpand,
}) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded
          ? 'max-h-0 opacity-0 pointer-events-none'
          : 'max-h-24 opacity-100'
      }`}
    >
      <div className="flex items-center justify-between gap-4 select-none py-0.5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative w-14 h-20 bg-light-gray rounded-[4px] border border-black/8 shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
            {book.thumbnail ? (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-[9px] text-text-subtitle">No Cover</span>
            )}
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={onToggleBookmark}
              size="sm"
            />
          </div>

          <div className="min-w-0 flex items-baseline gap-2">
            <h3 className="text-[13px] font-bold text-text-primary truncate">
              {book.title}
            </h3>
            <span className="text-[12px] text-text-secondary truncate shrink-0">
              {authorsText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[15px] font-bold text-text-primary tracking-tight">
            {formatCurrency(displayPrice)}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onPurchase}
            className="bg-primary/10 text-primary hover:bg-primary/15 text-[13px] font-semibold px-3.5 py-2 h-8 rounded-[6px]"
          >
            구매하기
          </Button>

          <button
            type="button"
            onClick={onToggleExpand}
            className="flex items-center gap-1 bg-light-gray hover:bg-gray/40 text-[12px] text-text-secondary hover:text-text-primary py-1.5 px-2.5 rounded-[6px] transition-colors cursor-pointer"
          >
            <span>상세보기</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-subtitle" />
          </button>
        </div>
      </div>
    </div>
  );
};

