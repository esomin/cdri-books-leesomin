import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialKeyword?: string;
  onSearch: (keyword: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rightAction?: React.ReactNode;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialKeyword = '',
  onSearch,
  onFocus,
  onBlur,
  rightAction,
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(keyword.trim());
    }
  };

  const handleSearchSubmit = () => {
    onSearch(keyword.trim());
  };

  return (
    <div className="relative flex items-center gap-3 w-full">
      {/* 
        굵은 블랙 테두리(border-2 border-black) + 3px 라운딩
        돋보기 버튼은 별도 배경색 없이 인풋 내부 우측에 자연스럽게 위치
      */}
      <div className="relative flex-1 flex items-center h-12 border-2 border-black rounded-[var(--radius-button)] bg-white px-3 transition-colors">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
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
      </div>

      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </div>
  );
};
