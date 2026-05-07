import { ResponsiveBar } from '@nivo/bar';
import SectionTitle from './SectionTitle';
import { Card } from '../../../shared/components/ui';

export default function ComparisonBarChart({ metric, myValue, avgValue, title, sub, children }) {
  return (
    <Card>
      <SectionTitle eyebrow="COMPARISON" title={title} sub={sub} />
      <div className="h-48 mt-6">
        <ResponsiveBar
          data={[{ metric, 나: myValue ?? 0, 평균: avgValue }]}
          keys={['나', '평균']}
          indexBy="metric"
          layout="horizontal"
          groupMode="grouped"
          margin={{ top: 10, right: 80, bottom: 10, left: 40 }}
          padding={0.3}
          innerPadding={4}
          colors={['var(--color-primary)', 'var(--color-outline-variant)']}
          borderRadius={6}
          axisLeft={null}
          axisBottom={null}
          axisRight={{ tickSize: 0, tickPadding: 8, format: v => v }}
          enableGridX
          enableGridY={false}
          label={d => d.value}
          labelPosition="end"
          labelOffset={8}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[{
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 80,
            itemWidth: 70,
            itemHeight: 20,
            itemsSpacing: 4,
            symbolSize: 10,
            symbolShape: 'circle',
          }]}
          animate
        />
      </div>
      {children}
    </Card>
  );
}
