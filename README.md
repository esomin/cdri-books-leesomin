# CERTICOS BOOKS

카카오 도서 검색 API를 연동한 도서 검색 및 찜 관리 웹 애플리케이션입니다.

---

## 1. 프로젝트 개요

- 도서 검색: 전체 검색 및 상세 검색(제목·저자명·출판사) 지원, 두 검색 모드는 실행 시 기존 입력값을 상호 초기화합니다.
- 최근 검색어: 최대 8개까지 `localStorage`에 유지하며, 키보드 방향키 탐색과 개별 삭제를 지원합니다.
- 무한 스크롤 & 상세보기: 10권 단위 페이지네이션을 적용했고, 카드 클릭 시 아코디언 형태로 책 소개와 원가, 할인가를 확인할 수 있습니다.
- 내가 찜한 책: 찜한 시점의 도서 데이터를 `localStorage`에 통째로 저장해 새로고침이나 브라우저 재시작 이후에도 목록을 유지합니다.

---

## 2. 실행 방법 및 환경 설정

### 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 카카오 REST API 키를 설정합니다.

```env
VITE_KAKAO_REST_API_KEY=kakao_rest_api_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 및 프리뷰
npm run build
npm run preview

# 린트 및 단위 테스트
npm run lint
npx vitest run
```

---

## 3. 폴더 구조 및 주요 코드 설명

### 폴더 구조

```text
src/
├── api/
│   ├── bookApi.ts    # 카카오 도서 검색 API 호출 및 응답 매핑
│   └── bookApi.test.ts
├── components/
│   ├── Header.tsx
│   ├── SearchBar.tsx   # 검색 입력창, 최근 검색어·상세 검색 트리거
│   ├── RecentSearchesPopover.tsx
│   ├── DetailSearchPopover.tsx
│   ├── BookList.tsx.    # 검색 결과 목록 및 무한 스크롤 센서
│   ├── BookItemCard.tsx # 접힘/펼침 상태 전환 컨테이너
│   ├── BookItemCollapsed.tsx
│   ├── BookItemExpanded.tsx
│   ├── BookmarkButton.tsx
│   ├── BookmarksView.tsx # 찜한 책 목록 탭 화면
│   └── ui/               # shadcn/ui (Radix UI 기반 공통 UI 컴포넌트)
├── hooks/
│   ├── useBookSearch.ts  # React Query 기반 무한 스크롤 검색 상태 관리
│   ├── useBookmarks.ts.  # 찜 목록 상태 및 localStorage 동기화
│   ├── useRecentSearches.ts
│   ├── useLocalStorage.ts
│   └── useIntersectionObserver.ts
├── types/book.ts
└── utils/format.ts
```

### 주요 코드 설명

1. 서버 상태 및 무한 스크롤 (`useBookSearch.ts` + `useIntersectionObserver.ts`)
   - TanStack Query의 `useInfiniteQuery`로 검색어·조건별 결과를 캐싱해 동일 검색어 재조회 시 불필요한 API 호출을 줄였습니다.
   - `useIntersectionObserver`가 목록 하단에 도달했음을 감지하면 다음 10권의 도서를 자동으로 이어서 불러옵니다.

2. 대량 목록 렌더링 최적화 (`BookItemCard.tsx` + `index.css`)
   - 카드 루트에 CSS `content-visibility: auto`를 적용해 뷰포트 밖에 있는 도서 카드의 레이아웃·페인트 연산을 건너뛰도록 최적화했습니다.
   - 함께 `contain-intrinsic-size: auto 120px`를 지정해 화면 밖 요소의 예상 높이를 미리 확보함으로써, 무한 스크롤로 수백 권의 도서가 누적되어도 스크롤바 튐 없이 부드러운 탐색 성능을 유지합니다.
   - 리스트 가상화(`@tanstack/react-virtual` 등) 대신 CSS 방식을 선택한 이유:
     1. 가변 높이 아코디언과의 충돌: 상세보기 확장 시 카드 높이가 동적으로 변해, JS 가상화 적용 시 스크롤 점프나 깜빡임이 발생하기 쉽습니다.
     2. API 데이터 범위: 카카오 도서 검색 API는 최대 1,000건으로 제한되며 실사용 시 수십~200건 수준이므로 모던 브라우저에서 DOM 부담이 크지 않습니다.
     3. 브라우저 기본 찾기(`Ctrl+F` / `Cmd+F`) 지원: 화면 밖 DOM을 언마운트하지 않아 페이지 내 도서명 검색이 정상 동작합니다.

3. 찜 스냅샷 영속화 및 빠른 조회 (`useBookmarks.ts` + `useLocalStorage.ts`)
   - 찜한 시점의 도서 스냅샷(`BookItem`) 전체를 저장해 브라우저 재시작 후에도 유지되며, `Set` 기반 $O(1)$ 조회로 대량 목록에서도 빠르게 찜 여부를 판별합니다.

4. URL 기반 탭 이동 및 검색 상태 유지 (`App.tsx` + `Header.tsx`)
   - `/search`와 `/bookmarks` 라우트를 분리하고 `useSearchParams`로 검색어(`q`)와 상세 조건(`target`)을 URL과 동기화해 뒤로가기·새로고침·링크 공유를 지원합니다.
   - `lastSearchUrl`을 기억해 찜한 책 탭을 다녀오더라도 검색창의 입력어와 캐시된 도서 목록이 그대로 복원됩니다.

---

## 4. 라이브러리 선택 이유

- React Router (react-router-dom): /search, /bookmarks 경로 분리로 브라우저 뒤로가기, 새로고침 유지, URL 쿼리(/search?q=...) 공유 지원
- Tailwind CSS v4 (CSS-First): tailwind.config.js 없이 @theme 블록으로 디자인 토큰(색상, 타이포그래피, 곡률)을 일원화하여 일관된 스타일 유지
- shadcn/ui (Radix UI + CVA): 접근성(a11y)이 보장된 Tabs, Button 프리미티브를 프로젝트 디자인 토큰에 맞게 커스터마이징하여 재사용성 확보
- Axios: 카카오 API 요청 시 공통 인증 헤더(Authorization) 및 쿼리 파라미터 직렬화를 간결하게 관리
- Lucide React: 경량 SVG 아이콘(Search, Heart, X, ChevronDown 등)으로 통일감 있는 아이콘 시스템 구축
- Vitest + React Testing Library: Vite 환경과 호환되는 빠른 단위 테스트 실행 및 커스텀 훅(useBookSearch, useBookmarks, useRecentSearches) 검증

---

## 5. 강조하고 싶은 기능

1. 키보드 중심 검색어 히스토리 및 팝오버 인터랙션
   - 최근 검색어(최대 8개 FIFO) 목록을 `ArrowDown`/`ArrowUp` + `Enter`로 탐색·선택할 수 있고, 외부 클릭 및 `ESC` 키 닫기, 전체 검색과 상세 검색 간 상호 배타적 초기화, 아코디언 여닫기 애니메이션(`grid-rows`·`opacity` 트랜지션)으로 매끄러운 검색 UX를 제공합니다.

2. URL 쿼리 동기화 + React Query 캐싱을 결합한 탭 전환 UX
   - `/search?q=...`와 `/bookmarks` 라우트를 분리하고 마지막 검색 URL을 보존하여, 탭 이동·뒤로가기·새로고침 시에도 검색어와 검색 결과 목록이 네트워크 재요청 없이 즉시 유지됩니다.
