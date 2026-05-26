// 백엔드 상세 데이터 연결 전 임시 mock. 백엔드 스펙 확정 후 이 파일과 import 부분 삭제.
export const MOCK_RECIPE_DETAIL = {
  nutrition: {
    calories: 520,
    protein: 32,
    carbs: 58,
    fat: 18,
  },
  ingredients: [
    { name: '닭가슴살', amount: '200g' },
    { name: '브로콜리', amount: '1/2송이' },
    { name: '현미밥', amount: '1공기' },
    { name: '올리브유', amount: '1큰술' },
    { name: '마늘', amount: '3쪽' },
    { name: '소금', amount: '약간' },
    { name: '후추', amount: '약간' },
    { name: '레몬즙', amount: '1작은술' },
  ],
  instructions: [
    '닭가슴살을 한입 크기로 자르고 소금, 후추로 밑간한다.',
    '브로콜리는 작은 송이로 자르고 끓는 물에 30초간 데친다.',
    '마늘은 편으로 썰어 준비한다.',
    '팬에 올리브유를 두르고 마늘을 볶아 향을 낸다.',
    '닭가슴살을 넣고 겉면이 노릇해질 때까지 굽는다.',
    '브로콜리를 넣고 1~2분 더 볶는다.',
    '레몬즙을 뿌리고 그릇에 현미밥과 함께 담아낸다.',
  ],
};
