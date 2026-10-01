import { useState, useRef, useEffect } from 'react'
import { generateRecommendationReason, getMatchedConditions } from '../utils/recommendation.js'

export default function Result({
  food,
  answers,
  onReSpin,
  onResetQuiz,
}) {
  const [toastMessage, setToastMessage] = useState('')
  const toastTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(toastTimerRef.current), [])

  const recommendationReason = generateRecommendationReason(food, answers)
  const matchedConditions = getMatchedConditions(food, answers)

  // 2차 개발: 위치 기반 주변 음식점 검색을 이 핸들러에 연결 예정
  const handleNearbySearchClick = () => {
    setToastMessage('주변 음식점 찾기는 다음 업데이트에서 만나요!')
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <div className="result-page-container">
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="alert-toast success-toast animate-fade-in" role="status">
          <span className="alert-icon">📍</span>
          <span className="alert-text">{toastMessage}</span>
        </div>
      )}

      <div className="result-header">
        <h1 className="result-main-title">
          오늘의 <span className="pick-accent">PICK</span>
        </h1>
      </div>

      {/* 메인 결과 카드 */}
      <div className="final-food-card animate-scale-up" style={{ '--food-theme': food.color }}>
        <div className="final-card-tag-row">
          <span className="final-category-tag">{food.categoryName}</span>
          <span className="final-budget-tag">~{food.budget.toLocaleString()}원</span>
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

      {/* 향후 2차 기능(위치 기반 검색) 티저 안내 */}
      <div
        className="future-feature-banner"
        onClick={handleNearbySearchClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleNearbySearchClick()
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="future-icon">📍</div>
        <div className="future-text">
          <strong>내 주변 &apos;{food.name}&apos; 맛집 찾기</strong>
          <small>위치 기반 맛집 추천 · 곧 업데이트 예정</small>
        </div>
        <span className="future-arrow">→</span>
      </div>

      {/* 조작 버튼 영역 */}
      <div className="result-actions">
        <button
          type="button"
          className="btn-primary btn-large btn-respin"
          onClick={onReSpin}
        >
          <span>🎡 한 번 더 돌리기</span>
        </button>
        <button
          type="button"
          className="btn-secondary btn-large"
          onClick={onResetQuiz}
        >
          <span>✏️ 조건 다시 선택하기</span>
        </button>
      </div>
    </div>
  )
}
