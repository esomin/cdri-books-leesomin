import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';
import { BookmarkButton } from './BookmarkButton';
import { formatCurrency } from '../utils/format';
import type { BookItem } from '../types/book';

interface BookItemExpandedProps {
  book: BookItem;
  authorsText: string;
  hasSale: boolean;
  isBookmarked: boolean;
  isExpanded: boolean;
  onToggleBookmark: () => void;
  onPurchase: (e: React.MouseEvent) => void;
  onToggleExpand: (e: React.MouseEvent) => void;
}

export const BookItemExpanded: React.FC<BookItemExpandedProps> = ({
  book,
  authorsText,
  hasSale,
  isBookmarked,
  isExpanded,
  onToggleBookmark,
  onPurchase,
  onToggleExpand,
}) => {
  return (
    <div
      className={`grid transition-all duration-350 ease-in-out ${
        isExpanded
          ? 'grid-rows-[1fr] opacity-100 mt-1'
          : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-5 py-3">
          <div className="relative w-32 h-44 bg-light-gray rounded-[var(--radius-button)] shrink-0 overflow-hidden shadow-xs flex items-center justify-center">
            {book.thumbnail ? (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[11px] text-text-subtitle">No Cover</span>
            )}
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={onToggleBookmark}
              size="md"
              className="hover:scale-110 transition-transform"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <h3 className="text-[17px] font-bold text-text-primary leading-snug">
                      {book.title}
                    </h3>
                    <span className="text-[12px] text-text-subtitle">
                      {authorsText}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="flex items-center gap-0.5 bg-transparent hover:text-text-primary text-[12px] text-text-secondary py-1 px-1 transition-colors cursor-pointer shrink-0"
                >
                  <span>상세보기</span>
                  <ChevronUp className="w-3.5 h-3.5 text-text-subtitle" />
                </button>
              </div>

              <div className="mt-3">
                <h4 className="text-[12px] font-bold text-text-primary mb-1.5">
                  책 소개
                </h4>
                <p className="text-[12.5px] text-text-secondary leading-relaxed line-clamp-4">
                  {book.contents
                    ? `${book.contents}...`
                    : '도서 소개 정보가 제공되지 않습니다.'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-end gap-2.5 self-end w-full max-w-xs">
              <div className="flex flex-col items-end gap-0.5">
                {hasSale ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-text-subtitle">원가</span>
                      <span className="text-[12px] text-text-subtitle line-through">
                        {formatCurrency(book.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-text-secondary font-medium">
                        할인가
                      </span>
                      <span className="text-[16px] font-bold text-text-primary tracking-tight">
                        {formatCurrency(book.sale_price)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-secondary font-medium">
                      정가
                    </span>
                    <span className="text-[16px] font-bold text-text-primary tracking-tight">
                      {formatCurrency(book.price)}
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="default"
                size="default"
                onClick={onPurchase}
                className="w-44 bg-primary text-white text-[14px] font-semibold py-2.5 h-10 rounded-[var(--radius-button)] shadow-xs"
              >
                구매하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

