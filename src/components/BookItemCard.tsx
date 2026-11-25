import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import type { BookItem } from '../types/book';
import { formatCurrency, hasValidSalePrice } from '../utils/format';
import { Button } from './ui/Button';

interface BookItemCardProps {
  book: BookItem;
  isBookmarked: boolean;
  onToggleBookmark: (book: BookItem) => void;
}

export const BookItemCard: React.FC<BookItemCardProps> = ({
  book,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const authorsText = book.authors.length > 0 ? book.authors.join(', ') : '저자 미상';
  const hasSale = hasValidSalePrice(book.price, book.sale_price);
  const displayPrice = hasSale ? book.sale_price : book.price;

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.url) {
      window.open(book.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(book);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <article className="border-b border-gray py-3.5 book-item-visibility transition-colors">
      {/* 
        [1. 축소 상태 (간략히 보기 행)]
        - 전체 폰트 크기를 더 콤팩트하고 세련되게 축소 (제목: 13~14px, 저자: 12px, 가격: 15px)
      */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded
            ? 'max-h-0 opacity-0 pointer-events-none'
            : 'max-h-24 opacity-100'
        }`}
      >
        <div
          className="flex items-center justify-between gap-4 cursor-pointer select-none py-0.5"
          onClick={toggleExpand}
        >
          {/* 좌측: 도서 썸네일 & 제목 / 저자 */}
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
            </div>

            <div className="min-w-0 flex items-baseline gap-2">
              <h3 className="text-[13px] font-bold text-text-primary truncate hover:text-primary transition-colors">
                {book.title}
              </h3>
              <span className="text-[12px] text-text-secondary truncate shrink-0">
                {authorsText}
              </span>
            </div>
          </div>

          {/* 우측: 판매가 + 구매하기 버튼 + 상세보기 v */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[15px] font-bold text-text-primary tracking-tight">
              {formatCurrency(displayPrice)}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePurchase}
              className="bg-primary/10 text-primary hover:bg-primary/15 text-[13px] font-semibold px-3.5 py-2 h-8 rounded-[6px]"
            >
              구매하기
            </Button>

            <button
              type="button"
              onClick={toggleExpand}
              className="flex items-center gap-1 bg-light-gray hover:bg-gray/40 text-[12px] text-text-secondary hover:text-text-primary py-1.5 px-2.5 rounded-[6px] transition-colors cursor-pointer"
            >
              <span>상세보기</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-subtitle" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        [2. 확장 상태 (상세보기)]
        - 확장 시에도 과하게 크지 않은 적당한 크기 (타이틀: 17px, 책 소개: 13px, 가격: 15px)
      */}
      <div
        ref={contentRef}
        className={`grid transition-all duration-350 ease-in-out ${
          isExpanded
            ? 'grid-rows-[1fr] opacity-100 mt-1'
            : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 pt-1 pb-1">
            {/* 좌측: 큰 도서 표지 + 찜하기 하트 오버레이 */}
            <div className="relative w-40 h-58 bg-light-gray rounded-[var(--radius-button)] shrink-0 overflow-hidden flex items-center justify-center shadow-md self-start">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[12px] text-text-subtitle">이미지 없음</span>
              )}
              <button
                type="button"
                onClick={handleBookmarkClick}
                aria-label={isBookmarked ? '찜 해제' : '찜하기'}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-all shadow-xs cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isBookmarked
                      ? 'fill-red text-red stroke-none'
                      : 'stroke-gray text-transparent hover:stroke-text-subtitle'
                  }`}
                />
              </button>
            </div>

            {/* 중앙 & 우측: 책 정보 + 상단 상세보기 ^ + 하단 구매/가격 */}
            <div className="flex-1 flex flex-col justify-between min-w-0 min-h-58">
              {/* 상단: 도서명/저자명 (좌측) & 상세보기 ^ 닫기 버튼 (우측 상단) */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-baseline flex-wrap gap-2">
                    <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
                      {book.title}
                    </h2>
                    <span className="text-[12px] text-text-secondary font-medium">
                      {authorsText}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleExpand}
                    className="flex items-center gap-0.5 bg-transparent hover:text-text-primary text-[12px] text-text-secondary py-1 px-1 transition-colors cursor-pointer shrink-0"
                  >
                    <span>상세보기</span>
                    <ChevronUp className="w-3.5 h-3.5 text-text-subtitle" />
                  </button>
                </div>

                {/* 책 소개 본문 */}
                <div className="mt-2">
                  <h4 className="text-[12px] font-bold text-text-primary mb-1.5">
                    책 소개
                  </h4>
                  <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-6 whitespace-pre-line pr-2">
                    {book.contents ? `${book.contents}...` : '도서 소개 정보가 제공되지 않습니다.'}
                  </p>
                </div>
              </div>

              {/* 하단 우측: 원가/할인가 & 구매하기 버튼 */}
              <div className="mt-4 flex flex-col items-end gap-2.5 self-end w-full max-w-xs">
                <div className="flex flex-col items-end gap-0.5">
                  {hasSale ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-text-subtitle">원가</span>
                        <span className="text-[11px] text-text-subtitle line-through">
                          {formatCurrency(book.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-text-primary">할인가</span>
                        <span className="text-[15px] font-bold text-text-primary">
                          {formatCurrency(book.sale_price)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-text-primary">원가</span>
                      <span className="text-[15px] font-bold text-text-primary">
                        {formatCurrency(book.price)}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="default"
                  size="default"
                  onClick={handlePurchase}
                  className="w-44 bg-primary text-white text-[14px] font-semibold py-2.5 h-10 rounded-[var(--radius-button)] shadow-xs"
                >
                  구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
