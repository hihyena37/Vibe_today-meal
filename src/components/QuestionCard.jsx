export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
}) {
  return (
    <div className="question-card-container">
      <div className="question-header">
        <span className="question-badge">Q{question.id}</span>
        <h2 className="question-title">{question.title}</h2>
        {question.subtitle && (
          <p className="question-subtitle">{question.subtitle}</p>
        )}
      </div>

      <div className="options-grid" role="radiogroup" aria-label={question.title}>
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`option-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(option.value)}
            >
              <div className="option-icon-wrapper">
                <span className="option-icon" aria-hidden="true">
                  {option.icon}
                </span>
              </div>
              <div className="option-text-wrapper">
                <span className="option-label">{option.label}</span>
                {option.desc && (
                  <span className="option-desc">{option.desc}</span>
                )}
              </div>
              <div className="option-check-circle" aria-hidden="true">
                <span className="check-mark">✓</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
