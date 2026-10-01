import { useState } from 'react'

export default function ResultCard({ food, onProceed }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true)
    }
  }

  return (
    <div className="result-flip-container">
      <div className="flip-instruction-header">
        <span className="celebration-badge">🎉 DECIDED</span>
        <h2 className="flip-title">오늘의 메뉴가 결정됐어요!</h2>
        <p className="flip-subtitle">
          {isFlipped ? '오늘 고민은 여기서 끝!' : '카드를 눌러 결과를 확인해보세요'}
        </p>
      </div>

      <div
        className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleFlip()
          }
        }}
        aria-label={isFlipped ? `공개된 메뉴: ${food.name}` : '카드를 뒤집어 메뉴 확인하기'}
      >
        <div className="flip-card-inner">
          {/* 앞면: 물음표 시크릿 카드 */}
          <div className="flip-card-front" aria-hidden={isFlipped}>
            <div className="secret-card-pattern" />
            <span className="secret-card-label">TODAY&apos;S MENU</span>
            <div className="secret-symbol-wrapper">
              <span className="secret-question-mark">?</span>
            </div>
            <div className="secret-prompt">
              <span className="touch-icon">👆</span>
              <span className="prompt-text">눌러서 공개하기</span>
            </div>
          </div>

          {/* 뒷면: 음식 결과 카드 */}
          <div className="flip-card-back" aria-hidden={!isFlipped}>
            <div className="revealed-header">
              <span className="revealed-badge">{food.categoryName}</span>
            </div>
            <div className="revealed-emoji-box">
              <span className="revealed-emoji">{food.emoji}</span>
            </div>
            <h3 className="revealed-name">{food.name}</h3>
            <p className="revealed-tagline">{food.tagline}</p>
            <div className="revealed-price-pill">
              <span>1인당 예상 가격 ~{food.budget.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="flip-actions animate-fade-in">
          <button
            type="button"
            className="btn-primary btn-large"
            onClick={onProceed}
          >
            추천 이유 보러 가기 →
          </button>
        </div>
      )}
    </div>
  )
}
