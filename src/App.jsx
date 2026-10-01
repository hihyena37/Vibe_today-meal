import { useState, useCallback, useEffect } from 'react'
import Intro from './pages/Intro.jsx'
import Quiz from './pages/Quiz.jsx'
import Analyzing from './pages/Analyzing.jsx'
import Candidates from './pages/Candidates.jsx'
import RoulettePage from './pages/RoulettePage.jsx'
import Result from './pages/Result.jsx'
import { QUESTIONS } from './data/questions.js'
import { getRecommendedFoods } from './utils/recommendation.js'
import { loadSavedSettings, saveSettings, clearSavedSettings } from './utils/storage.js'
import './App.css'

// 아직 고르지 않은 질문은 null
// location: null(미답변) | ''(지역 없이) | '성수동' 등
const EMPTY_ANSWERS = {
  mealTime: null,
  party: null,
  budget: null,
  location: null,
  spicy: null,
  soup: null,
  fullness: null,
}

// 이 기기에 저장한 식비·지역이 있으면 미리 채워둠 (질문 단계에서 '다음'으로 확정)
const createInitialAnswers = (saved) => ({ ...EMPTY_ANSWERS, ...saved })

const REMEMBERED_KEYS = ['budget', 'location']

export default function App() {
  // 현재 단계: 'intro' | 'quiz' | 'analyzing' | 'candidates' | 'roulette' | 'result'
  const [step, setStep] = useState('intro')

  // '이 기기에서 식비와 지역 기억하기' 상태
  const [savedSettings, setSavedSettings] = useState(loadSavedSettings)
  const [rememberSettings, setRememberSettings] = useState(() => savedSettings !== null)

  // 질문 응답 상태
  const [answers, setAnswers] = useState(() => createInitialAnswers(savedSettings))

  // 질문 화면을 몇 번째 질문부터 보여줄지 (조건 수정 시 활용)
  const [quizStartIndex, setQuizStartIndex] = useState(0)

  // 추천 후보 목록
  const [candidates, setCandidates] = useState([])

  // 최종 선정된 음식
  const [selectedFood, setSelectedFood] = useState(null)

  // 기억하기를 선택한 경우에만 호출: 식비·지역만 저장
  const persistSettings = (nextAnswers) => {
    setSavedSettings(saveSettings({ budget: nextAnswers.budget, location: nextAnswers.location }))
  }

  // 1. 시작하기
  const handleStart = () => {
    setQuizStartIndex(0)
    setStep('quiz')
  }

  // 2. 퀴즈 답변 변경
  const handleAnswerChange = (key, value) => {
    const nextAnswers = { ...answers, [key]: value }
    setAnswers(nextAnswers)
    if (rememberSettings && REMEMBERED_KEYS.includes(key)) {
      persistSettings(nextAnswers)
    }
  }

  // 기억하기 체크 변경: 켜면 현재 식비·지역 저장, 끄면 저장된 값 삭제
  const handleRememberChange = (checked) => {
    setRememberSettings(checked)
    if (checked) {
      persistSettings(answers)
    } else {
      clearSavedSettings()
      setSavedSettings(null)
    }
  }

  // 저장한 설정 지우기 (현재 진행 중인 답변은 유지)
  const handleClearSaved = () => {
    clearSavedSettings()
    setSavedSettings(null)
    setRememberSettings(false)
  }

  // 3. 퀴즈 완료 -> 분석 화면으로 전환 & 추천 계산
  // 마지막 답변은 setState 직후라 아직 answers에 반영되지 않았을 수 있으므로
  // Quiz에서 최종 답변 객체를 직접 받아 계산한다.
  const handleQuizComplete = (finalAnswers) => {
    setAnswers(finalAnswers)
    setCandidates(getRecommendedFoods(finalAnswers))
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

  // 5. 후보 음식에서 제외하기 (룰렛용 최소 2개 유지)
  const handleRemoveFood = (foodId) => {
    if (candidates.length <= 2) return

    setCandidates((prev) => prev.filter((item) => item.id !== foodId))
  }

  // 6. 후보 확정 후 룰렛 페이지로 이동
  const handleProceedToRoulette = () => {
    setStep('roulette')
  }

  // 6-1. 조건에 맞는 후보가 1개뿐이면 룰렛 없이 바로 선택
  const handleChooseSingle = (food) => {
    setSelectedFood(food)
    setStep('result')
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

  // 9. 조건 수정: 기존 답변을 유지한 채 질문 단계로 (startKey가 있으면 해당 질문부터)
  const handleEditConditions = (startKey) => {
    const index = QUESTIONS.findIndex((question) => question.key === startKey)
    setQuizStartIndex(index >= 0 ? index : 0)
    setSelectedFood(null)
    setStep('quiz')
  }

  // 10. 처음부터 다시: 질문 답변 초기화 (기억하기를 켠 경우 저장된 식비·지역만 다시 채움)
  const handleRestart = () => {
    setAnswers(createInitialAnswers(rememberSettings ? savedSettings : null))
    setCandidates([])
    setSelectedFood(null)
    setQuizStartIndex(0)
    setStep('quiz')
  }

  // 후보·결과 화면에서 지역만 바로 수정
  const handleLocationChange = (location) => {
    handleAnswerChange('location', location)
  }

  // 홈으로 가기 (Intro)
  const handleBackToIntro = () => {
    setStep('intro')
  }

  return (
    <div className="app-layout">
      {/* 상단 네비게이션 헤더 */}
      <header className={`app-nav${step === 'intro' ? ' app-nav-intro' : ''}`}>
        <button
          type="button"
          className="brand-logo"
          onClick={handleBackToIntro}
          aria-label="오늘 뭐 먹지 홈으로 이동"
        >
          <span className="logo-emoji">🍽️</span>
          <span className="logo-text">
            오늘 뭐 <span>먹지?</span>
          </span>
        </button>

        {step !== 'intro' && (
          <div className="nav-step-indicator">
            {step === 'quiz' && '1. 조건 질문'}
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
          <Intro
            onStart={handleStart}
            savedSettings={savedSettings}
            onClearSaved={handleClearSaved}
          />
        )}

        {step === 'quiz' && (
          <Quiz
            answers={answers}
            initialIndex={quizStartIndex}
            onAnswerChange={handleAnswerChange}
            onComplete={handleQuizComplete}
            onBackToIntro={handleBackToIntro}
            rememberSettings={rememberSettings}
            onRememberChange={handleRememberChange}
            hasSavedSettings={savedSettings !== null}
            onClearSaved={handleClearSaved}
          />
        )}

        {step === 'analyzing' && (
          <Analyzing count={candidates.length} onFinished={handleAnalysisFinish} />
        )}

        {step === 'candidates' && (
          <Candidates
            candidates={candidates}
            answers={answers}
            rememberSettings={rememberSettings}
            onRemoveFood={handleRemoveFood}
            onProceedToRoulette={handleProceedToRoulette}
            onChooseSingle={handleChooseSingle}
            onEditConditions={handleEditConditions}
            onRestart={handleRestart}
            onLocationChange={handleLocationChange}
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
            rememberSettings={rememberSettings}
            canReSpin={candidates.length >= 2}
            onReSpin={handleReSpin}
            onEditConditions={handleEditConditions}
            onRestart={handleRestart}
            onLocationChange={handleLocationChange}
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
