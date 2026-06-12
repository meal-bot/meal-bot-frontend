import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { Button, EmptyState, PageHeader } from '../../../shared/components/ui';
import { fetchInbodyList } from '../api/inbodyApi';
import BmiHeroCard from '../components/BmiHeroCard';
import InBodyCompositionCard from '../components/InBodyCompositionCard';
import InBodyHistoryCard from '../components/InBodyHistoryCard';
import InBodyMetabolismCard from '../components/InBodyMetabolismCard';
import InBodyMetricsCard from '../components/InBodyMetricsCard';
import InBodySummaryCards from '../components/InBodySummaryCards';
import InBodyTrendCard from '../components/InBodyTrendCard';
import { formatDate } from '../utils/inbodyDisplay';

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

  const current = records[0] ?? null;
  const previous = records[1] ?? null;
  const chartHistory = [...records].reverse().map(record => ({
    ...record,
    date: record.measuredAt?.slice(0, 10) ?? record.date ?? '',
  }));
  const goToNewMeasure = () => navigate('/inbody/new');

  return (
    <Layout>
      <div className="mx-auto flex max-w-[1140px] flex-col gap-6 px-0 pb-10">
        <PageHeader
          eyebrow="인바디 대시보드"
          title="내 체성분 분석"
          description={`최근 입력 · ${formatDate(current?.measuredAt ?? current?.date)}`}
          className="mb-2"
          actions={(
            <Button
              onClick={goToNewMeasure}
              size="lg"
              className="shadow-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">add</span>
              새 측정
            </Button>
          )}
        />

        {isLoading && (
          <p className="py-12 text-center text-sm text-on-surface-variant">불러오는 중...</p>
        )}

        {!isLoading && records.length === 0 && (
          <EmptyState
            icon="monitoring"
            title="아직 측정 기록이 없습니다"
            description="첫 기록을 입력하면 BMI, 권장 칼로리, 체성분 변화를 확인할 수 있습니다."
            className="py-16"
            action={(
              <Button onClick={goToNewMeasure} size="lg">
                첫 측정 기록하기
              </Button>
            )}
          />
        )}

        {!isLoading && current && (
          <>
            <BmiHeroCard current={current} previous={previous} />
            <InBodySummaryCards current={current} previous={previous} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <InBodyCompositionCard current={current} onNewMeasure={goToNewMeasure} />
              <InBodyMetabolismCard current={current} />
            </div>

            <InBodyTrendCard history={chartHistory} />
            <InBodyMetricsCard current={current} onNewMeasure={goToNewMeasure} />
            <InBodyHistoryCard records={records} />
          </>
        )}
      </div>
    </Layout>
  );
}
