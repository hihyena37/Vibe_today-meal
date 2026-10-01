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
    type: 'budget',
    title: '한 사람당 얼마까지 쓸 수 있나요?',
    subtitle: '회사 식비 지원액처럼 정확한 금액을 입력하면 1인당 예상 가격이 넘는 메뉴는 빼고 추천해요.',
    quickAmounts: [10000, 12000, 15000, 20000],
  },
  {
    id: 4,
    key: 'location',
    type: 'location',
    title: '어디에서 먹을 예정인가요?',
    subtitle: '동네나 역 이름을 적으면 결과 화면에서 바로 지도 검색어로 쓸 수 있어요.',
  },
  {
    id: 5,
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
    id: 6,
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
    id: 7,
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
