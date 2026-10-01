import { useState, useRef } from 'react'
import {
  NO_BUDGET_LIMIT,
  isUnlimitedBudget,
  formatWon,
  formatBudgetInputText,
  parseBudgetInput,
} from '../utils/budget.js'

/**
 * 1인당 식비 직접 입력 질문
 * - 입력 중에는 자동으로 넘어가지 않고 '다음' 버튼이나 Enter로만 확정
 * - 빠른 입력 버튼은 입력창을 채우기만 함
 */
export default function BudgetQuestion({ question, value, onSubmit }) {
  const [text, setText] = useState(typeof value === 'number' ? formatBudgetInputText(String(value)) : '')
  const [isUnlimited, setIsUnlimited] = useState(isUnlimitedBudget(value))
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef(null)

  const { value: parsedValue, error } = parseBudgetInput(text)
  // 빈 값 안내는 '다음'을 눌렀을 때만, 소수·음수 같은 잘못된 문자는 입력 즉시 안내
  const visibleError = isUnlimited ? '' : submitted || text !== '' ? error : ''

  const handleChange = (e) => {
    setText(formatBudgetInputText(e.target.value))
    setIsUnlimited(false)
  }

  const handleQuickAmount = (amount) => {
    setText(formatBudgetInputText(String(amount)))
    setIsUnlimited(false)
    setSubmitted(false)
    inputRef.current?.focus()
  }

  const handleToggleUnlimited = () => {
    setIsUnlimited((prev) => !prev)
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isUnlimited) {
      onSubmit(NO_BUDGET_LIMIT)
      return
    }
    if (error) {
      setSubmitted(true)
      inputRef.current?.focus()
      return
    }
    onSubmit(parsedValue)
  }

  return (
    <form className="question-card-container" onSubmit={handleSubmit} noValidate>
      <div className="question-header">
        <span className="question-badge">Q{question.id}</span>
        <h2 className="question-title">{question.title}</h2>
        {question.subtitle && <p className="question-subtitle">{question.subtitle}</p>}
      </div>

      <label className="field-label" htmlFor="budget-input">1인당 식비</label>
      <div className={`amount-field ${visibleError ? 'has-error' : ''} ${isUnlimited ? 'is-muted' : ''}`}>
        <input
          ref={inputRef}
          id="budget-input"
          className="amount-input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="예: 12,000"
          value={text}
          onChange={handleChange}
          aria-invalid={Boolean(visibleError)}
          aria-describedby="budget-help budget-error"
          autoFocus={!isUnlimited}
        />
        <span className="amount-unit" aria-hidden="true">원</span>
      </div>
      <p id="budget-error" className="field-error" role="alert">
        {visibleError}
      </p>
      <p id="budget-help" className="field-help">
        8,500원, 13,500원처럼 원하는 금액을 그대로 입력할 수 있어요.
      </p>

      <div className="quick-amounts" role="group" aria-label="빠른 금액 입력">
        {question.quickAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            className={`chip-btn ${!isUnlimited && parsedValue === amount ? 'is-active' : ''}`}
            onClick={() => handleQuickAmount(amount)}
          >
            {formatWon(amount)}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`option-btn unlimited-option ${isUnlimited ? 'selected' : ''}`}
        aria-pressed={isUnlimited}
        onClick={handleToggleUnlimited}
      >
        <div className="option-icon-wrapper">
          <span className="option-icon" aria-hidden="true">✨</span>
        </div>
        <div className="option-text-wrapper">
          <span className="option-label">가격 상관없음</span>
          <span className="option-desc">오늘은 가격 보지 않고 메뉴만 골라볼게요</span>
        </div>
        <div className="option-check-circle" aria-hidden="true">
          <span className="check-mark">✓</span>
        </div>
      </button>

      <button type="submit" className="btn-primary btn-large">
        다음 <span className="btn-icon">→</span>
      </button>
    </form>
  )
}
