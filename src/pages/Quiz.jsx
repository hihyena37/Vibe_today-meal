import { useState, useRef, useEffect } from 'react'
import { QUESTIONS } from '../data/questions.js'
import ProgressBar from '../components/ProgressBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import BudgetQuestion from '../components/BudgetQuestion.jsx'
import LocationQuestion from '../components/LocationQuestion.jsx'

export default function Quiz({
  answers,
  initialIndex = 0,
  onAnswerChange,
  onComplete,
  onBackToIntro,
  rememberSettings,
  onRememberChange,
  hasSavedSettings,
  onClearSaved,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef(null)

  const currentQuestion = QUESTIONS[currentIndex]
  const currentKey = currentQuestion.key
  const selectedValue = answers[currentKey]
  const isAnswered = selectedValue !== null && selectedValue !== undefined
  const isLast = currentIndex === QUESTIONS.length - 1
  // 직접 입력 질문은 자체 '다음' 버튼(또는 Enter)으로만 확정
  const isInputQuestion = Boolean(currentQuestion.type)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const goNext = (finalAnswers) => {
    if (isLast) {
      onComplete(finalAnswers)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleSelectOption = (value) => {
    if (isTransitioning) return

    // 답변 저장
    onAnswerChange(currentKey, value)
    setIsTransitioning(true)

    // 클로저의 answers는 이전 값이므로 방금 고른 값을 합쳐서 넘긴다
    const finalAnswers = { ...answers, [currentKey]: value }

    // 약간의 딜레이로 선택 피드백 제공 후 다음 단계 전환
    timerRef.current = setTimeout(() => {
      setIsTransitioning(false)
      goNext(finalAnswers)
    }, 280)
  }

  // 직접 입력 질문 확정 (검증은 각 입력 컴포넌트에서 끝난 상태)
  const handleSubmitInput = (value) => {
    if (isTransitioning) return
    onAnswerChange(currentKey, value)
    goNext({ ...answers, [currentKey]: value })
  }

  const handleNext = () => {
    if (isTransitioning || !isAnswered) return
    goNext(answers)
  }

  const handlePrev = () => {
    if (isTransitioning) return
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    } else {
      onBackToIntro()
    }
  }

  const renderQuestion = () => {
    if (currentQuestion.type === 'budget') {
      return (
        <BudgetQuestion
          question={currentQuestion}
          value={selectedValue}
          onSubmit={handleSubmitInput}
        />
      )
    }

    if (currentQuestion.type === 'location') {
      return (
        <LocationQuestion
          question={currentQuestion}
          value={selectedValue}
          onSubmit={handleSubmitInput}
          rememberSettings={rememberSettings}
          onRememberChange={onRememberChange}
          hasSavedSettings={hasSavedSettings}
          onClearSaved={onClearSaved}
        />
      )
    }

    return (
      <QuestionCard
        question={currentQuestion}
        selectedValue={selectedValue}
        onSelect={handleSelectOption}
      />
    )
  }

  return (
    <div className="quiz-container">
      <ProgressBar
        current={currentIndex + 1}
        total={QUESTIONS.length}
        onPrev={handlePrev}
      />

      <div className={`quiz-body ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="question-enter" key={currentQuestion.id}>
          {renderQuestion()}
        </div>
      </div>

      {/* 이전 질문으로 돌아온 경우, 기존 답변 그대로 넘어갈 수 있도록 */}
      {!isInputQuestion && isAnswered && !isTransitioning && (
        <button
          type="button"
          className="btn-secondary btn-large quiz-next-btn animate-fade-in"
          onClick={handleNext}
        >
          {isLast ? '이 답변으로 메뉴 추천받기' : '이 답변 유지하고 다음으로'}
          <span className="btn-icon">→</span>
        </button>
      )}
    </div>
  )
}
