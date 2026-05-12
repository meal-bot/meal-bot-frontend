// data.js — sample conversation data + calendar helpers
const _now = new Date();
export const TODAY = { y: _now.getFullYear(), m: _now.getMonth() + 1, d: _now.getDate() };

export const DOW_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const SAMPLE_DATA = {
  '2026-04-01': 1, '2026-04-02': 2, '2026-04-04': 1, '2026-04-05': 1,
  '2026-04-07': 3, '2026-04-08': 1, '2026-04-09': 2, '2026-04-11': 1,
  '2026-04-12': 1, '2026-04-14': 4, '2026-04-15': 2, '2026-04-16': 1,
  '2026-04-18': 1, '2026-04-19': 1, '2026-04-21': 2, '2026-04-22': 3,
  '2026-04-23': 1, '2026-04-25': 1, '2026-04-26': 2, '2026-04-28': 1,
  '2026-04-29': 1, '2026-04-30': 2,
  '2026-05-01': 2, '2026-05-02': 1,
  '2026-05-04': 1, '2026-05-05': 3, '2026-05-06': 2, '2026-05-07': 1,
  '2026-05-08': 2, '2026-05-09': 1,
  '2026-05-11': 1, '2026-05-12': 3,
  '2026-06-02': 1, '2026-06-03': 2, '2026-06-05': 1,
};

export const SAMPLE_CONVOS = {
  '2026-05-12': [
    { time: '07:42', tag: 'bf', title: '오늘 아침으로 단백질 위주 식단', snippet: 'med' },
    { time: '12:18', tag: 'ln', title: '점심 — 사무실 근처 샐러드', snippet: 'short' },
    { time: '19:55', tag: 'dn', title: '저녁: 비건 옵션 추천 요청', snippet: 'med' },
  ],
  '2026-05-11': [
    { time: '08:10', tag: 'bf', title: '오트밀 + 베리 변형', snippet: 'short' },
  ],
  '2026-05-09': [
    { time: '13:20', tag: 'ln', title: '운동 후 회복 식단', snippet: 'med' },
  ],
  '2026-05-08': [
    { time: '07:30', tag: 'bf', title: '아침 단백질 부스트', snippet: 'short' },
    { time: '18:45', tag: 'dn', title: '저칼로리 저녁 메뉴', snippet: 'med' },
  ],
};

export function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
export function firstWeekday(y, m) { return new Date(y, m - 1, 1).getDay(); }

export function isoDate(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
export function isToday(y, m, d) { return y === TODAY.y && m === TODAY.m && d === TODAY.d; }
export function isFuture(y, m, d) {
  if (y !== TODAY.y) return y > TODAY.y;
  if (m !== TODAY.m) return m > TODAY.m;
  return d > TODAY.d;
}
export function buildMonthGrid(y, m, weekStart = 0) {
  const first = firstWeekday(y, m);
  const offset = (first - weekStart + 7) % 7;
  const dim = daysInMonth(y, m);
  const prevDim = daysInMonth(y, m === 1 ? 12 : m - 1);
  const prevY = m === 1 ? y - 1 : y;
  const prevM = m === 1 ? 12 : m - 1;
  const nextY = m === 12 ? y + 1 : y;
  const nextM = m === 12 ? 1 : m + 1;
  const cells = [];
  for (let i = 0; i < offset; i++) {
    const d = prevDim - offset + 1 + i;
    cells.push({ y: prevY, m: prevM, d, outside: true });
  }
  for (let d = 1; d <= dim; d++) cells.push({ y, m, d, outside: false });
  while (cells.length < 42) {
    const idx = cells.length - offset - dim + 1;
    cells.push({ y: nextY, m: nextM, d: idx, outside: true });
  }
  return cells;
}
export function getCount(y, m, d) {
  return SAMPLE_DATA[isoDate(y, m, d)] || 0;
}
