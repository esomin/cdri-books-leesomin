import { describe, it, expect } from 'vitest';
import { searchBooks } from './bookApi';

describe('searchBooks API', () => {
  it('카카오 도서 검색 API로 실제 도서 목록을 정상 조회해야 한다', async () => {
    const result = await searchBooks({ query: '리액트', page: 1, size: 5 });
    expect(result.documents.length).toBeGreaterThan(0);
    expect(result.meta.total_count).toBeGreaterThan(0);
    expect(result.documents[0].title).toBeDefined();
  });
});

