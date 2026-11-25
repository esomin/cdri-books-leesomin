/**
 * 외부 카카오 도서 검색 API 원본 도서 문서 모델
 * @see data-model.md KakaoBookDocument
 */
export interface KakaoBookDocument {
  title: string;
  contents: string;
  url: string;
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  sale_price: number;
  thumbnail: string;
  status: string;
}

/**
 * 카카오 도서 검색 API 메타 정보
 */
export interface KakaoBookMeta {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
}

/**
 * 카카오 도서 검색 API 응답 루트 구조
 */
export interface KakaoBookSearchResponse {
  meta: KakaoBookMeta;
  documents: KakaoBookDocument[];
}

/**
 * 클라이언트 내부 도서 엔티티 (찜 시점 스냅샷 지원)
 * @see data-model.md BookItem
 */
export interface BookItem extends KakaoBookDocument {
  bookmarkedAt?: string;
}

/**
 * 상세 검색 대상 조건 필드
 * @see data-model.md SearchTarget
 */
export type SearchTarget = 'title' | 'person' | 'publisher';

/**
 * 상세 검색 조건 모델
 * @see data-model.md SearchCondition
 */
export interface SearchCondition {
  target: SearchTarget;
  query: string;
}

/**
 * 최근 검색어 항목 (최대 8개 FIFO 유지)
 * @see data-model.md RecentSearchItem
 */
export interface RecentSearchItem {
  id: string;
  keyword: string;
  timestamp: number;
}

