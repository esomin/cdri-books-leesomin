import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

/**
 * 웹 표준 IntersectionObserver 기반 뷰포트 교차 감지 훅
 * 무한 스크롤 하단 도달 시 사전 패칭을 지원
 */
export function useIntersectionObserver(
  onIntersect: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { rootMargin = '200px 0px', threshold = 0.1, enabled = true } = options;
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, rootMargin, threshold, enabled]);

  return targetRef;
}

