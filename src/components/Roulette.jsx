import { useState, useRef, useEffect, useCallback } from 'react'

// 후보는 최대 6개이므로 6색이면 이웃 슬라이스 색이 겹치지 않는다
const SLICE_PALETTE = [
  { bg: '#FF5722', fg: '#FFFFFF' },
  { bg: '#FFE1D2', fg: '#B23A12' },
  { bg: '#1D2129', fg: '#FFFFFF' },
  { bg: '#FFC24B', fg: '#3D2B00' },
  { bg: '#2F7D5B', fg: '#FFFFFF' },
  { bg: '#FFF6EA', fg: '#1D2129' },
]

const CANVAS_SIZE = 360
const POINTER_DEG = 270 // 캔버스 각도 기준 12시 방향 (0도 = 3시, 시계방향 증가)
const SPIN_DURATION_MS = 5200
const SPIN_EASING = 'cubic-bezier(0.15, 0.85, 0.25, 1)' // 빠르게 출발 → 길게 감속

const normalizeDeg = (deg) => ((deg % 360) + 360) % 360

/**
 * 현재 회전 각도에서 12시 포인터 아래에 있는 슬라이스 인덱스
 * 휠을 시계방향으로 rotation만큼 돌리면, 포인터 아래에는
 * 휠 기준 (POINTER_DEG - rotation) 각도의 지점이 온다.
 */
function getIndexAtPointer(rotation, itemCount) {
  const sliceDeg = 360 / itemCount
  const localDeg = normalizeDeg(POINTER_DEG - rotation)
  return Math.floor(localDeg / sliceDeg) % itemCount
}

// 룰렛에 들어갈 짧은 이름: 괄호 설명 제거
const toWheelLabel = (name) => name.replace(/\s*\(.*?\)\s*/g, '').trim()

export default function Roulette({
  items = [],
  onSpinStart,
  onSpinEnd,
}) {
  const canvasRef = useRef(null)
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerIndex, setWinnerIndex] = useState(null)
  const rotationRef = useRef(0)
  const spinningRef = useRef(false) // 같은 프레임 안의 연타까지 막기 위한 동기 플래그
  const fallbackTimerRef = useRef(null)

  const numItems = items.length
  const sliceDeg = 360 / (numItems || 1)

  // Canvas에 룰렛 그리기 (highlightIndex가 있으면 나머지 슬라이스를 흐리게)
  const drawRoulette = useCallback((highlightIndex = null) => {
    const canvas = canvasRef.current
    if (!canvas || numItems === 0) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const size = CANVAS_SIZE

    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const center = size / 2
    const radius = size / 2 - 6
    const innerRadius = 46 // 중앙 GO 버튼 영역
    const sliceRad = (2 * Math.PI) / numItems

    ctx.clearRect(0, 0, size, size)

    items.forEach((item, index) => {
      const palette = SLICE_PALETTE[index % SLICE_PALETTE.length]
      const startAngle = index * sliceRad
      const endAngle = startAngle + sliceRad

      // 슬라이스
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = palette.bg
      ctx.fill()
      ctx.strokeStyle = '#1D2129'
      ctx.lineWidth = 2
      ctx.stroke()

      // 이모지 + 이름 (슬라이스 중앙선을 따라 바깥쪽부터)
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + sliceRad / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = palette.fg

      const textEnd = radius - 20
      const maxTextWidth = textEnd - innerRadius - 34 // 이모지 공간 제외

      ctx.font = '22px sans-serif'
      ctx.fillText(item.emoji || '🍴', textEnd, 0)

      let label = toWheelLabel(item.name)
      let fontSize = 17
      ctx.font = `800 ${fontSize}px Pretendard, sans-serif`
      while (ctx.measureText(label).width > maxTextWidth && fontSize > 12) {
        fontSize -= 1
        ctx.font = `800 ${fontSize}px Pretendard, sans-serif`
      }
      while (ctx.measureText(label).width > maxTextWidth && label.length > 2) {
        label = label.slice(0, -2) + '…'
      }
      ctx.fillText(label, textEnd - 32, 1)
      ctx.restore()

      // 당첨 슬라이스 외에는 흐리게
      if (highlightIndex !== null && highlightIndex !== index) {
        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.arc(center, center, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = 'rgba(250, 247, 242, 0.62)'
        ctx.fill()
      }
    })

    // 바깥 테두리 링 + 도트
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = '#1D2129'
    ctx.lineWidth = 8
    ctx.stroke()

    const dotCount = 24
    for (let i = 0; i < dotCount; i++) {
      const angle = (i * 2 * Math.PI) / dotCount
      ctx.beginPath()
      ctx.arc(center + radius * Math.cos(angle), center + radius * Math.sin(angle), 2, 0, 2 * Math.PI)
      ctx.fillStyle = '#FFF6EA'
      ctx.fill()
    }
  }, [items, numItems])

  useEffect(() => {
    drawRoulette(winnerIndex)
  }, [drawRoulette, winnerIndex])

  // 웹폰트(Pretendard)가 늦게 로드되면 다시 그리기
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) drawRoulette(winnerIndex)
    })
    return () => {
      cancelled = true
    }
  }, [drawRoulette, winnerIndex])

  useEffect(() => () => clearTimeout(fallbackTimerRef.current), [])

  // 회전 종료 처리: 실제 최종 각도에서 포인터 아래 슬라이스를 계산해 결과로 사용
  const finishSpin = () => {
    if (!spinningRef.current) return
    spinningRef.current = false
    clearTimeout(fallbackTimerRef.current)

    const landedIndex = getIndexAtPointer(rotationRef.current, numItems)
    setIsSpinning(false)
    setWinnerIndex(landedIndex)
    if (onSpinEnd) onSpinEnd(items[landedIndex])
  }

  const spin = () => {
    if (spinningRef.current || numItems < 2) return
    spinningRef.current = true

    setIsSpinning(true)
    setWinnerIndex(null)
    if (onSpinStart) onSpinStart()

    // 1. 당첨 인덱스를 균등 확률로 선택
    const targetIndex = Math.floor(Math.random() * numItems)

    // 2. 슬라이스 안에서도 매번 다른 위치에 멈추도록 중앙 기준 ±35% 오프셋
    //    (경계선 근처는 피해서 어느 칸인지 눈으로도 명확하게)
    const offsetInSlice = (Math.random() - 0.5) * sliceDeg * 0.7
    const targetLocalDeg = targetIndex * sliceDeg + sliceDeg / 2 + offsetInSlice

    // 3. 포인터(270도) 아래에 targetLocalDeg가 오도록 하는 회전값
    const targetMod = normalizeDeg(POINTER_DEG - targetLocalDeg)
    const currentRot = rotationRef.current
    const diff = normalizeDeg(targetMod - normalizeDeg(currentRot))

    // 4. 최소 6바퀴 + 0~2바퀴 랜덤 추가 회전
    const extraSpins = 6 + Math.floor(Math.random() * 3)
    const nextRotation = currentRot + 360 * extraSpins + diff

    rotationRef.current = nextRotation
    setRotation(nextRotation)

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40)
    }

    // transitionend가 누락되는 환경(탭 전환 등)을 위한 안전장치
    fallbackTimerRef.current = setTimeout(finishSpin, SPIN_DURATION_MS + 400)
  }

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
    finishSpin()
  }

  return (
    <div className={`roulette-wrapper ${winnerIndex !== null ? 'is-landed' : ''}`}>
      {/* 12시 방향 상단 핀 인디케이터 */}
      <div className="roulette-pointer-container" aria-hidden="true">
        <div className="roulette-pointer-arrow" />
      </div>

      {/* 룰렛 휠 본체 */}
      <div
        className="roulette-wheel-container"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? `transform ${SPIN_DURATION_MS}ms ${SPIN_EASING}`
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <canvas
          ref={canvasRef}
          className="roulette-canvas"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 중앙 원형 GO 버튼 */}
      <button
        type="button"
        className={`roulette-center-btn ${isSpinning ? 'spinning' : ''}`}
        onClick={spin}
        disabled={isSpinning || winnerIndex !== null || numItems < 2}
        aria-label={isSpinning ? '룰렛 회전 중' : '룰렛 돌리기'}
      >
        <div className="center-btn-inner">
          <span className="center-btn-text">{isSpinning ? '···' : 'GO'}</span>
        </div>
      </button>
    </div>
  )
}
