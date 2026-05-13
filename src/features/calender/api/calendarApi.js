import api from '../../../api/axiosInstance';

// GET /api/calendar?year=2026&month=5
// 백엔드: 월별 필터링 / 프론트: 날짜별 그룹핑
export const fetchCalendarMonthData = async (year, month) => {
  const response = await api.get('/api/calendar', { params: { year, month } });
  const threads = response.data; // [{ chatId, title, createdAt }, ...]

  const byDate = {};
  threads.forEach(thread => {
    const date = thread.createdAt?.slice(0, 10);
    if (!date) return;
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(thread);
  });
  return byDate;
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
