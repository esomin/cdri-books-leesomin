import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();

  useEffect(() => {
    if (resetTrigger > 0) {
      setKeyword('');
    }
  }, [resetTrigger]);

  const submitSearch = (rawKeyword: string) => {
    const trimmed = rawKeyword.trim();
    if (trimmed) {
      addSearch(trimmed);
    }
    setIsFocused(false);
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSearch(keyword);
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
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className="relative flex items-center gap-3 w-full">
      {/* 
        굵은 블랙 테두리(border-2 border-black) + 3px 라운딩
        돋보기 버튼은 별도 배경색 없이 인풋 내부 우측에 자연스럽게 위치
      */}
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
          onSelect={handleSelectRecent}
          onRemove={removeSearch}
        />
      </div>

      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </div>
  );
};
