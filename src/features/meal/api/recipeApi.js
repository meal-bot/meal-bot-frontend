import api from '../../../api/axiosInstance';

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

export const fetchRecipeDetail = async (recipeId) => {
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
