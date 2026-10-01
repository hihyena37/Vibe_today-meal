import { useState, useCallback, useEffect } from 'react'
import Intro from './pages/Intro.jsx'
import Quiz from './pages/Quiz.jsx'
import Analyzing from './pages/Analyzing.jsx'
import Candidates from './pages/Candidates.jsx'
import RoulettePage from './pages/RoulettePage.jsx'
import Result from './pages/Result.jsx'
import { getRecommendedFoods } from './utils/recommendation.js'
import './App.css'

export default function App() {
  // 현재 단계: 'intro' | 'quiz' | 'analyzing' | 'candidates' | 'roulette' | 'result'
  const [step, setStep] = useState('intro')

  // 질문 응답 상태 (아직 고르지 않은 질문은 null)
  const [answers, setAnswers] = useState({
    mealTime: null,
    party: null,
    budget: null,
    spicy: null,
    soup: null,
    fullness: null,
  })

  // 추천 후보 목록
  const [candidates, setCandidates] = useState([])

  // 최종 선정된 음식
  const [selectedFood, setSelectedFood] = useState(null)

  // 1. 시작하기
  const handleStart = () => {
    setStep('quiz')
  }

  // 2. 퀴즈 답변 변경
  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // 3. 퀴즈 완료 -> 분석 화면으로 전환 & 추천 계산
  // 마지막 답변은 setState 직후라 아직 answers에 반영되지 않았을 수 있으므로
  // Quiz에서 최종 답변 객체를 직접 받아 계산한다.
  const handleQuizComplete = (finalAnswers) => {
    setAnswers(finalAnswers)
    setCandidates(getRecommendedFoods(finalAnswers, [], 6))
    setSelectedFood(null)
    setStep('analyzing')
  }

  // 4. 분석 화면 완료 연출 -> 후보 음식 확인 단계
  // (Analyzing의 타이머 effect가 재시작되지 않도록 참조를 고정)
  const handleAnalysisFinish = useCallback(() => {
    setStep('candidates')
  }, [])

  // 단계가 바뀌면 화면 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  // 5. 후보 음식에서 제외하기 (최소 2개 유지)
  const handleRemoveFood = (foodId) => {
    if (candidates.length <= 2) return

    setCandidates((prev) => prev.filter((item) => item.id !== foodId))
  }

  // 6. 후보 확정 후 룰렛 페이지로 이동
  const handleProceedToRoulette = () => {
    setStep('roulette')
  }

  // 7. 룰렛 완료 후 최종 결과 페이지로 이동
  const handleRouletteComplete = (food) => {
    setSelectedFood(food)
    setStep('result')
  }

  // 8. 한 번 더 돌리기 (현재 후보 유지)
  const handleReSpin = () => {
    setStep('roulette')
  }

  // 9. 조건 다시 선택하기 (질문 단계로 리셋)
  const handleResetQuiz = () => {
    setStep('quiz')
    setSelectedFood(null)
  }

  // 홈으로 가기 (Intro)
  const handleBackToIntro = () => {
    setStep('intro')
  }

  return (
    <div className="app-layout">
      {/* 상단 네비게이션 헤더 */}
      <header className="app-nav">
        <button
          type="button"
          className="brand-logo"
          onClick={handleBackToIntro}
          aria-label="오늘 뭐 먹지 홈으로 이동"
        >
          <span className="logo-emoji">🍽️</span>
          <span className="logo-text">오늘 뭐 먹지?</span>
        </button>

        {step !== 'intro' && (
          <div className="nav-step-indicator">
            {step === 'quiz' && '1. 취향 질문'}
            {step === 'analyzing' && '2. 메뉴 분석'}
            {step === 'candidates' && '3. 후보 확인'}
            {step === 'roulette' && '4. 룰렛 결정'}
            {step === 'result' && '5. 추천 결과'}
          </div>
        )}
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="app-main-content page-transition" key={step}>
        {step === 'intro' && (
          <Intro onStart={handleStart} />
        )}

        {step === 'quiz' && (
          <Quiz
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onComplete={handleQuizComplete}
            onBackToIntro={handleBackToIntro}
          />
        )}

        {step === 'analyzing' && (
          <Analyzing onFinished={handleAnalysisFinish} />
        )}

        {step === 'candidates' && (
          <Candidates
            candidates={candidates}
            onRemoveFood={handleRemoveFood}
            onProceedToRoulette={handleProceedToRoulette}
          />
        )}

        {step === 'roulette' && (
          <RoulettePage
            candidates={candidates}
            onComplete={handleRouletteComplete}
          />
        )}

        {step === 'result' && selectedFood && (
          <Result
            food={selectedFood}
            answers={answers}
            onReSpin={handleReSpin}
            onResetQuiz={handleResetQuiz}
          />
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="app-footer">
        <p>© 2026 오늘 뭐 먹지? · 고민 없이 즐기는 스마트한 한 끼 가이드</p>
      </footer>
    </div>
  )
}
