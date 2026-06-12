import api from '../../../api/axiosInstance';
import { fetchChats } from '../../chat/api/chatApi';
import { MOCK } from '../../../mock/MOCK';
import { USE_MOCKS } from '../../../mock/useMock';

// GET /api/chat 재활용 (사이드바 API) — 전체 채팅을 날짜별로 그룹핑
export const fetchCalendarMonthData = async () => {
  if (USE_MOCKS) return MOCK.calendar.month;

  console.log('[calendarApi] fetchCalendarMonthData 요청');
  const chats = await fetchChats();
  const byDate = {};
  chats.forEach(chat => {
    const date = chat.createdAt?.slice(0, 10);
    if (!date) return;
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(chat);
  });
  console.log('[calendarApi] fetchCalendarMonthData 결과 (날짜별 그룹):', byDate);
  return byDate;
};

// GET /api/calendar/{date} — 날짜 클릭 시 상세 (추천 레시피 이름 목록 포함)
export const fetchCalendarDateData = async (date) => {
  if (USE_MOCKS) return MOCK.calendar.date[date] ?? [];

  console.log('[calendarApi] fetchCalendarDateData 요청 - date:', date);
  const response = await api.get(`/api/calendar/${date}`);
  console.log('[calendarApi] fetchCalendarDateData 응답:', response.data);
  return response.data; // [{ chatId, title, recommendations: string[], createdAt }]
};

// createdAt 시간 기준 끼니 태그 (6-10시 아침 / 11-14시 점심 / 17-21시 저녁)
export const getMealTag = (isoString) => {
  if (!isoString) return null;
  const hour = new Date(isoString).getHours();
  if (hour >= 6 && hour < 11) return 'bf';
  if (hour >= 11 && hour < 15) return 'ln';
  if (hour >= 17 && hour < 22) return 'dn';
  return null;
};

export const formatTime = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
