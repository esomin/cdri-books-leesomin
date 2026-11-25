import React, { useState } from 'react';
import { BookItemCollapsed } from './BookItemCollapsed';
import { BookItemExpanded } from './BookItemExpanded';
import { hasValidSalePrice } from '../utils/format';
import type { BookItem } from '../types/book';

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

  const hasSale = hasValidSalePrice(book.price, book.sale_price);
  const displayPrice = hasSale ? book.sale_price : book.price;
  const authorsText =
    book.authors && book.authors.length > 0 ? book.authors.join(', ') : '저자 미상';

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.url) {
      window.open(book.url, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <article className="border-b border-gray py-3.5 book-item-visibility transition-colors">
      <BookItemCollapsed
        book={book}
        authorsText={authorsText}
        displayPrice={displayPrice}
        isBookmarked={isBookmarked}
        isExpanded={isExpanded}
        onToggleBookmark={() => onToggleBookmark(book)}
        onPurchase={handlePurchase}
        onToggleExpand={toggleExpand}
      />
      <BookItemExpanded
        book={book}
        authorsText={authorsText}
        hasSale={hasSale}
        isBookmarked={isBookmarked}
        isExpanded={isExpanded}
        onToggleBookmark={() => onToggleBookmark(book)}
        onPurchase={handlePurchase}
        onToggleExpand={toggleExpand}
      />
    </article>
  );
};
