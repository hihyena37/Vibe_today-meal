import { useState, useRef, useEffect } from 'react'
import FoodCard from '../components/FoodCard.jsx'

const MIN_CANDIDATES = 2

export default function Candidates({
  candidates = [],
  onRemoveFood,
  onProceedToRoulette,
}) {
  const [alertMessage, setAlertMessage] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const alertTimerRef = useRef(null)
  const removeTimerRef = useRef(null)

  useEffect(() => () => {
    clearTimeout(alertTimerRef.current)
    clearTimeout(removeTimerRef.current)
  }, [])

  const canRemove = candidates.length > MIN_CANDIDATES

  const handleRemove = (foodId) => {
    if (removingId) return

    if (!canRemove) {
      setAlertMessage('룰렛을 돌리려면 최소 2개의 메뉴가 필요해요!')
      clearTimeout(alertTimerRef.current)
      alertTimerRef.current = setTimeout(() => setAlertMessage(''), 2500)
      return
    }

    // 카드가 사라지는 애니메이션 후 실제로 제외
    setRemovingId(foodId)
    removeTimerRef.current = setTimeout(() => {
      onRemoveFood(foodId)
      setRemovingId(null)
    }, 220)
  }

  return (
    <div className="candidates-container">
      <div className="candidates-header">
        <span className="candidates-pill">🎯 취향 분석 완료</span>
        <h2 className="candidates-title">오늘의 추천 후보 {candidates.length}선</h2>
        <p className="candidates-subtitle">
          답변을 바탕으로 가장 잘 맞는 메뉴를 골랐어요.<br />
          끌리지 않는 메뉴는 <strong>✕</strong>를 눌러 빼주세요.
        </p>
      </div>

      {alertMessage && (
        <div className="alert-toast animate-fade-in" role="alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">{alertMessage}</span>
        </div>
      )}

      <div className="candidates-grid">
        {candidates.map((food, idx) => (
          <FoodCard
            key={food.id}
            food={food}
            rank={idx + 1}
            onRemove={handleRemove}
            canRemove={canRemove}
            isRemoving={removingId === food.id}
            disabledReason="최소 2개는 남아있어야 룰렛을 돌릴 수 있어요"
          />
        ))}
      </div>

      <div className="candidates-bottom-bar">
        <div className="candidates-count-info">
          룰렛에 올라갈 메뉴 <strong>{candidates.length}개</strong>
          {!canRemove && <span className="count-min-note"> · 최소 개수예요</span>}
        </div>
        <button
          type="button"
          className="btn-primary btn-large"
          onClick={onProceedToRoulette}
          disabled={candidates.length < MIN_CANDIDATES || Boolean(removingId)}
        >
          <span>이 메뉴들로 룰렛 돌리기</span>
          <span className="btn-icon">🎡</span>
        </button>
      </div>
    </div>
  )
}
