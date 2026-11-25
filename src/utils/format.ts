/**
 * 가격 및 화폐 포맷 유틸리티
 */

/**
 * 숫자를 한국어 원화 표기(예: 10,000원)로 변환
 */
export function formatCurrency(price: number): string {
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    return '0원';
  }
  return `${price.toLocaleString('ko-KR')}원`;
}

/**
 * 할인가 유효성 검사 규칙
 * - sale_price가 존재하고, 0보다 크며, price(정상가) 보다 작은 경우에만 할인 유효
 */
export function hasValidSalePrice(price: number, salePrice: number): boolean {
  return typeof salePrice === 'number' && salePrice > 0 && salePrice < price;
}

