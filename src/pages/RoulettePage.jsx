import { useState, useRef, useEffect } from 'react'
import Roulette from '../components/Roulette.jsx'
import ResultCard from '../components/ResultCard.jsx'

// 룰렛이 멈춘 뒤 당첨 칸을 눈으로 확인할 수 있도록 잠깐 기다렸다가 카드 공개
const REVEAL_DELAY_MS = 900

export default function RoulettePage({
  candidates = [],
  onComplete,
}) {
  const [spinState, setSpinState] = useState('idle') // 'idle' | 'spinning' | 'stopped'
  const [selectedFood, setSelectedFood] = useState(null)
  const [showCard, setShowCard] = useState(false)
  const revealTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(revealTimerRef.current), [])

  const handleSpinStart = () => {
    setSpinState('spinning')
  }

  const handleSpinEnd = (winnerItem) => {
    setSelectedFood(winnerItem)
    setSpinState('stopped')
    revealTimerRef.current = setTimeout(() => setShowCard(true), REVEAL_DELAY_MS)
  }

  const handleProceedToResult = () => {
    if (selectedFood) {
      onComplete(selectedFood)
    }
  }

  return (
    <div className="roulette-page-container">
      <div className="roulette-page-header">
        <span className="roulette-step-tag">🎡 FINAL DECISION</span>
        <h2 className="roulette-page-title">
          {spinState === 'stopped'
            ? '룰렛이 멈췄어요!'
            : spinState === 'spinning'
            ? '두구두구… 오늘의 메뉴는?'
            : '룰렛을 돌려 메뉴를 정해요'}
        </h2>
        <p className="roulette-page-desc">
          {spinState === 'stopped'
            ? '결과 카드를 준비하고 있어요'
            : spinState === 'spinning'
            ? '바늘이 멈추는 곳이 오늘의 한 끼예요'
            : '가운데 GO 버튼을 눌러주세요'}
        </p>
      </div>

      {/* 룰렛 메인 영역 */}
      <div className="roulette-stage">
        <Roulette
          items={candidates}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
        />
      </div>

      {/* 룰렛 후보 목록 */}
      <ul className="roulette-legend" aria-label="룰렛 후보">
        {candidates.map((food) => (
          <li
            key={food.id}
            className={`legend-chip ${spinState === 'stopped' && selectedFood?.id !== food.id ? 'is-dimmed' : ''}`}
          >
            <span aria-hidden="true">{food.emoji}</span> {food.name}
          </li>
        ))}
      </ul>

      {/* 회전 완료 후 등장하는 결과 시크릿 카드 모달 */}
      {showCard && selectedFood && (
        <div className="secret-reveal-modal-backdrop animate-fade-in">
          <div
            className="secret-reveal-modal animate-scale-up"
            role="dialog"
            aria-modal="true"
            aria-label="오늘의 메뉴 결과 카드"
          >
            <ResultCard
              food={selectedFood}
              onProceed={handleProceedToResult}
            />
          </div>
        </div>
      )}
    </div>
  )
}
