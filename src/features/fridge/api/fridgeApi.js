import api from '../../../api/axiosInstance';

// AI 응답은 LLM 처리 시간이 필요하므로 타임아웃 설정
const FRIDGE_TIMEOUT = 60000; // 60초

// 냉장고 재료 기반 메뉴 추천 요청
// ingredients: 선택한 재료 이름 배열 (예: ["새우", "양파", "마늘"])
// extras: 사용자가 직접 입력한 추가 재료 텍스트 (예: "에멘탈 치즈"), 없으면 빈 문자열
export const fetchFridgeRecommendation = async (ingredients, extras = '') => {
  console.log('[fridgeApi] fetchFridgeRecommendation 요청:', { ingredients, extras });
  const response = await api.post(
    '/api/fridge/recommend',
    { ingredients, extras },
    { timeout: FRIDGE_TIMEOUT }
  );
  console.log('[fridgeApi] fetchFridgeRecommendation 응답:', response.data);
  return response.data; // { answer, recommendations, flags }
};
