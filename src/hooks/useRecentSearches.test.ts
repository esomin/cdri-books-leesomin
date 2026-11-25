import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useRecentSearches,
  RECENT_SEARCHES_STORAGE_KEY,
  MAX_RECENT_SEARCHES,
} from './useRecentSearches';

describe('useRecentSearches', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('초기 상태는 localStorage가 비어있을 때 빈 배열이어야 한다', () => {
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentSearches).toEqual([]);
  });

  it('검색어를 추가하면 최신 순으로 저장되고 localStorage에 동기화된다', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('리액트');
    });
    act(() => {
      result.current.addSearch('타입스크립트');
    });

    expect(result.current.recentSearches.map((item) => item.keyword)).toEqual([
      '타입스크립트',
      '리액트',
    ]);

    const stored = JSON.parse(localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(2);
    expect(stored[0].keyword).toBe('타입스크립트');
  });

  it('공백만 있는 검색어는 추가하지 않는다', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('   ');
    });

    expect(result.current.recentSearches).toEqual([]);
  });

  it('중복된 검색어를 추가하면 기존 항목을 제거하고 최상단으로 갱신한다', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('A');
      result.current.addSearch('B');
      result.current.addSearch('A');
    });

    expect(result.current.recentSearches.map((item) => item.keyword)).toEqual(['A', 'B']);
  });

  it(`최대 ${MAX_RECENT_SEARCHES}개까지만 유지하며 초과 시 가장 오래된 항목(FIFO)을 제거한다`, () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      for (let i = 1; i <= 10; i++) {
        result.current.addSearch(`검색어${i}`);
      }
    });

    expect(result.current.recentSearches).toHaveLength(MAX_RECENT_SEARCHES);
    expect(result.current.recentSearches.map((item) => item.keyword)).toEqual([
      '검색어10',
      '검색어9',
      '검색어8',
      '검색어7',
      '검색어6',
      '검색어5',
      '검색어4',
      '검색어3',
    ]);
  });

  it('특정 ID의 검색어를 개별 삭제할 수 있다', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch('첫번째');
      result.current.addSearch('두번째');
    });

    const targetId = result.current.recentSearches[0].id;

    act(() => {
      result.current.removeSearch(targetId);
    });

    expect(result.current.recentSearches.map((item) => item.keyword)).toEqual(['첫번째']);
  });
});

