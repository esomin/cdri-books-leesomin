import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';

interface HeaderProps {
  bookmarkCount?: number;
  lastSearchUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  bookmarkCount = 0,
  lastSearchUrl = '/search',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.startsWith('/bookmarks') ? 'bookmarks' : 'search';

  const handleTabChange = (val: string) => {
    if (val === 'bookmarks') {
      navigate('/bookmarks');
    } else {
      navigate(lastSearchUrl);
    }
  };
  return (
    <header className="border-b border-gray bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => handleTabChange('search')}
        >
          <h1 className="text-title1 font-bold text-black tracking-tight">
            CERTICOS BOOKS
          </h1>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList variant="line">
            <TabsTrigger value="search" variant="line">
              도서 검색
            </TabsTrigger>
            <TabsTrigger value="bookmarks" variant="line" className="relative">
              <span>내가 찜한 책</span>
              {bookmarkCount > 0 && (
                <span className="absolute left-full ml-1.5 text-small bg-light-gray text-text-primary px-1.5 py-0.5 rounded-full font-medium tabular-nums">
                  {bookmarkCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
};
