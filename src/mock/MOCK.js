const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayDate = `${yyyy}-${mm}-${dd}`;

const recommendations = [
  {
    recipeId: 'mock-recipe-1',
    name: '닭가슴살 토마토 샐러드',
    mainIngredients: ['닭가슴살', '토마토', '양상추'],
    missingIngredients: ['양상추'],
    cookingTime: 15,
    summary: '가볍지만 단백질은 충분한 저녁 메뉴입니다.',
    reason: '선택한 닭가슴살과 토마토를 바로 활용할 수 있어요.',
  },
  {
    recipeId: 'mock-recipe-2',
    name: '두부 버섯 덮밥',
    mainIngredients: ['두부', '버섯', '현미밥'],
    missingIngredients: [],
    cookingTime: 20,
    summary: '부담 없이 포만감을 주는 균형 잡힌 한 그릇입니다.',
    reason: '지방은 낮추고 식물성 단백질을 보충하기 좋아요.',
  },
];

const chats = [
  {
    chatId: 9001,
    title: '저녁 가볍게 먹고 싶어',
    createdAt: `${todayDate}T19:10:00`,
  },
  {
    chatId: 9002,
    title: '아침으로 먹기 좋은 고단백 식단 추천',
    createdAt: `${todayDate}T08:20:00`,
  },
  {
    chatId: 9003,
    title: '긴 제목 테스트: 냉장고에 닭가슴살 토마토 두부 버섯만 있을 때 만들 수 있는 메뉴',
    createdAt: `${yyyy}-${mm}-${String(Math.max(1, Number(dd) - 2)).padStart(2, '0')}T12:30:00`,
  },
];

const fullInbodyRecords = [
  {
    inbodyId: 1,
    measuredAt: `${todayDate}T10:00:00`,
    height: 175,
    weight: 72.3,
    age: 29,
    gender: '남성',
    activityLevel: 1.55,
    bmi: 23.6,
    score: 82,
    grade: '양호',
    bodyType: '균형',
    bmr: 1650,
    dailyCalories: 2558,
    skeletalMuscle: 32.1,
    bodyFat: 13.4,
    bodyFatPercent: 18.5,
    protein: 12.2,
    mineral: 3.7,
    bodyWater: 42.8,
    visceralFat: 7,
  },
  {
    inbodyId: 2,
    measuredAt: `${yyyy}-${mm}-${String(Math.max(1, Number(dd) - 10)).padStart(2, '0')}T10:00:00`,
    height: 175,
    weight: 73.1,
    age: 29,
    gender: '남성',
    activityLevel: 1.55,
    bmi: 23.9,
    score: 79,
    grade: '보통',
    bodyType: '균형',
    bmr: 1628,
    dailyCalories: 2523,
    skeletalMuscle: 31.4,
    bodyFat: 14.1,
    bodyFatPercent: 19.3,
    protein: 12,
    mineral: 3.6,
    bodyWater: 42,
    visceralFat: 8,
  },
];

const requiredOnlyInbodyRecords = fullInbodyRecords.map(({
  inbodyId,
  measuredAt,
  height,
  weight,
  age,
  gender,
  activityLevel,
  bmi,
  bmr,
  dailyCalories,
}) => ({
  inbodyId,
  measuredAt,
  height,
  weight,
  age,
  gender,
  activityLevel,
  bmi,
  bmr,
  dailyCalories,
}));

export const MOCK = {
  chat: {
    chats,
    detail: {
      chatId: 9001,
      title: '저녁 가볍게 먹고 싶어',
      messages: [
        { id: 'm-1', role: 'user', content: '저녁 가볍게 먹고 싶어' },
        {
          id: 'm-2',
          role: 'assistant',
          content: '가볍지만 단백질은 챙길 수 있는 메뉴를 추천드릴게요.',
          recommendations,
          flags: null,
        },
      ],
    },
    message: {
      messageId: 'mock-message-1',
      intent: 'recommend',
      answer: '가볍게 먹고 싶다면 닭가슴살 토마토 샐러드와 두부 버섯 덮밥이 잘 맞습니다. 두 메뉴 모두 조리 시간이 짧고, 단백질을 충분히 챙길 수 있어요.',
      recommendations,
      flags: null,
    },
  },
  fridge: {
    success: {
      message: '선택한 재료로 만들기 쉬운 메뉴를 골랐어요.',
      recommendations,
    },
    empty: {
      message: '현재 선택한 재료만으로는 추천할 메뉴를 찾지 못했어요. 단백질이나 채소를 하나 더 추가해보세요.',
      recommendations: [],
    },
    error: {
      message: '추천 요청 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      recommendations: [],
    },
  },
  calendar: {
    month: {
      [todayDate]: [chats[0], chats[1]],
      [chats[2].createdAt.slice(0, 10)]: [chats[2]],
    },
    date: {
      [todayDate]: [
        {
          chatId: 9002,
          title: '아침으로 먹기 좋은 고단백 식단 추천',
          createdAt: `${todayDate}T08:20:00`,
          recommendations: ['그릭요거트볼', '오트밀 에그볼'],
        },
        {
          chatId: 9001,
          title: '저녁 가볍게 먹고 싶어',
          createdAt: `${todayDate}T19:10:00`,
          recommendations: ['닭가슴살 토마토 샐러드', '두부 버섯 덮밥'],
        },
      ],
    },
  },
  recipes: {
    random: recommendations.map((recipe, index) => ({
      ...recipe,
      id: recipe.recipeId,
      tag: index === 0 ? 'HIGH PROTEIN' : 'BALANCED',
      tagColor: index === 0 ? 'text-primary' : 'text-secondary',
      calories: index === 0 ? 420 : 510,
      protein: index === 0 ? 38 : 24,
    })),
    detail: {
      recipeId: 'mock-recipe-1',
      name: '닭가슴살 토마토 샐러드',
      summary: '가볍고 단백질이 높은 메뉴입니다.',
      mainIngredients: ['닭가슴살', '토마토', '양상추'],
      ingredients: ['닭가슴살 150g', '토마토 1개', '양상추 한 줌', '올리브오일 1스푼'],
      steps: ['닭가슴살을 노릇하게 굽습니다.', '토마토와 양상추를 먹기 좋게 썹니다.', '재료를 담고 드레싱을 곁들입니다.'],
      cookingTime: 15,
      calories: 420,
      protein: 38,
      carbs: 18,
      fat: 14,
    },
  },
  inbody: {
    records: fullInbodyRecords,
    success: {
      records: fullInbodyRecords,
    },
    requiredOnly: {
      records: requiredOnlyInbodyRecords,
    },
  },
};
