import { FOODS } from '../data/foods.js'

export const NO_BUDGET_LIMIT = 999999

/**
 * 음식 하나를 사용자 답변과 비교해 조건별 일치 여부와 점수를 계산
 * (추천 점수와 추천 이유가 같은 판정을 공유하도록 한 곳에서 처리)
 *
 * @param {Object} food
 * @param {Object} answers
 *   - mealTime: 'breakfast' | 'lunch' | 'dinner' | 'lateNight'
 *   - party: 'solo' | 'friend' | 'colleague' | 'group'
 *   - budget: number (10000, 15000, 20000, 999999)
 *   - spicy: number (0: 안돼요, 1: 조금 가능, 2: 좋아해요)
 *   - soup: 'yes' | 'any' | 'no'
 *   - fullness: number (1: 가볍게, 2: 적당히, 3: 아주 든든하게)
 * @returns {{ score: number, matches: Object }}
 */
export function evaluateFood(food, answers) {
  let score = 0
  const matches = {
    mealTime: false,
    party: false,
    budget: false,
    spicy: false,
    soup: false,
    fullness: false,
  }

  // 1. 식사 시간대 (+2점)
  if (answers.mealTime && food.mealTime.includes(answers.mealTime)) {
    score += 2
    matches.mealTime = true
  }

  // 2. 인원 / 모임 유형 (+2점)
  if (answers.party && food.parties.includes(answers.party)) {
    score += 2
    matches.party = true
  }

  // 3. 예산 (+3점, 15% 이내 살짝 초과 시 +1점)
  if (answers.budget) {
    if (answers.budget >= NO_BUDGET_LIMIT || food.budget <= answers.budget) {
      score += 3
      matches.budget = true
    } else if (food.budget <= answers.budget * 1.15) {
      score += 1
    }
  }

  // 4. 매운맛 (+2점)
  if (typeof answers.spicy === 'number') {
    if (answers.spicy === 0 && food.spicy === 0) {
      score += 2
      matches.spicy = true
    } else if (answers.spicy === 1 && food.spicy <= 1) {
      score += 2
      matches.spicy = true
    } else if (answers.spicy === 2) {
      if (food.spicy >= 1) {
        score += 2
        matches.spicy = true
      } else {
        score += 0.5
      }
    }
  }

  // 5. 국물 (+2점, 상관없음은 모든 음식에 +1.5점)
  if (answers.soup === 'yes' && food.soup) {
    score += 2
    matches.soup = true
  } else if (answers.soup === 'no' && !food.soup) {
    score += 2
    matches.soup = true
  } else if (answers.soup === 'any') {
    score += 1.5
    matches.soup = true
  }

  // 6. 든든함 (+2점, 한 단계 차이 +1점)
  if (answers.fullness) {
    const diff = Math.abs(food.fullness - answers.fullness)
    if (diff === 0) {
      score += 2
      matches.fullness = true
    } else if (diff === 1) {
      score += 1
    }
  }

  return { score, matches }
}

/**
 * 사용자 답변에 따른 음식별 적합도 점수 계산 후 상위 후보 반환
 *
 * @param {Object} answers 사용자 응답 객체
 * @param {Array} excludedIds 제외할 음식 ID 배열
 * @param {number} limit 반환할 후보 수 (기본 6개)
 * @returns {Array} 상위 추천 음식 배열
 */
export function getRecommendedFoods(answers, excludedIds = [], limit = 6) {
  const scoredFoods = FOODS.filter((food) => !excludedIds.includes(food.id)).map((food) => {
    const { score, matches } = evaluateFood(food, answers)

    // 동점자 사이에서만 순서가 섞이도록 최소 점수 단위(0.5)보다 작은 랜덤값을 더함
    const randomizedScore = score + Math.random() * 0.4

    return {
      ...food,
      score: Math.round(score * 10) / 10,
      randomizedScore,
      matchedReasons: Object.keys(matches).filter((key) => matches[key]),
    }
  })

  scoredFoods.sort((a, b) => b.randomizedScore - a.randomizedScore)

  return scoredFoods.slice(0, limit)
}

const MEAL_TIME_CLAUSE = {
  breakfast: '아침으로 부담 없고',
  lunch: '점심 한 끼로 무난하고',
  dinner: '저녁 식사로 손색없고',
  lateNight: '야식으로도 제격이고',
}

const PARTY_CLAUSE = {
  solo: '혼자 먹기 편하고',
  friend: '친구나 연인과 함께 즐기기 좋고',
  colleague: '직장 동료와 함께 먹기 무난하고',
  group: '여러 명이 나눠 먹기 좋고',
}

// [이어지는 형태, 마지막에 오는 수식 형태]
const SPICY_TRAIT = {
  0: ['맵지 않고', '맵지 않은'],
  1: ['살짝 매콤하고', '살짝 매콤한'],
  2: ['화끈하게 맵고', '화끈하게 매운'],
}

const FULLNESS_TRAIT = {
  1: ['가볍고', '가벼운'],
  2: ['적당히 든든하고', '적당히 든든한'],
  3: ['든든하고', '든든한'],
}

const MATCH_LABELS = {
  mealTime: { breakfast: '아침 메뉴', lunch: '점심 메뉴', dinner: '저녁 메뉴', lateNight: '야식 메뉴' },
  party: { solo: '혼밥 OK', friend: '둘이 먹기 좋음', colleague: '동료와 함께', group: '여럿이 함께' },
}

/**
 * 결과 화면에 표시할 "일치한 조건" 라벨 목록
 */
export function getMatchedConditions(food, answers) {
  if (!food || !answers) return []

  const { matches } = evaluateFood(food, answers)
  const labels = []

  if (matches.mealTime) labels.push(MATCH_LABELS.mealTime[answers.mealTime])
  if (matches.party) labels.push(MATCH_LABELS.party[answers.party])
  if (matches.budget) labels.push(answers.budget >= NO_BUDGET_LIMIT ? '가격 무관' : '예산 이내')
  if (matches.spicy) labels.push(food.spicy === 0 ? '안 매움' : food.spicy === 1 ? '적당히 매콤' : '화끈한 매운맛')
  if (matches.soup && answers.soup !== 'any') labels.push(food.soup ? '국물 있음' : '국물 없음')
  if (matches.fullness) labels.push(['', '가벼운 한 끼', '적당한 포만감', '아주 든든함'][food.fullness])

  return labels
}

/**
 * 사용자의 실제 답변과 선택된 음식 데이터를 비교해 추천 이유 문장 생성
 * - 일치한 조건만 근거로 사용하고, 어긋난 조건은 "다만 ~" 으로 솔직하게 덧붙임
 *
 * 예) 혼자 먹기 편하고, 15,000원 이하에서 즐길 수 있으며,
 *     국물이 있고 든든한 메뉴를 원하셔서 추천했어요.
 *
 * @param {Object} food 선택된 음식 객체
 * @param {Object} answers 사용자 응답 객체
 * @returns {string} 추천 이유
 */
export function generateRecommendationReason(food, answers) {
  if (!food || !answers) return '오늘 딱 어울리는 한 끼라서 추천했어요.'

  const { matches } = evaluateFood(food, answers)
  const clauses = []
  const caveats = []

  // 1. 상황 (시간대 · 인원)
  if (matches.mealTime) clauses.push(MEAL_TIME_CLAUSE[answers.mealTime])
  if (matches.party) clauses.push(PARTY_CLAUSE[answers.party])

  // 2. 예산
  if (answers.budget >= NO_BUDGET_LIMIT) {
    clauses.push('가격 걱정 없이 마음껏 즐길 수 있으며')
  } else if (matches.budget) {
    clauses.push(`${answers.budget.toLocaleString()}원 이하에서 즐길 수 있으며`)
  } else {
    caveats.push(`예산보다 조금 높은 ${food.budget.toLocaleString()}원 선이지만 그만한 만족감이 있어요`)
  }

  // 3. 음식 특성 (맵기 · 국물 · 든든함) — 사용자가 원한 것과 일치한 것만
  const traits = []
  // "조금은 가능"에 안 매운 음식처럼 허용 범위일 뿐인 경우는 "원하셔서"의 근거로 쓰지 않음
  const wantedThisSpicy = food.spicy === answers.spicy || (answers.spicy === 2 && food.spicy >= 1)
  if (matches.spicy && wantedThisSpicy) traits.push(SPICY_TRAIT[food.spicy])
  else if (food.spicy > answers.spicy) caveats.push('생각보다 살짝 매울 수 있어요')

  if (answers.soup === 'yes') {
    if (food.soup) traits.push(['국물이 있고', '국물이 있는'])
    else caveats.push('국물 대신 다른 매력이 있는 메뉴예요')
  } else if (answers.soup === 'no') {
    if (!food.soup) traits.push(['국물 없이 깔끔하고', '국물 없이 깔끔한'])
    else caveats.push('국물이 함께 나오는 메뉴예요')
  }

  if (matches.fullness) traits.push(FULLNESS_TRAIT[food.fullness])

  let closing
  if (traits.length > 0) {
    const traitText = traits
      .map((pair, idx) => (idx === traits.length - 1 ? pair[1] : pair[0]))
      .join(' ')
    closing = `${traitText} 메뉴를 원하셔서 추천했어요.`
  } else {
    closing = '오늘 고른 조건과 가장 가까운 메뉴라서 추천했어요.'
  }

  const main = clauses.length > 0 ? `${clauses.join(', ')}, ${closing}` : closing

  if (caveats.length === 0) return main
  return `${main} 다만 ${caveats.join('. ')}.`
}
