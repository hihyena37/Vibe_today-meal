export default function ProgressBar({ current, total, onPrev }) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="progress-header">
      <div className="progress-nav">
        {onPrev ? (
          <button
            type="button"
            className="btn-back"
            onClick={onPrev}
            aria-label="이전 질문으로 이동"
          >
            <span className="back-arrow">←</span>
            <span className="back-text">이전</span>
          </button>
        ) : (
          <div className="back-placeholder" />
        )}

        <div className="progress-step-pill">
          <span className="step-current">{current}</span>
          <span className="step-divider">/</span>
          <span className="step-total">{total}</span>
        </div>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
