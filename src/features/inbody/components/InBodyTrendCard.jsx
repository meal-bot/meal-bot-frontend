import { Card, EmptyState } from '../../../shared/components/ui';
import { formatDate, formatNumber } from '../utils/inbodyDisplay';

export default function InBodyTrendCard({ history }) {
  const safeHistory = history.filter(item => item?.weight != null);
  const hasFatTrend = safeHistory.filter(item => item.bodyFatPercent != null).length >= 2;

  return (
    <Card padding="lg" className="rounded-[24px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Trend
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">시간 추이</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            {hasFatTrend
              ? '체중과 체지방률 변화를 함께 확인합니다.'
              : '필수 입력만 있는 경우 체중 변화 중심으로 추이를 보여줍니다.'}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
          <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-full bg-primary" />체중</span>
          {hasFatTrend && (
            <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-full bg-secondary" />체지방률</span>
          )}
        </div>
      </div>

      <div className="mt-7">
        {safeHistory.length >= 2 ? (
          <TrendSvg history={safeHistory} hasFatTrend={hasFatTrend} />
        ) : (
          <EmptyState
            icon="show_chart"
            title="추이를 보려면 기록이 더 필요합니다"
            description="측정 기록이 2개 이상 쌓이면 변화 그래프가 표시됩니다."
            className="bg-white"
          />
        )}
      </div>
    </Card>
  );
}

function TrendSvg({ history, hasFatTrend }) {
  const W = 1000;
  const H = 290;
  const P = 52;
  const weights = history.map(item => Number(item.weight));
  const fats = history.map(item => item.bodyFatPercent == null ? null : Number(item.bodyFatPercent));
  const weightMin = Math.min(...weights) - 1;
  const weightMax = Math.max(...weights) + 1;
  const fatValues = fats.filter(value => value != null);
  const fatMin = hasFatTrend ? Math.min(...fatValues) - 1 : 0;
  const fatMax = hasFatTrend ? Math.max(...fatValues) + 1 : 1;
  const innerW = W - P * 2;
  const innerH = H - P * 2;

  const xAt = index => P + (index / (history.length - 1)) * innerW;
  const yAt = (value, min, max) => P + innerH - ((value - min) / (max - min || 1)) * innerH;
  const pathFrom = (values, min, max) => {
    let started = false;
    return values
      .map((value, index) => {
        if (value == null) return null;
        const command = started ? 'L' : 'M';
        started = true;
        return `${command} ${xAt(index)} ${yAt(value, min, max)}`;
      })
      .filter(Boolean)
      .join(' ');
  };

  const weightPath = pathFrom(weights, weightMin, weightMax);
  const fatPath = hasFatTrend ? pathFrom(fats, fatMin, fatMax) : '';

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[290px] min-w-[720px] w-full">
        {[0, 0.25, 0.5, 0.75, 1].map(tick => (
          <line
            key={tick}
            x1={P}
            x2={W - P}
            y1={P + tick * innerH}
            y2={P + tick * innerH}
            stroke="var(--color-outline-variant)"
            strokeOpacity="0.45"
            strokeDasharray={tick === 0 || tick === 1 ? '' : '4 8'}
          />
        ))}

        <path d={weightPath} fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {hasFatTrend && (
          <path d={fatPath} fill="none" stroke="var(--color-secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 8" />
        )}

        {weights.map((value, index) => (
          <circle
            key={`weight-${history[index].date}-${index}`}
            cx={xAt(index)}
            cy={yAt(value, weightMin, weightMax)}
            r={index === weights.length - 1 ? 7 : 5}
            fill="var(--color-primary)"
            stroke="white"
            strokeWidth="3"
          />
        ))}
        {hasFatTrend && fats.map((value, index) => value == null ? null : (
          <circle
            key={`fat-${history[index].date}-${index}`}
            cx={xAt(index)}
            cy={yAt(value, fatMin, fatMax)}
            r={index === fats.length - 1 ? 7 : 5}
            fill="var(--color-secondary)"
            stroke="white"
            strokeWidth="3"
          />
        ))}

        {history.map((item, index) => (
          <text
            key={`date-${item.date}-${index}`}
            x={xAt(index)}
            y={H - 14}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="var(--color-on-surface-variant)"
          >
            {formatDate(item.date).slice(5)}
          </text>
        ))}

        <text
          x={xAt(weights.length - 1) - 10}
          y={yAt(weights[weights.length - 1], weightMin, weightMax) - 16}
          textAnchor="end"
          fontSize="15"
          fontWeight="900"
          fill="var(--color-primary)"
        >
          {formatNumber(weights[weights.length - 1])}kg
        </text>
        {hasFatTrend && (
          <text
            x={xAt(fats.length - 1) + 12}
            y={yAt(fats[fats.length - 1], fatMin, fatMax) + 6}
            fontSize="15"
            fontWeight="900"
            fill="var(--color-secondary)"
          >
            {formatNumber(fats[fats.length - 1])}%
          </text>
        )}
      </svg>
    </div>
  );
}
