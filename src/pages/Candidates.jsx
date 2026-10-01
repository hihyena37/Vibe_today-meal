import { useState, useRef, useEffect } from 'react'
import FoodCard from '../components/FoodCard.jsx'
import ConditionSummary from '../components/ConditionSummary.jsx'
import { MAX_CANDIDATES } from '../utils/recommendation.js'
import { isUnlimitedBudget } from '../utils/budget.js'

const MIN_ROULETTE_CANDIDATES = 2

export default function Candidates({
  candidates = [],
  answers,
  rememberSettings,
  onRemoveFood,
  onProceedToRoulette,
  onChooseSingle,
  onEditConditions,
  onRestart,
  onLocationChange,
}) {
  const [alertMessage, setAlertMessage] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const alertTimerRef = useRef(null)
  const removeTimerRef = useRef(null)

  useEffect(() => () => {
    clearTimeout(alertTimerRef.current)
    clearTimeout(removeTimerRef.current)
  }, [])

  const count = candidates.length
  const isSingle = count === 1
  const canRemove = count > MIN_ROULETTE_CANDIDATES

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

  const summary = (
    <ConditionSummary
      answers={answers}
      onLocationChange={onLocationChange}
      rememberSettings={rememberSettings}
    />
  )

  // 조건을 만족하는 메뉴가 하나도 없는 경우
  if (count === 0) {
    const hasBudgetLimit = !isUnlimitedBudget(answers.budget)
    const hasSpicyLimit = answers.spicy === 0 || answers.spicy === 1

    return (
      <div className="candidates-container">
        <div className="candidates-header">
          <span className="candidates-pill">🤔 후보 없음</span>
          <h2 className="candidates-title">조건에 맞는 메뉴가 없어요</h2>
          <p className="candidates-subtitle">
            입력한 조건을 모두 지키는 메뉴를 찾지 못했어요.<br />
            아래 조건을 바꿔서 다시 찾아보세요.
          </p>
        </div>

        {summary}

        <ul className="empty-tips">
          {hasBudgetLimit && <li>1인당 예산을 조금 올리거나 &apos;가격 상관없음&apos;을 선택해 보세요.</li>}
          {hasSpicyLimit && <li>매운 음식 허용 범위를 넓히면 후보가 늘어날 수 있어요.</li>}
        </ul>

        <div className="candidates-actions">
          <button
            type="button"
            className="btn-primary btn-large"
            onClick={() => onEditConditions(hasBudgetLimit ? 'budget' : 'spicy')}
          >
            {hasBudgetLimit ? '💰 1인당 예산 수정하기' : '🌶️ 맵기 조건 수정하기'}
          </button>
          <button type="button" className="btn-secondary btn-large" onClick={() => onEditConditions()}>
            ✏️ 조건 전체 수정
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="candidates-container">
      <div className="candidates-header">
        <span className="candidates-pill">🎯 조건 분석 완료</span>
        <h2 className="candidates-title">
          {isSingle ? '조건에 맞는 메뉴 1개' : `오늘의 추천 후보 ${count}선`}
        </h2>
        <p className="candidates-subtitle">
          {isSingle ? (
            <>조건을 모두 지키는 메뉴가 하나뿐이라 룰렛 없이 바로 고를 수 있어요.</>
          ) : (
            <>
              1인당 예산·맵기 조건을 지키는 메뉴 중 잘 맞는 순서로 골랐어요.<br />
              끌리지 않는 메뉴는 <strong>✕</strong>를 눌러 빼주세요.
            </>
          )}
        </p>
        {!isSingle && count < MAX_CANDIDATES && (
          <p className="candidates-note">조건을 만족하는 메뉴가 {count}개라 {count}개만 보여드려요.</p>
        )}
      </div>

      {summary}

      {alertMessage && (
        <div className="alert-toast animate-fade-in" role="alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">{alertMessage}</span>
        </div>
      )}

      <div className={`candidates-grid ${isSingle ? 'is-single' : ''}`}>
        {candidates.map((food, idx) => (
          <FoodCard
            key={food.id}
            food={food}
            rank={isSingle ? null : idx + 1}
            onRemove={isSingle ? null : handleRemove}
            canRemove={canRemove}
            isRemoving={removingId === food.id}
            disabledReason="최소 2개는 남아있어야 룰렛을 돌릴 수 있어요"
          />
        ))}
      </div>

      <p className="price-disclaimer">
        ※ 가격은 1인당 예상 가격이에요. 실제 식당 가격은 다를 수 있어요.
      </p>

      <div className="candidates-secondary-actions">
        <button type="button" className="text-btn" onClick={() => onEditConditions()}>
          ✏️ 조건 수정
        </button>
        <button type="button" className="text-btn" onClick={onRestart}>
          ↺ 처음부터 다시
        </button>
      </div>

      <div className="candidates-bottom-bar">
        {isSingle ? (
          <button
            type="button"
            className="btn-primary btn-large"
            onClick={() => onChooseSingle(candidates[0])}
          >
            <span>이 메뉴로 결정하기</span>
            <span className="btn-icon">✓</span>
          </button>
        ) : (
          <>
            <div className="candidates-count-info">
              룰렛에 올라갈 메뉴 <strong>{count}개</strong>
              {!canRemove && <span className="count-min-note"> · 최소 개수예요</span>}
            </div>
            <button
              type="button"
              className="btn-primary btn-large"
              onClick={onProceedToRoulette}
              disabled={count < MIN_ROULETTE_CANDIDATES || Boolean(removingId)}
            >
              <span>이 메뉴들로 룰렛 돌리기</span>
              <span className="btn-icon">🎡</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
