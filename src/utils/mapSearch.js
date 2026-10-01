// 지도 서비스가 공식 문서로 제공하는 검색 링크만 사용 (API 키 불필요)
// - 카카오맵 지도 URL: https://map.kakao.com/link/search/{검색어}
//   (https://apis.map.kakao.com/web/guide/#bigmapurl)
// - Google Maps URLs: https://www.google.com/maps/search/?api=1&query={검색어}
//   (https://developers.google.com/maps/documentation/urls/get-started)

/**
 * 지도 검색에 쓰기 좋은 메뉴 키워드
 * 예) '국밥 (돼지/순대)' → '국밥', '족발 & 보쌈' → '족발', '수제버거 / 햄버거' → '수제버거'
 */
export function getSearchKeyword(food) {
  return food.name
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .split(/\s[&/]\s/)[0]
    .trim()
}

export function buildSearchQuery(food, location) {
  const keyword = getSearchKeyword(food)
  return location ? `${location} ${keyword}` : keyword
}

export const getKakaoMapSearchUrl = (query) =>
  `https://map.kakao.com/link/search/${encodeURIComponent(query)}`

export const getGoogleMapSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
