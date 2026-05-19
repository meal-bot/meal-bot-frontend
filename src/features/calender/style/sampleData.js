// data.js — sample conversation data + calendar helpers
const _now = new Date();
export const TODAY = { y: _now.getFullYear(), m: _now.getMonth() + 1, d: _now.getDate() };

export const DOW_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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
