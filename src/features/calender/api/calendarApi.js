import api from '../../../api/axiosInstance';
import { fetchChatThreads } from '../../chat/api/chatApi';

// GET /api/chat 재활용 (사이드바 API) — 전체 스레드를 날짜별로 그룹핑
export const fetchCalendarMonthData = async () => {
  console.log('[calendarApi] fetchCalendarMonthData 요청');
  const threads = await fetchChatThreads();
  const byDate = {};
  threads.forEach(thread => {
    const date = thread.createdAt?.slice(0, 10);
    if (!date) return;
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(thread);
  });
  console.log('[calendarApi] fetchCalendarMonthData 결과 (날짜별 그룹):', byDate);
  return byDate;
};

// GET /api/calendar/{date} — 날짜 클릭 시 상세 (lastRecommendation 포함)
export const fetchCalendarDateData = async (date) => {
  console.log('[calendarApi] fetchCalendarDateData 요청 - date:', date);
  const response = await api.get(`/api/calendar/${date}`);
  console.log('[calendarApi] fetchCalendarDateData 응답:', response.data);
  return response.data; // [{ chatId, title, lastRecommendation, createdAt }]
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
