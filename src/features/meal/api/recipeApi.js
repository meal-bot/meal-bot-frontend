import api from '../../../api/axiosInstance';
import { MOCK } from '../../../mock/MOCK';
import { USE_MOCKS } from '../../../mock/useMock';

export class RecipeNotFoundError extends Error {
  constructor(message = '레시피를 찾을 수 없습니다') {
    super(message);
    this.name = 'RecipeNotFoundError';
  }
}

export class AiServerError extends Error {
  constructor(message = 'AI 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.') {
    super(message);
    this.name = 'AiServerError';
  }
}

// 메인 슬라이딩 카드용: 무작위 레시피 N개를 한 번에 로드
// 카드 표시 + 클릭 시 모달까지 동일 데이터를 쓰므로 API 호출은 최초 1회
// Spring: GET /api/recipes/random?count=N → fetchRecipeDetail과 동일 구조 배열 반환
export const fetchRandomRecipes = async (count = 10) => {
  if (USE_MOCKS) return MOCK.recipes.random.slice(0, count);

  const response = await api.get(`/api/recipes/random?count=${count}`);
  return response.data;
};

export const fetchRecipeDetail = async (recipeId) => {
  if (USE_MOCKS) {
    return {
      ...MOCK.recipes.detail,
      recipeId,
    };
  }

  try {
    console.log('[recipeApi] fetchRecipeDetail 요청 - recipeId:', recipeId);
    const response = await api.get(`/api/recipes/${encodeURIComponent(recipeId)}`);
    console.log('[recipeApi] fetchRecipeDetail 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('[recipeApi] fetchRecipeDetail 실패:', error?.response?.data || error);
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 404) {
      throw new RecipeNotFoundError(message || '레시피를 찾을 수 없습니다');
    }

    if (status === 502) {
      throw new AiServerError(message);
    }

    throw error;
  }
};
