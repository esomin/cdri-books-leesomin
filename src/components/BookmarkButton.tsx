import React from 'react';
import { Heart } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    button: 'top-1 right-1 p-0.5',
    icon: 'w-2.5 h-2.5',
  },
  md: {
    button: 'top-2 right-2 p-1.5',
    icon: 'w-4 h-4',
  },
} as const;

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  size = 'md',
  className = '',
}) => {
  const styles = SIZE_STYLES[size];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(e);
      }}
      aria-label={isBookmarked ? '찜 해제' : '찜하기'}
      className={`absolute z-10 rounded-full bg-white/85 shadow-xs cursor-pointer ${styles.button} ${className}`}
    >
      <Heart
        className={`${styles.icon} ${
          isBookmarked ? 'fill-red stroke-none' : 'stroke-gray fill-none'
        }`}
      />
    </button>
  );
};

