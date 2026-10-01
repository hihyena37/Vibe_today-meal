// '가격 상관없음'을 나타내는 값 (숫자 예산과 섞이지 않도록 문자열로 구분)
export const NO_BUDGET_LIMIT = 'unlimited'

export const MAX_BUDGET = 1000000

export const isUnlimitedBudget = (budget) => budget === NO_BUDGET_LIMIT

export const isValidBudget = (budget) =>
  isUnlimitedBudget(budget) ||
  (Number.isInteger(budget) && budget > 0 && budget <= MAX_BUDGET)

export const formatWon = (value) => `${value.toLocaleString('ko-KR')}원`

// 요약·추천 이유 등에 쓰는 예산 문구
export const formatBudgetLabel = (budget) =>
  isUnlimitedBudget(budget) ? '가격 상관없음' : `${formatWon(budget)} 이하`

/**
 * 입력창 문자열 → 화면 표시용 문자열
 * 숫자와 쉼표만 있을 때는 천 단위 쉼표로 다시 정리하고,
 * 소수점·음수 등 잘못된 입력은 그대로 두어 안내 메시지를 띄울 수 있게 한다.
 */
export function formatBudgetInputText(text) {
  if (!/^[\d,]*$/.test(text)) return text
  const digits = text.replace(/,/g, '').replace(/^0+(?=\d)/, '')
  if (digits === '') return ''
  return Number(digits).toLocaleString('ko-KR')
}

/**
 * 입력창 문자열 → 계산용 숫자
 * @returns {{ value: number|null, error: string }}
 */
export function parseBudgetInput(text) {
  const trimmed = text.trim()

  if (trimmed === '') return { value: null, error: '1인당 식비를 입력해 주세요.' }
  if (trimmed.includes('-')) return { value: null, error: '0원보다 큰 금액을 입력해 주세요.' }
  if (trimmed.includes('.')) return { value: null, error: '소수 없이 원 단위 정수로 입력해 주세요.' }
  if (!/^[\d,]+$/.test(trimmed)) return { value: null, error: '숫자만 입력해 주세요.' }

  const value = Number(trimmed.replace(/,/g, ''))

  if (!Number.isSafeInteger(value) || value <= 0) {
    return { value: null, error: '0원보다 큰 금액을 입력해 주세요.' }
  }
  if (value > MAX_BUDGET) {
    return { value: null, error: `${formatWon(MAX_BUDGET)} 이하로 입력해 주세요.` }
  }

  return { value, error: '' }
}
