import api from '../../../api/axiosInstance';

// AI 응답은 LLM 처리 시간이 필요하므로 타임아웃 설정
const FRIDGE_TIMEOUT = 60000; // 60초

// 냉장고 재료 기반 메뉴 추천 요청
// ingredients: 표준 재료 이름 배열 (preset 목록에서 고른 것, 예: ["새우", "양파"])
// extras: 사용자가 직접 입력한 추가 재료 배열 (예: ["에멘탈 치즈"]), 없으면 빈 배열
// count: 받고 싶은 추천 개수 (기본 2)
export const fetchFridgeRecommendation = async (ingredients, extras = [], count = 2) => {
  console.log('[fridgeApi] fetchFridgeRecommendation 요청:', { ingredients, extras, count });
  const response = await api.post(
    '/api/fridge/recommend',
    { ingredients, extras, count },
    { timeout: FRIDGE_TIMEOUT }
  );
  console.log('[fridgeApi] fetchFridgeRecommendation 응답:', response.data);
  return response.data; // { recommendations: [...] }
};
