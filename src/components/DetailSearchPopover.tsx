import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import type { SearchTarget } from '../types/book';

interface DetailSearchPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (target: SearchTarget, query: string) => void;
  resetTrigger?: number;
}

const TARGET_OPTIONS: { value: SearchTarget; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'person', label: '저자명' },
  { value: 'publisher', label: '출판사' },
];

export const DetailSearchPopover: React.FC<DetailSearchPopoverProps> = ({
  isOpen,
  onClose,
  onSearch,
  resetTrigger = 0,
}) => {
  const [target, setTarget] = useState<SearchTarget>('title');
  const [query, setQuery] = useState('');
  const [prevResetTrigger, setPrevResetTrigger] = useState(resetTrigger);
  const popoverRef = useRef<HTMLDivElement>(null);

  if (resetTrigger !== prevResetTrigger) {
    setPrevResetTrigger(resetTrigger);
    setTarget('title');
    setQuery('');
  }

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(target, trimmed);
  };

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="상세 검색"
      className="absolute right-0 top-full mt-2 z-30 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-5"
    >
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="상세 검색 닫기"
          className="p-1 text-text-subtitle hover:text-text-primary transition-colors cursor-pointer bg-transparent"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as SearchTarget)}
            aria-label="검색 조건"
            className="h-10 px-2 border-b border-gray-300 text-body2 text-text-primary bg-white outline-none focus:border-primary cursor-pointer"
          >
            {TARGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어 입력"
            className="flex-1 h-10 px-2 border-b border-gray-300 text-body2 text-text-primary placeholder:text-text-subtitle outline-none focus:border-primary bg-transparent"
          />
        </div>

        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full bg-primary text-white text-[12px] font-bold py-2.5 h-9 shadow-xs"
        >
          검색하기
        </Button>
      </form>
    </div>
  );
};

