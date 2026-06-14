import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { Button, EmptyState, PageHeader } from '../../../shared/components/ui';
import { deleteInbody, fetchInbodyList } from '../api/inbodyApi';
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
      .catch(() => console.error('인바디 기록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false));
  }, []);

  const current = records[0] ?? null;
  const previous = records[1] ?? null;
  const chartHistory = [...records].reverse().map(record => ({
    ...record,
    date: record.measuredAt?.slice(0, 10) ?? record.date ?? '',
  }));
  const goToNewMeasure = () => navigate('/inbody/new');

  const handleDeleteRecord = async (record) => {
    if (!record?.inbodyId) return;

    const confirmed = window.confirm('이 인바디 기록을 삭제할까요?');
    if (!confirmed) return;

    try {
      await deleteInbody(record.inbodyId);
      setRecords(prev => prev.filter(item => item.inbodyId !== record.inbodyId));
    } catch (error) {
      console.error('인바디 기록 삭제에 실패했습니다.', error);
      window.alert('기록을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <Layout>
      <div className="mx-auto flex max-w-[1120px] flex-col gap-5 px-0 pb-10">
        <PageHeader
          eyebrow="Health Record"
          title="인바디 기록"
          description={`최근 입력일: ${formatDate(current?.measuredAt ?? current?.date)}`}
          className="mb-1"
          actions={(
            <Button
              onClick={goToNewMeasure}
              size="lg"
              className="whitespace-nowrap shadow-sm"
            >
              <span className="material-symbols-outlined text-base">add</span>
              새 기록
            </Button>
          )}
        />

        {isLoading && (
          <p className="py-12 text-center text-sm text-on-surface-variant">
            기록을 불러오는 중입니다.
          </p>
        )}

        {!isLoading && records.length === 0 && (
          <EmptyState
            icon="monitoring"
            title="아직 입력된 인바디 기록이 없습니다"
            description="첫 기록을 입력하면 BMI, 권장 칼로리, 체중 변화 흐름을 확인할 수 있습니다."
            className="py-16"
            action={(
              <Button onClick={goToNewMeasure} size="lg">
                첫 기록 입력하기
              </Button>
            )}
          />
        )}

        {!isLoading && current && (
          <>
            <BmiHeroCard current={current} previous={previous} />
            <InBodySummaryCards current={current} previous={previous} />
            <InBodyTrendCard history={chartHistory} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <InBodyMetabolismCard current={current} />
              <InBodyCompositionCard current={current} onNewMeasure={goToNewMeasure} />
            </div>

            <InBodyMetricsCard current={current} />
            <InBodyHistoryCard records={records} onDeleteRecord={handleDeleteRecord} />
          </>
        )}
      </div>
    </Layout>
  );
}
