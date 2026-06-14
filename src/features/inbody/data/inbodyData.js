export const BASIC_FIELDS = [
  { key: 'height', label: '키', unit: 'cm', icon: 'height', placeholder: '170', min: 100, max: 230 },
  { key: 'weight', label: '체중', unit: 'kg', icon: 'monitor_weight', placeholder: '65', min: 25, max: 200 },
  { key: 'age', label: '나이', unit: '세', icon: 'cake', placeholder: '28', min: 10, max: 100 },
  { key: 'gender', label: '성별', unit: '', icon: 'wc', options: ['남성', '여성'] },
];

export const ACTIVITY_LEVELS = [
  { label: '거의 없음', description: '앉아서 생활', factor: 1.2 },
  { label: '가벼움', description: '주 1~3회', factor: 1.375 },
  { label: '보통', description: '주 3~5회', factor: 1.55 },
  { label: '활동적', description: '주 6~7회', factor: 1.725 },
  { label: '매우 활동적', description: '하루 2회 이상', factor: 1.9 },
];

export const ADVANCED_FIELDS = [
  { key: 'skeletalMuscle', label: '골격근량', unit: 'kg', icon: 'fitness_center', hint: '선택 입력' },
  { key: 'bodyFat', label: '체지방량', unit: 'kg', icon: 'water_drop', hint: '선택 입력' },
  { key: 'bodyFatPercent', label: '체지방률', unit: '%', icon: 'percent', hint: '선택 입력' },
  { key: 'protein', label: '단백질', unit: 'kg', icon: 'egg', hint: '선택 입력' },
  { key: 'mineral', label: '무기질', unit: 'kg', icon: 'grain', hint: '선택 입력' },
  { key: 'bodyWater', label: '체수분', unit: 'L', icon: 'opacity', hint: '선택 입력' },
  { key: 'visceralFat', label: '내장지방', unit: 'level', icon: 'donut_large', hint: '선택 입력' },
];
