import { ResponsiveLine } from '@nivo/line';
import { Card, EmptyState } from '../../../shared/components/ui';
import { formatDate, formatNumber } from '../utils/inbodyDisplay';

const chartTheme = {
  fontFamily: 'Pretendard, system-ui, sans-serif',
  text: {
    fill: 'var(--color-on-surface-variant)',
    fontSize: 12,
    fontWeight: 700,
  },
  axis: {
    ticks: {
      line: { stroke: 'transparent' },
      text: { fill: 'var(--color-on-surface-variant)', fontSize: 12, fontWeight: 700 },
    },
  },
  grid: {
    line: {
      stroke: 'var(--color-outline-variant)',
      strokeDasharray: '4 8',
      strokeOpacity: 0.6,
    },
  },
  tooltip: {
    container: {
      borderRadius: 14,
      boxShadow: '0 18px 48px rgba(30, 36, 28, 0.18)',
      fontWeight: 800,
    },
  },
  crosshair: {
    line: {
      stroke: 'var(--color-on-surface-variant)',
      strokeOpacity: 0.35,
      strokeWidth: 1,
    },
  },
};

export default function InBodyTrendCard({ history }) {
  const safeHistory = history.filter(item => item?.weight != null);
  const weightHistory = safeHistory.filter(item => item.weight != null);
  const fatHistory = safeHistory.filter(item => item.bodyFatPercent != null);

  return (
    <Card padding="lg" className="rounded-[24px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Trend
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">시간 추이</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            체중과 체지방률을 각각의 단위로 나누어 변화 흐름을 보여줍니다.
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <TrendPanel
          title="체중"
          unit="kg"
          color="var(--color-primary)"
          chipClassName="bg-primary-container text-primary"
          history={weightHistory}
          valueKey="weight"
          emptyDescription="측정 기록이 2개 이상 쌓이면 체중 추이가 표시됩니다."
        />
        <TrendPanel
          title="체지방률"
          unit="%"
          color="var(--color-secondary)"
          chipClassName="bg-secondary-container text-secondary"
          history={fatHistory}
          valueKey="bodyFatPercent"
          emptyDescription="선택 입력 항목을 입력하면 체지방률 추이를 볼 수 있습니다."
        />
      </div>
    </Card>
  );
}

function TrendPanel({ title, unit, color, chipClassName, history, valueKey, emptyDescription }) {
  const hasTrend = history.length >= 2;
  const latest = history.at(-1);

  return (
    <section className="rounded-2xl border border-outline-variant/35 bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-black text-on-surface">{title}</h4>
          <p className="mt-1 text-xs font-bold text-on-surface-variant">단위: {unit}</p>
        </div>
        {latest && (
          <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${chipClassName}`}>
            최근 {formatNumber(latest[valueKey])}
            {unit}
          </span>
        )}
      </div>

      <div className="mt-4 h-[260px]">
        {hasTrend ? (
          <ResponsiveLine
            data={buildSingleSeries(history, title, valueKey, unit)}
            margin={{ top: 18, right: 16, bottom: 48, left: 16 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            yFormat={value => `${formatNumber(value)}${unit}`}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 14,
              format: value => String(value).slice(5),
            }}
            axisLeft={null}
            enableGridX={false}
            enableGridY
            colors={[color]}
            lineWidth={4}
            pointSize={9}
            pointColor={{ from: 'color' }}
            pointBorderWidth={3}
            pointBorderColor="#ffffff"
            enableArea
            areaOpacity={0.08}
            useMesh
            animate
            motionConfig="gentle"
            theme={chartTheme}
            tooltip={({ point }) => (
              <TrendTooltip point={point} unit={unit} />
            )}
          />
        ) : (
          <EmptyState
            icon="show_chart"
            title={`${title} 기록이 부족합니다.`}
            description={emptyDescription}
            className="h-full border-outline-variant/35 bg-surface-container/45"
          />
        )}
      </div>
    </section>
  );
}

function buildSingleSeries(history, title, valueKey, unit) {
  return [
    {
      id: title,
      data: history.map(item => ({
        x: formatDate(item.date),
        y: Number(item[valueKey]),
        rawValue: item[valueKey],
        unit,
      })),
    },
  ];
}

function TrendTooltip({ point, unit }) {
  const { serieId, data, color } = point;

  return (
    <div className="rounded-2xl bg-white px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 flex items-center gap-2 text-on-surface">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        {serieId}
      </div>
      <div className="text-on-surface-variant">{data.xFormatted}</div>
      <div className="mt-1 text-sm font-black text-on-surface">
        {formatNumber(data.rawValue)}
        {unit}
      </div>
    </div>
  );
}
