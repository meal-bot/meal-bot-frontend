import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { Badge, Button, Card, EmptyState, PageHeader } from '../../../shared/components/ui';
import { ADVANCED_FIELDS, AVG_STATS } from '../data/inbodyData';
import { fetchInbodyList } from '../api/inbodyApi';
import SectionTitle from '../components/SectionTitle';
import ScoreRing from '../components/ScoreRing';
import DeltaStat from '../components/DeltaStat';
import GaugeRow from '../components/GaugeRow';
import TrendChart from '../components/TrendChart';
import ComparisonBarChart from '../components/ComparisonBarChart';

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

  const curr = records[0] ?? null;
  const prev = records[1] ?? null;
  const chartHistory = [...records].reverse().map(r => ({
    ...r,
    date: r.measuredAt?.slice(0, 10) ?? r.date ?? '',
  }));

  const weightDelta = curr && prev ? (curr.weight - prev.weight).toFixed(1) : null;
  const bmiDelta = curr && prev ? (curr.bmi - prev.bmi).toFixed(1) : null;
  const scoreDelta = curr?.score && prev?.score ? curr.score - prev.score : 0;
  const bmiGrade = curr?.bmi != null ? getBmiGrade(curr.bmi) : null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        <PageHeader
          eyebrow="인바디 대시보드"
          title="내 체성분 분석"
          description={`최근 입력 · ${curr?.measuredAt?.slice(0, 10)?.replace(/-/g, '. ') ?? '-'}`}
          className="mb-2"
          actions={(
            <Button
              onClick={() => navigate('/inbody/new')}
              size="lg"
              className="shadow-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">add</span>
              새 측정
            </Button>
          )}
        />

        {isLoading && (
          <p className="text-sm text-on-surface-variant text-center py-12">불러오는 중...</p>
        )}
        {!isLoading && records.length === 0 && (
          <EmptyState
            icon="monitoring"
            title="아직 측정 기록이 없습니다"
            description="첫 기록을 입력하면 체성분 변화와 맞춤 식단 추천을 볼 수 있습니다."
            className="py-16"
            action={(
              <Button
                onClick={() => navigate('/inbody/new')}
                size="lg"
              >
                첫 측정 기록하기
              </Button>
            )}
          />
        )}

        {/* ───── 1. 점수/등급 요약 카드 ───── */}
        <Card padding="none" className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 p-8">
            <div className="flex items-center justify-center">
              <ScoreRing score={curr?.score ?? 0} delta={scoreDelta} />
            </div>
            <div className="flex flex-col gap-5 justify-center">
              <div>
                <Badge variant="primary" size="sm" className="uppercase tracking-widest mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {curr?.grade ?? '-'}
                </Badge>
                <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
                  {curr?.bodyType ?? '-'} 체형
                </h2>
                <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  근육량과 체지방이 균형 잡힌 상태입니다. 현재 페이스를 유지하세요.
                </p>
              </div>
              <div className="grid grid-cols-5 gap-3 pt-3 border-t border-outline-variant/40">
                <DeltaStat label="체중" value={curr ? `${curr.weight} kg` : '-'} delta={weightDelta} good={weightDelta <= 0} />
                <DeltaStat label="키" value={curr ? `${curr.height} cm` : '-'} />
                <DeltaStat label="나이" value={curr ? `${curr.age} 세` : '-'} />
                <DeltaStat label="성별" value={curr?.gender ?? '-'} />
                <DeltaStat label="BMI" value={curr ? `${curr.bmi}` : '-'} delta={bmiDelta} good={bmiDelta <= 0} />
              </div>
            </div>
          </div>
        </Card>

        {/* ───── 2. 비교 차트 ───── */}
        <ComparisonBarChart
          metric="BMI"
          myValue={curr?.bmi}
          avgValue={AVG_STATS.bmi}
          title="BMI"
          sub="내 BMI vs 동일 성별·연령대 평균"
        >
          {bmiGrade && (
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-outline-variant/30">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">판정</span>
              <Badge variant="muted" size="md" className={bmiGrade.color}>
                {bmiGrade.label}
              </Badge>
              <span className="text-xs text-on-surface-variant">BMI {curr.bmi}</span>
            </div>
          )}
        </ComparisonBarChart>
        <Card>
          <SectionTitle eyebrow="METABOLISM" title="기초대사량 (BMR)" sub="아무것도 하지 않아도 하루에 소모되는 칼로리" />
          <div className="flex items-center gap-8 mt-6 flex-wrap">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">내 BMR</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold text-on-surface tabular-nums">{curr?.bmr?.toLocaleString() ?? '—'}</span>
                <span className="text-sm font-bold text-on-surface-variant">kcal / day</span>
              </div>
            </div>

            <div className="w-px h-14 bg-outline-variant/40 hidden sm:block" />

            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">동일 성별·연령대 평균</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-on-surface-variant tabular-nums">{AVG_STATS.bmr.toLocaleString()}</span>
                <span className="text-xs font-bold text-on-surface-variant">kcal / day</span>
              </div>
            </div>

            {curr?.bmr && (
              <div className="sm:ml-auto">
                <Badge
                  variant={curr.bmr >= AVG_STATS.bmr ? 'primary' : 'muted'}
                  size="md"
                  className="text-sm px-4 py-2"
                >
                  {curr.bmr >= AVG_STATS.bmr ? '+' : ''}{(curr.bmr - AVG_STATS.bmr).toLocaleString()} kcal vs 평균
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* ───── 3. 일일 권장 칼로리 ───── */}
        {curr && (
          <Card variant="primary" className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-white/80 text-4xl">local_fire_department</span>
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">오늘 하루 섭취 권장 칼로리</p>
                <p className="text-sm text-white/70 leading-snug">기초대사량 × 활동계수 기준</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 shrink-0">
              {curr.dailyCalories != null
                ? <><span className="text-6xl font-extrabold text-white tabular-nums">{curr.dailyCalories.toLocaleString()}</span><span className="text-xl font-bold text-white/70">kcal</span></>
                : <span className="text-2xl font-bold text-white/60">계산 중...</span>
              }
            </div>
          </Card>
        )}

        {/* ───── 4. 항목별 게이지 ───── */}
        <Card>
          <SectionTitle eyebrow="STANDARD 8" title="항목별 분석" sub="정상 범위 대비 현재값" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
            {ADVANCED_FIELDS.map(field => (
              <GaugeRow key={field.key} field={field} value={curr?.[field.key] ?? null} />
            ))}
          </div>
        </Card>

        {/* ───── 5. 시간 추이 ───── */}
        <Card>
          <SectionTitle eyebrow="TREND · 6 MONTHS" title="시간 추이" sub="체중·체지방률 변화" />
          <div className="mt-6">
            {chartHistory.length >= 2
              ? <TrendChart history={chartHistory} />
              : <p className="text-sm text-on-surface-variant text-center py-8">측정 기록이 2개 이상이어야 추이를 볼 수 있습니다</p>
            }
          </div>
          <div className="mt-6 pt-6 border-t border-outline-variant/40">
            <div className="grid grid-cols-4 gap-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pb-2">
              <span>측정일</span>
              <span className="text-right">체중</span>
              <span className="text-right">체지방률</span>
              <span className="text-right">점수</span>
            </div>
            {records.slice(0, 4).map((h, i) => {
              const date = h.measuredAt?.slice(0, 10) ?? h.date ?? '';
              return (
                <div key={h.inbodyId ?? i} className={`grid grid-cols-4 gap-2 text-sm py-2.5 ${i === 0 ? 'font-bold text-on-surface' : 'text-on-surface-variant'} ${i < 3 ? 'border-b border-outline-variant/30' : ''}`}>
                  <span>
                    {date.replace(/-/g, '. ')}
                    {i === 0 && (
                      <Badge variant="primary" size="xs" className="ml-2 uppercase tracking-widest">
                        최신
                      </Badge>
                    )}
                  </span>
                  <span className="text-right tabular-nums">{h.weight} kg</span>
                  <span className="text-right tabular-nums">{h.bodyFatPercent}%</span>
                  <span className="text-right tabular-nums">{h.score ?? '-'}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="h-4" />
      </div>
    </Layout>
  );
}

function getBmiGrade(bmi) {
  if (bmi < 18.5) return { label: '저체중',    color: 'bg-surface-container text-on-surface-variant' };
  if (bmi < 23)   return { label: '정상',       color: 'bg-primary-container text-primary' };
  if (bmi < 25)   return { label: '과체중',     color: 'bg-secondary-container text-secondary' };
  if (bmi < 30)   return { label: '비만 1단계', color: 'bg-error-container text-error' };
  if (bmi < 35)   return { label: '비만 2단계', color: 'bg-error-container text-error' };
  return           { label: '고도비만',         color: 'bg-error-container text-error font-extrabold' };
}
