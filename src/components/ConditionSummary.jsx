import { useState } from 'react'
import { formatBudgetLabel } from '../utils/budget.js'
import { MAX_LOCATION_LENGTH, normalizeLocation } from '../utils/storage.js'

const PREFERENCE_LABELS = {
  mealTime: { breakfast: '아침', lunch: '점심', dinner: '저녁', lateNight: '야식' },
  party: { solo: '혼밥', friend: '친구·연인', colleague: '직장 동료', group: '여러 명' },
  spicy: { 0: '안 매운 메뉴만', 1: '조금 매운 맛까지', 2: '매운 맛 좋아함' },
  soup: { yes: '국물 필수', any: '국물 상관없음', no: '국물 없이' },
  fullness: { 1: '가볍게', 2: '적당히', 3: '든든하게' },
}

const getPreferenceLabels = (answers) =>
  Object.keys(PREFERENCE_LABELS)
    .map((key) => PREFERENCE_LABELS[key][answers[key]])
    .filter(Boolean)

/**
 * 후보·결과 화면 상단의 조건 요약 (지역은 이 자리에서 바로 수정 가능)
 */
export default function ConditionSummary({ answers, onLocationChange, rememberSettings }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const location = answers.location || ''

  const startEditing = () => {
    setDraft(location)
    setIsEditing(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    onLocationChange(normalizeLocation(draft))
    setIsEditing(false)
  }

  return (
    <section className="condition-summary" aria-label="내 조건 요약">
      <div className="summary-row">
        <span className="summary-label">📍 지역</span>
        {isEditing ? (
          <form className="summary-location-form" onSubmit={handleSave}>
            <input
              className="text-input summary-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="예: 강남역, 성수동"
              maxLength={MAX_LOCATION_LENGTH}
              aria-label="식사 지역"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsEditing(false)
              }}
            />
            <div className="summary-form-actions">
              <button type="submit" className="chip-btn is-active">저장</button>
              <button type="button" className="chip-btn" onClick={() => setIsEditing(false)}>취소</button>
            </div>
          </form>
        ) : (
          <div className="summary-value-wrap">
            <span className={`summary-value ${location ? '' : 'is-empty'}`}>
              {location || '지역 미설정 (메뉴만 추천)'}
            </span>
            <button type="button" className="text-btn" onClick={startEditing}>
              {location ? '수정' : '지역 추가'}
            </button>
            {location && (
              <button type="button" className="text-btn" onClick={() => onLocationChange('')}>
                지우기
              </button>
            )}
          </div>
        )}
      </div>

      <div className="summary-row">
        <span className="summary-label">💰 1인당 예산</span>
        <span className="summary-value">{formatBudgetLabel(answers.budget)}</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">😋 취향</span>
        <ul className="summary-chips">
          {getPreferenceLabels(answers).map((label) => (
            <li key={label} className="summary-chip">{label}</li>
          ))}
        </ul>
      </div>

      {rememberSettings && (
        <p className="summary-note">💾 이 기기에 식비와 지역을 기억하고 있어요.</p>
      )}
    </section>
  )
}
