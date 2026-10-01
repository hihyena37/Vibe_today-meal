import { isValidBudget } from './budget.js'

// 사용자가 '이 기기에서 기억하기'를 선택한 경우에만 사용
// 1인당 식비와 사용자가 직접 입력한 지역 이름만 저장한다 (위치 좌표는 저장하지 않음)
const STORAGE_KEY = 'today-meal:settings'

export const MAX_LOCATION_LENGTH = 30

// 앞뒤 공백 제거 + 연속 공백 정리
export const normalizeLocation = (text) => text.trim().replace(/\s+/g, ' ')

const isValidLocation = (location) =>
  typeof location === 'string' && location.length <= MAX_LOCATION_LENGTH

/**
 * @returns {{ budget?: number|string, location?: string } | null}
 */
export function loadSavedSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const settings = {}
    if (isValidBudget(parsed?.budget)) settings.budget = parsed.budget
    if (isValidLocation(parsed?.location)) settings.location = parsed.location

    return Object.keys(settings).length > 0 ? settings : null
  } catch {
    return null
  }
}

/**
 * 아직 답하지 않은 항목(null)은 저장하지 않는다.
 * @returns 실제로 저장된 설정 (저장 실패 시 null)
 */
export function saveSettings({ budget, location }) {
  const settings = {}
  if (isValidBudget(budget)) settings.budget = budget
  if (isValidLocation(location)) settings.location = location

  if (Object.keys(settings).length === 0) {
    clearSavedSettings()
    return null
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    return settings
  } catch {
    return null
  }
}

export function clearSavedSettings() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 저장소 접근이 막힌 환경이면 지울 것도 없음
  }
}
