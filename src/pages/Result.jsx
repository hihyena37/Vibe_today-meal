import { generateRecommendationReason, getMatchedConditions } from '../utils/recommendation.js'
import {
  buildSearchQuery,
  getKakaoMapSearchUrl,
  getGoogleMapSearchUrl,
} from '../utils/mapSearch.js'
import ConditionSummary from '../components/ConditionSummary.jsx'

export default function Result({
  food,
  answers,
  rememberSettings,
  canReSpin,
  onReSpin,
  onEditConditions,
  onRestart,
  onLocationChange,
}) {
  const recommendationReason = generateRecommendationReason(food, answers)
  const matchedConditions = getMatchedConditions(food, answers)

  // 지역 + 메뉴를 조합한 지도 검색어 (지도 서비스의 검색 결과 페이지를 새 탭으로 연다)
  const location = answers.location || ''
  const searchQuery = buildSearchQuery(food, location)

  return (
    <div className="result-page-container">
      <div className="result-header">
        <h1 className="result-main-title">
          오늘의 <span className="pick-accent">PICK</span>
        </h1>
      </div>

      {/* 메인 결과 카드 */}
      <div className="final-food-card animate-scale-up" style={{ '--food-theme': food.color }}>
        <div className="final-card-tag-row">
          <span className="final-category-tag">{food.categoryName}</span>
          <span className="final-budget-tag">1인당 예상 ~{food.budget.toLocaleString()}원</span>
        </div>

        <div className="final-emoji-wrapper">
          <span className="final-emoji" role="img" aria-label={food.name}>
            {food.emoji}
          </span>
        </div>

        <h2 className="final-food-name">{food.name}</h2>
        <p className="final-food-tagline">{food.tagline}</p>

        {/* 음식 스펙 뱃지들 */}
        <div className="final-specs-grid">
          <div className="spec-badge">
            <span className="spec-badge-label">국물 여부</span>
            <span className="spec-badge-val">{food.soup ? '따뜻한 국물 🍲' : '국물 없는 요리 🥗'}</span>
          </div>
          <div className="spec-badge">
            <span className="spec-badge-label">맵기 강도</span>
            <span className="spec-badge-val">
              {food.spicy === 0 ? '담백·순한맛 👶' : food.spicy === 1 ? '적당한 매콤함 🌶️' : '화끈한 매운맛 🔥'}
            </span>
          </div>
          <div className="spec-badge">
            <span className="spec-badge-label">든든함 정도</span>
            <span className="spec-badge-val">
              {food.fullness === 1 ? '가벼운 한 끼 🥪' : food.fullness === 2 ? '적당한 포만감 🍛' : '속 든든한 푸짐함 🥩'}
            </span>
          </div>
        </div>

        <p className="final-price-note">
          가격은 메뉴의 1인당 예상 가격이에요. 실제 식당 가격은 다를 수 있어요.
        </p>
      </div>

      {/* 왜 이 메뉴인가요? 추천 이유 섹션 */}
      <div className="recommendation-reason-card">
        <div className="reason-header">
          <span className="reason-icon">💡</span>
          <h3 className="reason-title">왜 이 메뉴인가요?</h3>
        </div>
        <p className="reason-content">{recommendationReason}</p>
        {matchedConditions.length > 0 && (
          <ul className="reason-chips" aria-label="내 조건과 일치한 항목">
            {matchedConditions.map((label) => (
              <li key={label} className="reason-chip">✓ {label}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 내 조건 요약 (지역 바로 수정 가능) */}
      <ConditionSummary
        answers={answers}
        onLocationChange={onLocationChange}
        rememberSettings={rememberSettings}
      />

      {/* 지도 서비스 검색 결과로 연결 */}
      <section className="map-search-card" aria-labelledby="map-search-title">
        <div className="map-search-header">
          <span className="map-search-icon" aria-hidden="true">📍</span>
          <div>
            <h3 id="map-search-title" className="map-search-title">
              {location ? '선택한 지역에서 음식점 검색' : '메뉴 이름으로 음식점 검색'}
            </h3>
            <p className="map-search-query">
              검색어: <strong>&apos;{searchQuery}&apos;</strong>
            </p>
          </div>
        </div>

        {!location && (
          <p className="map-search-hint">
            지역을 추가하면 더 정확하게 찾을 수 있어요. 위 요약의 &apos;지역 추가&apos;를 눌러보세요.
          </p>
        )}

        <div className="map-search-links">
          <a
            className="btn-primary btn-large map-link"
            href={getKakaoMapSearchUrl(searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            카카오맵에서 검색 <span className="sr-only">(새 탭)</span>
            <span className="btn-icon" aria-hidden="true">↗</span>
          </a>
          <a
            className="btn-secondary btn-large map-link"
            href={getGoogleMapSearchUrl(searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            구글 지도에서 검색 <span className="sr-only">(새 탭)</span>
            <span className="btn-icon" aria-hidden="true">↗</span>
          </a>
        </div>

        <p className="map-search-note">
          지도 서비스의 검색 결과가 새 탭으로 열려요. 이 사이트는 식당 목록·거리·영업 여부·실제 메뉴 가격을
          확인하지 않으니, 지도 서비스에서 직접 확인해 주세요.
        </p>
      </section>

      {/* 조작 버튼 영역 */}
      <div className="result-actions">
        {canReSpin && (
          <button
            type="button"
            className="btn-primary btn-large btn-respin"
            onClick={onReSpin}
          >
            <span>🎡 한 번 더 돌리기</span>
          </button>
        )}
        <button
          type="button"
          className="btn-secondary btn-large"
          onClick={() => onEditConditions()}
        >
          <span>✏️ 조건 수정</span>
        </button>
        <button
          type="button"
          className="btn-secondary btn-large"
          onClick={onRestart}
        >
          <span>↺ 처음부터 다시</span>
        </button>
      </div>
      <p className="result-actions-help">
        조건 수정은 지금 답변을 그대로 두고, 처음부터 다시는 질문 답변을 비워요.
      </p>
    </div>
  )
}
