import { useState, useEffect } from 'react'

const SAMPLE_FOODS = [
  { name: '김치찌개', emoji: '🍲' },
  { name: '일본 라멘', emoji: '🍜' },
  { name: '초밥', emoji: '🍣' },
  { name: '파스타', emoji: '🍝' },
  { name: '수제버거', emoji: '🍔' },
  { name: '제육볶음', emoji: '🥓' },
  { name: '마라탕', emoji: '🌶️' },
  { name: '돈까스', emoji: '🍱' },
  { name: '샤브샤브', emoji: '🫕' },
]

export default function Analyzing({ onFinished }) {
  const [tickerIndex, setTickerIndex] = useState(0)
  const [statusText, setStatusText] = useState('취향 분석 중...')
  const [subText, setSubText] = useState('오늘의 메뉴 후보를 고르고 있어요.')
  const [isFound, setIsFound] = useState(false)

  // 음식 아이콘/이름 롤링
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % SAMPLE_FOODS.length)
    }, 140)
    return () => clearInterval(interval)
  }, [])

  // 분석 시퀀스 연출
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatusText('가장 적합한 후보를 선정하고 있어요...')
      setSubText('예산과 맵기, 든든함을 꼼꼼히 계산 중!')
    }, 900)

    const timer2 = setTimeout(() => {
      setIsFound(true)
      setStatusText('당신에게 어울리는 메뉴 6개를 찾았어요!')
      setSubText('지금 후보 목록을 확인해보세요!')
    }, 1900)

    const timer3 = setTimeout(() => {
      onFinished()
    }, 2800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onFinished])

  const currentSample = SAMPLE_FOODS[tickerIndex]

  return (
    <div className="analyzing-container">
      <div className={`analyzing-graphic-box ${isFound ? 'found-mode' : ''}`}>
        {!isFound ? (
          <div className="analyzing-ticker">
            <div className="ticker-emoji">{currentSample.emoji}</div>
            <div className="ticker-name">{currentSample.name}</div>
            <div className="analyzing-spinner-ring" />
          </div>
        ) : (
          <div className="analyzing-success animate-pop">
            <span className="success-icon">🎉</span>
            <span className="success-number">TOP 6</span>
          </div>
        )}
      </div>

      <div className="analyzing-text-area">
        <h2 className="analyzing-title">{statusText}</h2>
        <p className="analyzing-sub">{subText}</p>
      </div>

      <div className="analyzing-progress-bar">
        <div className={`analyzing-progress-inner ${isFound ? 'complete' : ''}`} />
      </div>
    </div>
  )
}
