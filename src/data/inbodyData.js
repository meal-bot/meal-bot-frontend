// 표준 8종 + 기본 정보 측정 항목 정의
// range는 "정상" 범위 (성인 평균 기준, 실제 서비스에서는 성별/연령별 분기 필요)

export const BASIC_FIELDS = [
  { key: 'height', label: '키', unit: 'cm', icon: 'height', placeholder: '170', min: 100, max: 230 },
  { key: 'weight', label: '체중', unit: 'kg', icon: 'monitor_weight', placeholder: '65', min: 25, max: 200 },
  { key: 'age', label: '나이', unit: '세', icon: 'cake', placeholder: '28', min: 10, max: 100 },
  { key: 'gender', label: '성별', unit: '', icon: 'wc', options: ['남성', '여성'] },
];

export const ACTIVITY_LEVELS = [
  { label: '비활동', description: '운동 거의 없음', factor: 1.2 },
  { label: '가벼운 활동', description: '주 1~3회', factor: 1.375 },
  { label: '보통 활동', description: '주 3~5회', factor: 1.55 },
  { label: '활동적', description: '주 6~7회', factor: 1.725 },
  { label: '매우 활동적', description: '하루 2회+', factor: 1.9 },
];

// 인바디 기기에서 나오는 항목 — 표준 8종
export const ADVANCED_FIELDS = [
  { key: 'skeletalMuscle', label: '골격근량', unit: 'kg', icon: 'fitness_center', range: [28, 36], hint: '인바디 결과지 상단' },
  { key: 'bodyFat', label: '체지방량', unit: 'kg', icon: 'water_drop', range: [10, 16], hint: '체성분 분석' },
  { key: 'bodyFatPercent', label: '체지방률', unit: '%', icon: 'percent', range: [10, 20], hint: 'PBF' },
  { key: 'protein', label: '단백질', unit: 'kg', icon: 'egg', range: [9, 13], hint: '체성분 분석' },
  { key: 'mineral', label: '무기질', unit: 'kg', icon: 'grain', range: [3, 4], hint: '체성분 분석' },
  { key: 'bodyWater', label: '체수분', unit: 'L', icon: 'opacity', range: [33, 44], hint: '체성분 분석' },
  { key: 'visceralFat', label: '내장지방', unit: 'lvl', icon: 'donut_large', range: [1, 9], hint: '복부 단면 분석' },
];

// 부위별 근육 균형 (Segmental Lean Analysis)
export const SEGMENTS = [
  { key: 'rightArm', label: '오른팔', short: 'RA', value: 3.2, normal: [3.0, 3.6] },
  { key: 'leftArm', label: '왼팔', short: 'LA', value: 3.1, normal: [3.0, 3.6] },
  { key: 'trunk', label: '몸통', short: 'TR', value: 24.8, normal: [24, 28] },
  { key: 'rightLeg', label: '오른다리', short: 'RL', value: 9.4, normal: [9.0, 10.5] },
  { key: 'leftLeg', label: '왼다리', short: 'LL', value: 9.6, normal: [9.0, 10.5] },
];

// // 더미 히스토리 (최근 6회 측정)
// export const HISTORY = [
//   { date: '2025-11-02', weight: 68.4, bodyFatPercent: 22.1, skeletalMuscle: 28.9, score: 72 },
//   { date: '2025-12-08', weight: 67.8, bodyFatPercent: 21.3, skeletalMuscle: 29.4, score: 75 },
//   { date: '2026-01-10', weight: 67.2, bodyFatPercent: 20.5, skeletalMuscle: 29.8, score: 78 },
//   { date: '2026-02-14', weight: 66.5, bodyFatPercent: 19.4, skeletalMuscle: 30.2, score: 81 },
//   { date: '2026-03-18', weight: 66.0, bodyFatPercent: 18.6, skeletalMuscle: 30.7, score: 83 },
//   { date: '2026-04-22', weight: 65.4, bodyFatPercent: 17.8, skeletalMuscle: 31.2, score: 86 },
// ];

// 가장 최근 측정값 (대시보드 기본 표시)
export const LATEST = {
  date: '2026-04-22',
  basic: { height: 173, weight: 65.4, age: 28, gender: '남성' },
  advanced: {
    skeletalMuscle: 31.2,
    bodyFat: 11.6,
    bodyFatPercent: 17.8,
    bmi: 21.9,
    protein: 11.8,
    mineral: 3.6,
    bodyWater: 41.2,
    visceralFat: 5,
  },
  score: 86,
  grade: '표준',          // '저체중' | '표준' | '비만'
  bodyType: '균형형',     // '근육형' | '균형형' | '마른비만형' 등
};

// 평균값 더미 데이터 — 실제 서비스에서는 백엔드 /api/inbody/stats로 대체
export const AVG_STATS = {
  bmi: 23.0,
  bmr: 1650,
  height: 172.0,
  weight: 70.5,
};

// 등급 평가 — 값과 정상범위로 상태 산출
export function evaluate(value, range) {
  if (value == null || isNaN(value)) return 'unknown';
  const [lo, hi] = range;
  if (value < lo) return 'low';      // 부족
  if (value > hi) return 'high';     // 과다
  return 'normal';                   // 정상
}

// 게이지 위치 (0~100%) — 정상범위를 30~70%에 매핑
export function gaugePosition(value, range) {
  if (value == null) return 50;
  const [lo, hi] = range;
  const span = hi - lo;
  const extLo = lo - span * 0.75;  // 좌측 한계
  const extHi = hi + span * 0.75;  // 우측 한계
  const pct = ((value - extLo) / (extHi - extLo)) * 100;
  return Math.max(2, Math.min(98, pct));
}
