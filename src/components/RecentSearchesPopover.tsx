import React from 'react';
import { X } from 'lucide-react';
import type { RecentSearchItem } from '../hooks/useRecentSearches';

interface RecentSearchesPopoverProps {
  items: RecentSearchItem[];
  isOpen: boolean;
  onSelect: (keyword: string) => void;
  onRemove: (id: string) => void;
}

export const RecentSearchesPopover: React.FC<RecentSearchesPopoverProps> = ({
  items,
  isOpen,
  onSelect,
  onRemove,
}) => {
  if (!isOpen || items.length === 0) {
    return null;
  }

  return (
    <div
      role="listbox"
      aria-label="최근 검색어"
      className="absolute left-0 right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
    >
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(item.keyword)}
              className="flex-1 text-left text-body2 text-text-primary truncate pr-2 cursor-pointer bg-transparent"
            >
              {item.keyword}
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onRemove(item.id)}
              aria-label={`${item.keyword} 삭제`}
              className="p-1 text-text-subtitle hover:text-text-primary transition-colors cursor-pointer shrink-0 bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

