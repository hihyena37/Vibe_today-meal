import { useState } from 'react'
import { MAX_LOCATION_LENGTH, normalizeLocation } from '../utils/storage.js'

/**
 * 식사 지역 질문 + '이 기기에서 기억하기' 설정
 * 지역은 결과 화면의 지도 검색어로만 쓰이며, 이 사이트가 주변 식당을 직접 검색하지 않는다.
 */
export default function LocationQuestion({
  question,
  value,
  onSubmit,
  rememberSettings,
  onRememberChange,
  hasSavedSettings,
  onClearSaved,
}) {
  const [text, setText] = useState(value || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const location = normalizeLocation(text)
    if (!location) {
      setError("지역을 입력하거나 '지역 없이 메뉴만 추천받기'를 눌러주세요.")
      return
    }
    onSubmit(location)
  }

  return (
    <form className="question-card-container" onSubmit={handleSubmit} noValidate>
      <div className="question-header">
        <span className="question-badge">Q{question.id}</span>
        <h2 className="question-title">{question.title}</h2>
        {question.subtitle && <p className="question-subtitle">{question.subtitle}</p>}
      </div>

      <label className="field-label" htmlFor="location-input">동네 또는 역 이름</label>
      <div className={`text-field ${error ? 'has-error' : ''}`}>
        <span className="text-field-icon" aria-hidden="true">📍</span>
        <input
          id="location-input"
          className="text-input"
          type="text"
          autoComplete="off"
          enterKeyHint="next"
          placeholder="예: 강남역, 성수동, 판교역"
          maxLength={MAX_LOCATION_LENGTH}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby="location-help location-error"
          autoFocus
        />
      </div>
      <p id="location-error" className="field-error" role="alert">
        {error}
      </p>
      <p id="location-help" className="field-help">
        입력한 지역은 결과 화면의 지도 검색어로만 쓰여요. 이 사이트가 주변 식당을 직접 찾지는 않아요.
      </p>

      <div className="question-actions">
        <button type="submit" className="btn-primary btn-large">
          이 지역으로 다음 <span className="btn-icon">→</span>
        </button>
        <button type="button" className="btn-secondary btn-large" onClick={() => onSubmit('')}>
          지역 없이 메뉴만 추천받기
        </button>
      </div>

      <div className="remember-box">
        <label className="remember-check">
          <input
            type="checkbox"
            checked={rememberSettings}
            onChange={(e) => onRememberChange(e.target.checked)}
          />
          <span>
            <strong>이 기기에서 식비와 지역 기억하기</strong>
            <small>이 브라우저에만 저장되고, 다음 방문 때 자동으로 채워져요. 위치 좌표는 저장하지 않아요.</small>
          </span>
        </label>
        {hasSavedSettings && (
          <button type="button" className="text-btn" onClick={onClearSaved}>
            저장한 설정 지우기
          </button>
        )}
      </div>
    </form>
  )
}
