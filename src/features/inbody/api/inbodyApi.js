import api from '../../../api/axiosInstance';
import { MOCK } from '../../../mock/MOCK';
import { USE_MOCKS } from '../../../mock/useMock';

// 1. 인바디 데이터 저장 (로그인 사용자 전용)
//
// 전송 형태: POST /api/inbody  Content-Type: application/json
// {
//   // ── 필수 (BASIC_FIELDS) ──────────────────────────────
//   height        : number        // 키 (cm)
//   weight        : number        // 체중 (kg)
//   age           : number        // 나이 (세)
//   gender        : string        // 성별 ("남성" | "여성")
//   activityLevel : number        // 활동계수 (1.2 | 1.375 | 1.55 | 1.725 | 1.9)
//
//   // ── 선택 (ADVANCED_FIELDS) — 미입력 시 null 전송 ────
//   skeletalMuscle  : number | null  // 골격근량 (kg)
//   bodyFat         : number | null  // 체지방량 (kg)
//   bodyFatPercent  : number | null  // 체지방률 (%)
//   protein         : number | null  // 단백질 (kg)
//   mineral         : number | null  // 무기질 (kg)
//   bodyWater       : number | null  // 체수분 (L)
//   visceralFat     : number | null  // 내장지방 (lvl)
// }
//
// 저장만 담당 — 반환값 없음
// 백엔드가 저장 후 bmi, bmr, dailyCalories 계산·저장 → fetchInbodyList로 조회
export const saveInbody = async (form) => {
  if (USE_MOCKS) return;

  const body = Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
  );
  console.log('[inbodyApi] saveInbody 요청:', body);
  await api.post('/api/inbody', body);
  console.log('[inbodyApi] saveInbody 완료');
};

// 2. 내 인바디 기록 목록 조회 (최신순)
// bmi, bmr, dailyCalories 등 백엔드 계산값 포함
export const fetchInbodyList = async () => {
  if (USE_MOCKS) return MOCK.inbody.records;

  const response = await api.get('/api/inbody');
  console.log("받는 데이터:", response.data);
  return response.data; // InbodyResponse[]
};

// 3. 인바디 기록 삭제
export const deleteInbody = async (inbodyId) => {
  if (USE_MOCKS) return;

  console.log('[inbodyApi] deleteInbody 요청 - inbodyId:', inbodyId);
  await api.delete(`/api/inbody/${inbodyId}`);
  console.log('[inbodyApi] deleteInbody 완료 - inbodyId:', inbodyId);
};
