// data.js — sample conversation data + calendar helpers
const _now = new Date();
export const TODAY = { y: _now.getFullYear(), m: _now.getMonth() + 1, d: _now.getDate() };

export const DOW_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Spring API 연결 전 테스트용 목업 — { chatId, title, createdAt }[] 형식
export const MOCK_THREADS_BY_DATE = {
  '2026-04-01': [
    { chatId: 'mock-001', title: '오늘 식단 추천', createdAt: '2026-04-01T08:30:00' },
  ],
  '2026-04-02': [
    { chatId: 'mock-002', title: '아침 메뉴 추천', createdAt: '2026-04-02T07:50:00' },
    { chatId: 'mock-003', title: '저녁 식단 구성', createdAt: '2026-04-02T18:30:00' },
  ],
  '2026-04-04': [
    { chatId: 'mock-004', title: '점심 추천', createdAt: '2026-04-04T12:00:00' },
  ],
  '2026-04-05': [
    { chatId: 'mock-005', title: '다이어트 식단 문의', createdAt: '2026-04-05T08:00:00' },
  ],
  '2026-04-07': [
    { chatId: 'mock-006', title: '주말 아침 메뉴', createdAt: '2026-04-07T09:00:00' },
    { chatId: 'mock-007', title: '점심 샐러드 추천', createdAt: '2026-04-07T12:30:00' },
    { chatId: 'mock-008', title: '저녁 고단백 식단', createdAt: '2026-04-07T19:00:00' },
  ],
  '2026-04-08': [
    { chatId: 'mock-009', title: '오트밀 레시피', createdAt: '2026-04-08T08:15:00' },
  ],
  '2026-04-09': [
    { chatId: 'mock-010', title: '점심 저칼로리 메뉴', createdAt: '2026-04-09T12:00:00' },
    { chatId: 'mock-011', title: '저녁 단백질 식단', createdAt: '2026-04-09T19:30:00' },
  ],
  '2026-04-11': [
    { chatId: 'mock-012', title: '운동 후 식사 추천', createdAt: '2026-04-11T13:00:00' },
  ],
  '2026-04-12': [
    { chatId: 'mock-013', title: '채소 위주 식단', createdAt: '2026-04-12T07:45:00' },
  ],
  '2026-04-14': [
    { chatId: 'mock-014', title: '아침 단백질 식단', createdAt: '2026-04-14T07:30:00' },
    { chatId: 'mock-015', title: '점심 도시락 메뉴', createdAt: '2026-04-14T12:00:00' },
    { chatId: 'mock-016', title: '저녁 비건 옵션', createdAt: '2026-04-14T18:30:00' },
    { chatId: 'mock-017', title: '야식 추천', createdAt: '2026-04-14T21:00:00' },
  ],
  '2026-04-15': [
    { chatId: 'mock-018', title: '점심 샐러드 구성', createdAt: '2026-04-15T12:00:00' },
    { chatId: 'mock-019', title: '저녁 닭가슴살 레시피', createdAt: '2026-04-15T19:00:00' },
  ],
  '2026-04-16': [
    { chatId: 'mock-020', title: '저탄수화물 아침', createdAt: '2026-04-16T08:00:00' },
  ],
  '2026-04-18': [
    { chatId: 'mock-021', title: '단백질 보충 식단', createdAt: '2026-04-18T12:30:00' },
  ],
  '2026-04-19': [
    { chatId: 'mock-022', title: '저녁 가볍게 먹기', createdAt: '2026-04-19T19:00:00' },
  ],
  '2026-04-21': [
    { chatId: 'mock-023', title: '아침 대용 스무디', createdAt: '2026-04-21T08:00:00' },
    { chatId: 'mock-024', title: '저녁 한식 추천', createdAt: '2026-04-21T18:30:00' },
  ],
  '2026-04-22': [
    { chatId: 'mock-025', title: '고단백 아침 식단', createdAt: '2026-04-22T07:30:00' },
    { chatId: 'mock-026', title: '점심 구내식당 선택', createdAt: '2026-04-22T12:00:00' },
    { chatId: 'mock-027', title: '저녁 다이어트 메뉴', createdAt: '2026-04-22T19:30:00' },
  ],
  '2026-04-23': [
    { chatId: 'mock-028', title: '오늘 점심 추천', createdAt: '2026-04-23T12:00:00' },
  ],
  '2026-04-25': [
    { chatId: 'mock-029', title: '주말 아침 브런치', createdAt: '2026-04-25T10:00:00' },
  ],
  '2026-04-26': [
    { chatId: 'mock-030', title: '점심 샐러드 추천', createdAt: '2026-04-26T12:00:00' },
    { chatId: 'mock-031', title: '저녁 저칼로리 메뉴', createdAt: '2026-04-26T19:00:00' },
  ],
  '2026-04-28': [
    { chatId: 'mock-032', title: '아침 귀리 레시피', createdAt: '2026-04-28T08:00:00' },
  ],
  '2026-04-29': [
    { chatId: 'mock-033', title: '점심 도시락 추천', createdAt: '2026-04-29T12:00:00' },
  ],
  '2026-04-30': [
    { chatId: 'mock-034', title: '오늘 저녁 뭐 먹을까요', createdAt: '2026-04-30T18:30:00' },
    { chatId: 'mock-035', title: '간식 추천', createdAt: '2026-04-30T15:00:00' },
  ],
  '2026-05-01': [
    { chatId: 'mock-036', title: '근로자의 날 식단', createdAt: '2026-05-01T09:00:00' },
    { chatId: 'mock-037', title: '외식 메뉴 추천', createdAt: '2026-05-01T12:30:00' },
  ],
  '2026-05-02': [
    { chatId: 'mock-038', title: '주말 브런치 메뉴', createdAt: '2026-05-02T10:30:00' },
  ],
  '2026-05-04': [
    { chatId: 'mock-039', title: '아침 단백질 식단', createdAt: '2026-05-04T07:45:00' },
  ],
  '2026-05-05': [
    { chatId: 'mock-040', title: '어린이날 외식 추천', createdAt: '2026-05-05T11:00:00' },
    { chatId: 'mock-041', title: '가족 식사 메뉴', createdAt: '2026-05-05T13:00:00' },
    { chatId: 'mock-042', title: '저녁 파티 음식 추천', createdAt: '2026-05-05T18:00:00' },
  ],
  '2026-05-06': [
    { chatId: 'mock-043', title: '점심 건강식 추천', createdAt: '2026-05-06T12:00:00' },
    { chatId: 'mock-044', title: '저녁 다이어트 식단', createdAt: '2026-05-06T19:00:00' },
  ],
  '2026-05-07': [
    { chatId: 'mock-045', title: '오늘 아침 뭐 먹을까', createdAt: '2026-05-07T08:00:00' },
  ],
  '2026-05-08': [
    { chatId: 'mock-046', title: '아침 단백질 부스트', createdAt: '2026-05-08T07:30:00' },
    { chatId: 'mock-047', title: '저칼로리 저녁 메뉴', createdAt: '2026-05-08T18:45:00' },
  ],
  '2026-05-09': [
    { chatId: 'mock-048', title: '운동 후 회복 식단', createdAt: '2026-05-09T13:20:00' },
  ],
  '2026-05-11': [
    { chatId: 'mock-049', title: '오트밀 + 베리 변형', createdAt: '2026-05-11T08:10:00' },
  ],
  '2026-05-12': [
    { chatId: 'mock-050', title: '오늘 아침으로 단백질 위주 식단', createdAt: '2026-05-12T07:42:00' },
    { chatId: 'mock-051', title: '점심 — 사무실 근처 샐러드', createdAt: '2026-05-12T12:18:00' },
    { chatId: 'mock-052', title: '저녁: 비건 옵션 추천 요청', createdAt: '2026-05-12T19:55:00' },
  ],
  '2026-06-02': [
    { chatId: 'mock-053', title: '6월 첫 주 식단 계획', createdAt: '2026-06-02T08:00:00' },
  ],
  '2026-06-03': [
    { chatId: 'mock-054', title: '점심 추천', createdAt: '2026-06-03T12:00:00' },
    { chatId: 'mock-055', title: '저녁 메뉴 문의', createdAt: '2026-06-03T19:00:00' },
  ],
  '2026-06-05': [
    { chatId: 'mock-056', title: '환경의 날 채식 메뉴', createdAt: '2026-06-05T12:00:00' },
  ],
};

export function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
export function firstWeekday(y, m) { return new Date(y, m - 1, 1).getDay(); }

export function isoDate(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
export function isToday(y, m, d) {
  const t = new Date();
  return y === t.getFullYear() && m === t.getMonth() + 1 && d === t.getDate();
}
export function isFuture(y, m, d) {
  const t = new Date();
  const ty = t.getFullYear(), tm = t.getMonth() + 1, td = t.getDate();
  if (y !== ty) return y > ty;
  if (m !== tm) return m > tm;
  return d > td;
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
// Spring API 연결로 대체됨 — Calendar.jsx에서 threadsByDate 직접 참조
// export function getCount(y, m, d) {
//   return SAMPLE_DATA[isoDate(y, m, d)] || 0;
// }
