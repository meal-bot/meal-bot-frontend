import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import MEAL_DATA from '../data/mealData';
import {
  ADVANCED_FIELDS, SEGMENTS,
  evaluate, gaugePosition,
} from '../data/inbodyData';
import { fetchInbodyList } from '../api/inbodyApi';
//import { timeAgo } from '../utils/timeAgo';


/**
 * 인바디 결과 / 히스토리 대시보드 — /inbody
 *
 * 섹션 구성:
 *  1) 점수·등급 요약 카드 (인바디 점수 + 변화량 + 체형)
 *  2) 항목별 게이지 (표준 8종 - 정상범위 대비 위치)
 *  3) 시간 추이 그래프 (체중·체지방률 SVG 라인)
 *  4) 부위별 근육 균형 (인체 도식 + 부위별 수치)
 *  5) 식단 추천 CTA (메인 MealCard 3장 + 채팅 시작)
 */
export default function InBodyDashboardPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInbodyList()
      .then(setRecords)
      .catch(() => console.error('인바디 기록 로드 실패'))
      .finally(() => setIsLoading(false));
  }, []);

  // API는 최신순 반환 → curr = 최신, prev = 직전
  const curr = records[0] ?? null;
  const prev = records[1] ?? null;
  // 차트용: 오래된 순으로 뒤집고 date 필드를 YYYY-MM-DD로 정규화
  const chartHistory = [...records].reverse().map(r => ({
    ...r,
    date: r.createdAt?.slice(0, 10) ?? r.date ?? '',
  }));

  const weightDelta = curr && prev ? (curr.weight - prev.weight).toFixed(1) : null;
  const fatDelta = curr && prev ? (curr.bodyFatPercent - prev.bodyFatPercent).toFixed(1) : null;
  const muscleDelta = curr && prev ? (curr.skeletalMuscle - prev.skeletalMuscle).toFixed(1) : null;
  const scoreDelta = curr?.score && prev?.score ? curr.score - prev.score : 0;

  const recommendedMeals = MEAL_DATA.slice(0, 3);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* ───── 헤더 ───── */}
        <header className="flex items-end justify-between gap-4 mb-2">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              인바디 대시보드
            </p>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">내 체성분 분석</h1>
            <p className="text-on-surface-variant text-sm mt-1.5">
              마지막 측정 · {curr?.createdAt?.slice(0, 10)?.replace(/-/g, '. ') ?? '-'}
            </p>
          </div>
          <button
            onClick={() => navigate('/inbody/new')}
            className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">add</span>
            새 측정
          </button>
        </header>

        {/* 로딩 / 기록 없음 상태 */}
        {isLoading && (
          <p className="text-sm text-on-surface-variant text-center py-12">불러오는 중...</p>
        )}
        {!isLoading && records.length === 0 && (
          <div className="text-center py-16">
            <p className="text-on-surface-variant mb-4">아직 측정 기록이 없습니다</p>
            <button
              onClick={() => navigate('/inbody/new')}
              className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity"
            >
              첫 측정 기록하기
            </button>
          </div>
        )}

        {/* ───── 1. 점수/등급 요약 카드 ───── */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 p-8">
            {/* 인바디 점수 - 원형 그래프 */}
            <div className="flex items-center justify-center">
              <ScoreRing score={curr?.score ?? 0} delta={scoreDelta} />
            </div>

            {/* 우측: 등급 + 핵심 변화량 */}
            <div className="flex flex-col gap-5 justify-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary-container text-primary mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {curr?.grade ?? '-'}
                </span>
                <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
                  {curr?.bodyType ?? '-'} 체형
                </h2>
                <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  근육량과 체지방이 균형 잡힌 상태입니다. 현재 페이스를 유지하세요.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-outline-variant/40">
                <DeltaStat label="체중" value={curr ? `${curr.weight} kg` : '-'} delta={weightDelta} good={weightDelta <= 0} />
                <DeltaStat label="체지방률" value={curr ? `${curr.bodyFatPercent}%` : '-'} delta={fatDelta} good={fatDelta < 0} />
                <DeltaStat label="골격근량" value={curr ? `${curr.skeletalMuscle} kg` : '-'} delta={muscleDelta} good={muscleDelta > 0} suffixed />
              </div>
            </div>
          </div>
        </section>

        {/* ───── 2. 항목별 게이지 ───── */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
          <SectionTitle eyebrow="STANDARD 8" title="항목별 분석" sub="정상 범위 대비 현재값" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
            {ADVANCED_FIELDS.map(field => (
              <GaugeRow
                key={field.key}
                field={field}
                value={curr?.[field.key] ?? null}
              />
            ))}
          </div>
        </section>

        {/* ───── 3. 시간 추이 ───── */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
          <SectionTitle eyebrow="TREND · 6 MONTHS" title="시간 추이" sub="체중·체지방률 변화" />
          <div className="mt-6">
            {chartHistory.length >= 2
              ? <TrendChart history={chartHistory} />
              : <p className="text-sm text-on-surface-variant text-center py-8">측정 기록이 2개 이상이어야 추이를 볼 수 있습니다</p>
            }
          </div>

          {/* 측정 히스토리 미니 테이블 */}
          <div className="mt-6 pt-6 border-t border-outline-variant/40">
            <div className="grid grid-cols-4 gap-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pb-2">
              <span>측정일</span>
              <span className="text-right">체중</span>
              <span className="text-right">체지방률</span>
              <span className="text-right">점수</span>
            </div>
            {records.slice(0, 4).map((h, i) => {
              const date = h.createdAt?.slice(0, 10) ?? h.date ?? '';
              return (
                <div key={h.inbodyId ?? i} className={`grid grid-cols-4 gap-2 text-sm py-2.5 ${i === 0 ? 'font-bold text-on-surface' : 'text-on-surface-variant'} ${i < 3 ? 'border-b border-outline-variant/30' : ''}`}>
                  <span>{date.replace(/-/g, '. ')}{i === 0 && <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-primary">최신</span>}</span>   {/*{timeAgo(h.createdAt)}*/}
                  <span className="text-right tabular-nums">{h.weight} kg</span>
                  <span className="text-right tabular-nums">{h.bodyFatPercent}%</span>
                  <span className="text-right tabular-nums">{h.score ?? '-'}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ───── 4. 부위별 근육 균형 ───── */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
          <SectionTitle eyebrow="SEGMENTAL" title="부위별 근육 균형" sub="좌·우 균형 및 정상 범위" />

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 mt-6 items-center">
            <BodyDiagram />

            <div className="flex flex-col gap-3">
              {SEGMENTS.map(seg => (
                <SegmentRow key={seg.key} segment={seg} />
              ))}
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                좌·우 차이가 0.3kg 이내면 균형 상태입니다. 현재 모든 부위가 정상 범위 내에 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* ───── 5. 식단 추천 CTA ───── */}
        <section className="bg-primary-container/40 rounded-[2rem] border border-outline-variant/30 p-8">
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2 block">
                MEAL · TAILORED
              </span>
              <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
                이 결과에 맞는 식단
              </h2>
              <p className="text-sm text-on-surface-variant mt-1.5">
                근육량 유지·체지방 감량을 위한 고단백 위주 메뉴
              </p>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 bg-on-surface text-white font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">forum</span>
              맞춤 채팅 시작
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </section>

        <div className="h-4" />
      </div>
    </Layout>
  );
}

/* ───────────────────────── 서브컴포넌트 ───────────────────────── */

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{eyebrow}</span>
      <h2 className="text-xl font-extrabold text-on-surface tracking-tight mt-1">{title}</h2>
      <p className="text-sm text-on-surface-variant mt-0.5">{sub}</p>
    </div>
  );
}

function ScoreRing({ score, delta }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
        <circle cx="88" cy="88" r={radius} fill="none" stroke="var(--color-outline-variant)" strokeWidth="10" />
        <circle
          cx="88" cy="88" r={radius} fill="none"
          stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">SCORE</span>
        <span className="text-5xl font-extrabold text-on-surface tabular-nums leading-none mt-0.5">{score}</span>
        <span className={`text-xs font-bold mt-2 flex items-center gap-0.5 ${delta >= 0 ? 'text-primary' : 'text-secondary'}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            {delta >= 0 ? 'trending_up' : 'trending_down'}
          </span>
          {delta >= 0 ? '+' : ''}{delta} pts
        </span>
      </div>
    </div>
  );
}

function DeltaStat({ label, value, delta, good, suffixed }) {
  const arrow = parseFloat(delta) > 0 ? 'arrow_upward' : parseFloat(delta) < 0 ? 'arrow_downward' : 'remove';
  const color = good ? 'text-primary' : 'text-secondary';
  const sign = parseFloat(delta) > 0 ? '+' : '';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
      <span className="text-lg font-extrabold text-on-surface tabular-nums">{value}</span>
      <span className={`text-xs font-semibold ${color} flex items-center gap-0.5 tabular-nums`}>
        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{arrow}</span>
        {sign}{delta}{suffixed ? ' kg' : (label === '체지방률' ? '%p' : ' kg')}
      </span>
    </div>
  );
}

function GaugeRow({ field, value }) {
  const status = evaluate(value, field.range);
  const pos = gaugePosition(value, field.range);
  const statusMap = {
    normal: { label: '정상', color: 'text-primary', dot: 'bg-primary' },
    low: { label: '부족', color: 'text-secondary', dot: 'bg-secondary' },
    high: { label: '과다', color: 'text-secondary', dot: 'bg-secondary' },
    unknown: { label: '미입력', color: 'text-on-surface-variant', dot: 'bg-outline-variant' },
  };
  const s = statusMap[status];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>{field.icon}</span>
          <span className="text-sm font-bold text-on-surface">{field.label}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${s.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <span className="text-base font-extrabold text-on-surface tabular-nums">
          {value ?? '—'}<span className="text-xs font-bold text-on-surface-variant ml-0.5">{field.unit}</span>
        </span>
      </div>

      {/* 게이지 바 */}
      <div className="relative h-2.5 rounded-full bg-surface-container overflow-hidden">
        {/* 정상 범위 영역 (30~70%) */}
        <div className="absolute top-0 bottom-0 bg-primary-container" style={{ left: '30%', width: '40%' }} />
        {/* 현재값 마커 */}
        {value != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-on-surface border-2 border-white shadow-md"
            style={{ left: `calc(${pos}% - 7px)` }}
          />
        )}
      </div>
      <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant tabular-nums">
        <span>낮음</span>
        <span>정상 {field.range[0]}–{field.range[1]} {field.unit}</span>
        <span>높음</span>
      </div>
    </div>
  );
}

function TrendChart({ history }) {
  const W = 720, H = 220, P = 32;
  const innerW = W - P * 2, innerH = H - P * 2;
  const weights = history.map(h => h.weight);
  const fats = history.map(h => h.bodyFatPercent);
  const wMin = Math.min(...weights) - 1, wMax = Math.max(...weights) + 1;
  const fMin = Math.min(...fats) - 1, fMax = Math.max(...fats) + 1;

  const xAt = (i) => P + (i / (history.length - 1)) * innerW;
  const yWeight = (v) => P + innerH - ((v - wMin) / (wMax - wMin)) * innerH;
  const yFat = (v) => P + innerH - ((v - fMin) / (fMax - fMin)) * innerH;

  const path = (vals, yFn) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yFn(v)}`).join(' ');

  const area = (vals, yFn) => {
    const top = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yFn(v)}`).join(' ');
    return `${top} L ${xAt(vals.length - 1)} ${H - P} L ${xAt(0)} ${H - P} Z`;
  };

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px] h-56">
        {/* 그리드 */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t}
            x1={P} x2={W - P}
            y1={P + t * innerH} y2={P + t * innerH}
            stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray={t === 0 || t === 1 ? '' : '2 4'} />
        ))}

        {/* 체중 영역 */}
        <path d={area(weights, yWeight)} fill="var(--color-primary)" opacity="0.08" />
        <path d={path(weights, yWeight)} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {weights.map((v, i) => (
          <circle key={`w${i}`} cx={xAt(i)} cy={yWeight(v)} r={i === weights.length - 1 ? 5 : 3} fill="var(--color-primary)" stroke="white" strokeWidth="2" />
        ))}

        {/* 체지방률 라인 */}
        <path d={path(fats, yFat)} fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4" />
        {fats.map((v, i) => (
          <circle key={`f${i}`} cx={xAt(i)} cy={yFat(v)} r={i === fats.length - 1 ? 5 : 3} fill="var(--color-secondary)" stroke="white" strokeWidth="2" />
        ))}

        {/* x축 라벨 */}
        {history.map((h, i) => (
          <text key={h.date} x={xAt(i)} y={H - 6} fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--color-on-surface-variant)">
            {h.date.slice(5).replace('-', '/')}
          </text>
        ))}

        {/* 최신 값 라벨 */}
        <text x={xAt(weights.length - 1) + 8} y={yWeight(weights[weights.length - 1]) + 4} fontSize="11" fontWeight="800" fill="var(--color-primary)">
          {weights[weights.length - 1]}kg
        </text>
        <text x={xAt(fats.length - 1) + 8} y={yFat(fats[fats.length - 1]) + 4} fontSize="11" fontWeight="800" fill="var(--color-secondary)">
          {fats[fats.length - 1]}%
        </text>
      </svg>

      <div className="flex items-center gap-5 mt-3 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-on-surface">
          <span className="w-3 h-0.5 bg-primary rounded-full" /> 체중 (kg)
        </span>
        <span className="flex items-center gap-1.5 font-bold text-on-surface">
          <span className="w-3 h-0.5 bg-secondary rounded-full" style={{ borderTop: '2px dashed' }} /> 체지방률 (%)
        </span>
      </div>
    </div>
  );
}

function BodyDiagram() {
  // 인체 도식 — 단순화된 SVG 실루엣 (placeholder 톤)
  return (
    <div className="relative w-44 mx-auto md:mx-0">
      <svg viewBox="0 0 140 200" className="w-full">
        {/* 머리 */}
        <circle cx="70" cy="22" r="14" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="1.5" />
        {/* 몸통 */}
        <rect x="50" y="42" width="40" height="60" rx="10" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="70" y="76" fontSize="9" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">몸통</text>
        {/* 왼팔 */}
        <rect x="22" y="46" width="22" height="52" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="33" y="76" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">L</text>
        {/* 오른팔 */}
        <rect x="96" y="46" width="22" height="52" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="107" y="76" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">R</text>
        {/* 왼다리 */}
        <rect x="50" y="108" width="18" height="74" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="59" y="150" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">L</text>
        {/* 오른다리 */}
        <rect x="72" y="108" width="18" height="74" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="81" y="150" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">R</text>
      </svg>
    </div>
  );
}

function SegmentRow({ segment }) {
  const status = evaluate(segment.value, segment.normal);
  const inRange = status === 'normal';
  const [lo, hi] = segment.normal;
  const span = hi - lo;
  const extLo = lo - span * 0.6, extHi = hi + span * 0.6;
  const pct = Math.max(2, Math.min(98, ((segment.value - extLo) / (extHi - extLo)) * 100));

  return (
    <div className="grid grid-cols-[80px_1fr_70px] items-center gap-3">
      <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">{segment.short}</span>
        {segment.label}
      </span>
      <div className="relative h-2 rounded-full bg-surface-container overflow-hidden">
        <div className="absolute top-0 bottom-0 bg-primary-container" style={{ left: '30%', width: '40%' }} />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${inRange ? 'bg-primary' : 'bg-secondary'}`}
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
      <span className="text-sm font-extrabold text-on-surface tabular-nums text-right">
        {segment.value}<span className="text-[10px] font-bold text-on-surface-variant ml-0.5">kg</span>
      </span>
    </div>
  );
}
