import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { RecentSearchesPopover } from './RecentSearchesPopover';

interface SearchBarProps {
  initialKeyword?: string;
  onSearch: (keyword: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rightAction?: React.ReactNode;
  resetTrigger?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialKeyword = '',
  onSearch,
  onFocus,
  onBlur,
  rightAction,
  resetTrigger = 0,
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [prevResetTrigger, setPrevResetTrigger] = useState(resetTrigger);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();

  if (resetTrigger !== prevResetTrigger) {
    setPrevResetTrigger(resetTrigger);
    setKeyword('');
  }

  const submitSearch = (rawKeyword: string) => {
    const trimmed = rawKeyword.trim();
    if (trimmed) {
      addSearch(trimmed);
    }
    setIsFocused(false);
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFocused && recentSearches.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % recentSearches.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev <= 0 ? recentSearches.length - 1 : prev - 1
        );
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isFocused && activeIndex >= 0 && recentSearches[activeIndex]) {
        handleSelectRecent(recentSearches[activeIndex].keyword);
        setActiveIndex(-1);
      } else {
        submitSearch(keyword);
      }
    }
  };

  const handleSearchSubmit = () => {
    submitSearch(keyword);
  };

  const handleSelectRecent = (selectedKeyword: string) => {
    setKeyword(selectedKeyword);
    submitSearch(selectedKeyword);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setActiveIndex(-1);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setActiveIndex(-1);
    onBlur?.();
  };

  return (
    <div className="relative flex items-center gap-3 w-full">
      <div className="relative flex-1 flex items-center h-12 bg-white border border-gray focus-within:border-primary rounded-[var(--radius-button)] px-3.5 transition-colors">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="검색어를 입력하세요"
          className="flex-1 h-full text-body2 text-text-primary placeholder:text-text-subtitle outline-none bg-transparent pr-2"
        />
        {keyword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setKeyword('')}
            aria-label="검색어 지우기"
            className="p-1 text-text-subtitle hover:text-text-primary transition-colors cursor-pointer shrink-0 bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearchSubmit}
          aria-label="검색"
          className="p-1.5 text-black hover:opacity-70 transition-opacity cursor-pointer shrink-0 bg-transparent"
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
        </button>

        <RecentSearchesPopover
          items={recentSearches}
          isOpen={isFocused}
          activeIndex={activeIndex}
          onSelect={handleSelectRecent}
          onRemove={removeSearch}
          onClose={() => {
            setIsFocused(false);
            setActiveIndex(-1);
          }}
        />
      </div>

      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </div>
  );
};
