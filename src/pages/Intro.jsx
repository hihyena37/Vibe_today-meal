export default function Intro({ onStart }) {
  const floatingFoods = [
    { emoji: '🍕', style: { top: '12%', left: '8%', animationDelay: '0s' } },
    { emoji: '🍜', style: { top: '18%', right: '10%', animationDelay: '0.8s' } },
    { emoji: '🍣', style: { bottom: '22%', left: '12%', animationDelay: '1.4s' } },
    { emoji: '🍔', style: { bottom: '15%', right: '8%', animationDelay: '0.4s' } },
    { emoji: '🍲', style: { top: '48%', left: '5%', animationDelay: '1.8s' } },
    { emoji: '🍗', style: { top: '52%', right: '6%', animationDelay: '1.2s' } },
  ]

  return (
    <div className="intro-container">
      {/* 플로팅 음식 장식 */}
      <div className="floating-decorations" aria-hidden="true">
        {floatingFoods.map((item, idx) => (
          <div
            key={idx}
            className="floating-food-item"
            style={item.style}
          >
            <span>{item.emoji}</span>
          </div>
        ))}
      </div>

      <div className="intro-content">
        <div className="intro-pill">
          <span className="pill-dot"></span>
          <span>고민 끝! 맞춤 식사 가이드</span>
        </div>

        <h1 className="intro-title">
          오늘 뭐 <span className="highlight-text">먹지?</span>
        </h1>

        <p className="intro-subtitle">
          고민은 짧게, 한 끼는 맛있게.<br />
          몇 가지만 고르면 오늘 메뉴를 골라드려요.
        </p>

        <div className="intro-feature-cards">
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <div className="feature-text">
              <strong>취향 맞춤 분석</strong>
              <small>예산·맵기·국물 취향 반영</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <div className="feature-text">
              <strong>점수 기반 추천</strong>
              <small>단순 랜덤 NO, 최적 후보 선정</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎡</span>
            <div className="feature-text">
              <strong>스릴만점 룰렛</strong>
              <small>마지막 한 방의 짜릿한 결정</small>
            </div>
          </div>
        </div>

        <div className="intro-action">
          <button
            type="button"
            className="btn-primary btn-hero"
            onClick={onStart}
          >
            <span>메뉴 고르러 가기</span>
            <span className="btn-icon">→</span>
          </button>
          <p className="intro-note">약 30초면 오늘 메뉴 고민이 끝납니다</p>
        </div>
      </div>
    </div>
  )
}
