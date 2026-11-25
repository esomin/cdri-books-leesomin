import { describe, it, expect } from 'vitest';
import { formatCurrency, hasValidSalePrice } from './format';

describe('formatCurrency', () => {
  it('숫자를 한국어 원화 표기(천 단위 콤마 + 원)로 변환한다', () => {
    expect(formatCurrency(15000)).toBe('15,000원');
    expect(formatCurrency(0)).toBe('0원');
    expect(formatCurrency(8800)).toBe('8,800원');
  });

  it('음수나 NaN 등 유효하지 않은 값은 0원으로 반환한다', () => {
    expect(formatCurrency(-1)).toBe('0원');
    expect(formatCurrency(Number.NaN)).toBe('0원');
  });
});

describe('hasValidSalePrice', () => {
  it('할인가가 0보다 크고 정가보다 작을 때만 true를 반환한다', () => {
    expect(hasValidSalePrice(10000, 9000)).toBe(true);
    expect(hasValidSalePrice(8800, 7920)).toBe(true);
  });

  it('할인가가 -1, 0이거나 정가 이상이면 false를 반환한다', () => {
    expect(hasValidSalePrice(10000, -1)).toBe(false);
    expect(hasValidSalePrice(10000, 0)).toBe(false);
    expect(hasValidSalePrice(10000, 10000)).toBe(false);
    expect(hasValidSalePrice(10000, 12000)).toBe(false);
  });
});

