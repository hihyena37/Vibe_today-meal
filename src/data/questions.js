export const QUESTIONS = [
  {
    id: 1,
    key: 'mealTime',
    title: '언제 먹나요?',
    subtitle: '식사 시간에 딱 맞는 든든함과 메뉴를 고려해 드려요.',
    options: [
      { label: '아침', value: 'breakfast', icon: '☀️', desc: '상쾌하고 부담 없는 한 끼' },
      { label: '점심', value: 'lunch', icon: '🍱', desc: '오후 활력을 채워줄 메뉴' },
      { label: '저녁', value: 'dinner', icon: '🍽️', desc: '하루를 마무리하는 맛있는 식사' },
      { label: '야식', value: 'lateNight', icon: '🌙', desc: '출출한 밤을 달래줄 소울푸드' },
    ],
  },
  {
    id: 2,
    key: 'party',
    title: '오늘 누구와 먹나요?',
    subtitle: '함께하는 사람에 맞춰 분위기와 편의성을 따져볼게요.',
    options: [
      { label: '혼자', value: 'solo', icon: '🙋', desc: '나만의 혼밥 힐링 타임' },
      { label: '친구 / 연인', value: 'friend', icon: '👫', desc: '도란도란 즐거운 맛집 데이트' },
      { label: '직장 동료', value: 'colleague', icon: '💼', desc: '빠르고 쾌적한 오피스 점심/저녁' },
      { label: '여러 명', value: 'group', icon: '👥', desc: '다 같이 푸짐하게 즐기는 모임' },
    ],
  },
  {
    id: 3,
    key: 'budget',
    title: '한 사람당 예산은?',
    subtitle: '지갑 사정에 맞춰 가성비부터 플렉스까지!',
    options: [
      { label: '10,000원 이하', value: 10000, icon: '🪙', desc: '지갑 걱정 없는 착한 가성비' },
      { label: '15,000원 이하', value: 15000, icon: '💵', desc: '대부분의 든든한 정식/식사' },
      { label: '20,000원 이하', value: 20000, icon: '💳', desc: '조금 더 특별하고 넉넉한 한 끼' },
      { label: '가격 상관없음', value: 999999, icon: '✨', desc: '오늘은 가격 보지 않고 맛있게!' },
    ],
  },
  {
    id: 4,
    key: 'spicy',
    title: '매운 음식은 어느 정도 가능해요?',
    subtitle: '맵찔이부터 맵부심까지 취향을 저격해 드려요.',
    options: [
      { label: '전혀 안 돼요', value: 0, icon: '🍼', desc: '맵지 않고 담백·순한 맛 선호' },
      { label: '조금은 가능', value: 1, icon: '🌶️', desc: '신라면 정도는 맛있게 클리어' },
      { label: '매운 거 좋아해요', value: 2, icon: '🔥', desc: '얼큰하고 화끈한 불맛 마니아' },
    ],
  },
  {
    id: 5,
    key: 'soup',
    title: '오늘 국물이 당기나요?',
    subtitle: '속 시원한 찌개·탕인지 깔끔한 볶음/구이인지 골라주세요.',
    options: [
      { label: '국물 필수', value: 'yes', icon: '🍲', desc: '따끈하고 진한 국물로 속풀이' },
      { label: '상관없음', value: 'any', icon: '😋', desc: '국물 유무는 상관없이 맛있는 것' },
      { label: '국물은 싫어요', value: 'no', icon: '🥗', desc: '국물 없이 깔끔하고 담백한 식사' },
    ],
  },
  {
    id: 6,
    key: 'fullness',
    title: '오늘 얼마나 든든하게 먹고 싶어요?',
    subtitle: '가벼운 식사부터 든든한 폭식까지 배부름의 기준!',
    options: [
      { label: '가볍게', value: 1, icon: '🥪', desc: '부담 없이 깔끔하고 산뜻하게' },
      { label: '적당히', value: 2, icon: '🍛', desc: '기분 좋은 포만감의 표준 식사' },
      { label: '아주 든든하게', value: 3, icon: '🥩', desc: '배 터지게 든든한 푸짐한 한 상' },
    ],
  },
]
