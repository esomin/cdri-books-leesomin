import axios from 'axios';
import type { KakaoBookSearchResponse, SearchTarget } from '../types/book';

export const kakaoApiClient = axios.create({
  baseURL: 'https://dapi.kakao.com/v3/search',
});

kakaoApiClient.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_KAKAO_API_KEY is not configured');
  }
  config.headers.Authorization = `KakaoAK ${apiKey}`;
  return config;
});

export interface SearchBooksParams {
  query: string;
  page: number;
  size?: number;
  target?: SearchTarget;
  sort?: 'accuracy' | 'recency';
}

/**
 * 카카오 도서 검색 API 호출
 */
export async function searchBooks(params: SearchBooksParams): Promise<KakaoBookSearchResponse> {
  const { query, page, size = 10, target, sort = 'accuracy' } = params;

  if (!query.trim()) {
    return {
      meta: { is_end: true, pageable_count: 0, total_count: 0 },
      documents: [],
    };
  }

  const response = await kakaoApiClient.get<KakaoBookSearchResponse>('/book', {
    params: {
      query: query.trim(),
      page,
      size,
      sort,
      target,
    },
  });

  return response.data;
}
