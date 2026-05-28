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
    const response = await api.get(`/api/recipes/${encodeURIComponent(recipeId)}`);
    return response.data;
  } catch (error) {
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
