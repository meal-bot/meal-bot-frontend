import api from './axiosInstance';

// 1. 인바디 데이터 저장 (로그인 사용자 전용)
// form 필드: { height, weight, age, gender, skeletalMuscle, bodyFat, bodyFatPercent,
//              bmi, protein, mineral, bodyWater, visceralFat }
// 빈 문자열 필드는 null로 변환해서 전송 (선택 항목)
export const saveInbody = async (form) => {
  const body = Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
  );
  const response = await api.post('/api/inbody', body);
  return response.data; // InbodyResponse
};

// 2. 내 인바디 기록 목록 조회 (최신순)
export const fetchInbodyList = async () => {
  const response = await api.get('/api/inbody');
  return response.data; // InbodyResponse[]
};

// 3. 인바디 기록 삭제
export const deleteInbody = async (inbodyId) => {
  const response = await api.delete(`/api/inbody/${inbodyId}`);
  return response.data; // { success: true }
};
