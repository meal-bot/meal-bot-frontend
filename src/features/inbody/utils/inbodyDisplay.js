import { ACTIVITY_LEVELS } from '../data/inbodyData';

export function formatDate(value) {
  const date = value?.slice?.(0, 10) ?? value ?? '';
  return date ? date.replace(/-/g, '. ') : '-';
}

export function formatNumber(value, digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return '-';
  const rounded = Number(value).toFixed(digits);
  return rounded.replace(/\.0$/, '');
}

export function calculateBmi(record) {
  if (record?.bmi != null) return Number(record.bmi);
  if (!record?.height || !record?.weight) return null;
  const heightMeter = Number(record.height) / 100;
  return Number((Number(record.weight) / (heightMeter * heightMeter)).toFixed(1));
}

export function getBmiGrade(bmi) {
  if (bmi == null) return { label: '-', tone: 'muted' };
  if (bmi < 18.5) return { label: '저체중', tone: 'muted' };
  if (bmi < 23) return { label: '정상', tone: 'primary' };
  if (bmi < 25) return { label: '과체중', tone: 'secondary' };
  if (bmi < 30) return { label: '비만 1단계', tone: 'danger' };
  if (bmi < 35) return { label: '비만 2단계', tone: 'danger' };
  return { label: '고도비만', tone: 'danger' };
}

export function getActivityInfo(value) {
  if (value == null || value === '') {
    return { ...ACTIVITY_LEVELS[2], fallback: true };
  }

  const numeric = Number(value);
  const matched = ACTIVITY_LEVELS.find(level => level.factor === numeric)
    ?? ACTIVITY_LEVELS.find(level => level.label === value);

  return matched ? { ...matched, fallback: false } : { ...ACTIVITY_LEVELS[2], fallback: true };
}

export function getBodyComposition(record) {
  if (!record?.weight) return null;

  const fatMass = record.bodyFat != null
    ? Number(record.bodyFat)
    : record.bodyFatPercent != null
      ? Number(((Number(record.weight) * Number(record.bodyFatPercent)) / 100).toFixed(1))
      : null;

  if (fatMass == null) return null;

  const leanMass = Math.max(0, Number((Number(record.weight) - fatMass).toFixed(1)));
  const fatPercent = record.bodyFatPercent != null
    ? Number(record.bodyFatPercent)
    : Number(((fatMass / Number(record.weight)) * 100).toFixed(1));

  return { fatMass, leanMass, fatPercent };
}

export function formatDelta(current, previous, unit = '') {
  if (current == null || previous == null) return null;
  const diff = Number((Number(current) - Number(previous)).toFixed(1));
  if (Number.isNaN(diff)) return null;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${formatNumber(diff)}${unit}`;
}

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}
