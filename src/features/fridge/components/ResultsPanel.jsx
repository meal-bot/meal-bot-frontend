import { Card, EmptyState } from '../../../shared/components/ui';
import RecommendationCards from '../../chat/components/RecommendationCards';
import dumbAI from '../../../assets/dumb_AI.png';

export default function ResultsPanel({ isLoading, results, messageText, errorMessage }) {
  return (
    <section className="results">
      <div className="results-head">
        <div className="results-title">
          AI <em>추천 메뉴</em>
        </div>
        <div className="results-meta">
          {isLoading ? '분석 중' : results.length > 0 ? `${results.length}개 추천` : '입력 대기'}
        </div>
      </div>

      {isLoading && (
        <>
          <div className="thinking">
            <span className="thinking-dots"><span></span><span></span><span></span></span>
            냉장고 속 재료를 살펴보고, 만들 수 있는 메뉴를 찾는 중이에요…
          </div>
          <div className="grid gap-3 mt-3 w-full grid-cols-1 sm:grid-cols-2">
            {[0, 1].map(i => (
              <Card
                as="article"
                padding="none"
                key={i}
                className="fridge-rec-skel overflow-hidden flex flex-col"
                style={{ '--chat-card-index': i }}
                aria-hidden="true"
              >
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div className="flex items-start gap-2">
                    <span className="skel-badge" />
                    <span className="skel-line title" />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="skel-pill" />
                    <span className="skel-pill short" />
                    <span className="skel-time" />
                  </div>

                  <span className="skel-line long" />
                  <span className="skel-line med" />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 네트워크/서버 오류: 가장 우선해서 노출 */}
      {!isLoading && errorMessage && (
        <EmptyState
          image={dumbAI}
          imageAlt="응답을 가져오지 못한 셰프"
          title="추천 요청에 실패했습니다"
          description={errorMessage}
          className="card-empty text-error bg-transparent"
        />
      )}

      {/* 0건 폴백 안내 (백엔드가 FALLBACK_MESSAGE 보낸 경우) */}
      {!isLoading && !errorMessage && results.length === 0 && messageText && (
        <EmptyState
          icon="search_off"
          title="추천할 메뉴를 찾지 못했습니다"
          description={messageText}
          className="card-empty bg-transparent"
        />
      )}

      {/* 완전 초기 상태 */}
      {!isLoading && !errorMessage && results.length === 0 && !messageText && (
        <EmptyState
          icon="restaurant"
          title="재료를 골라주세요"
          description="왼쪽 냉장고에서 재료를 골라 셰프에게 건네주세요. AI가 어울리는 메뉴 2~3가지를 골라드립니다."
          className="card-empty bg-transparent"
        />
      )}

      {/* 정상 추천: AI 안내 문구 + 추천 카드 (챗봇과 동일 컴포넌트 재사용) */}
      {!isLoading && !errorMessage && results.length > 0 && (
        <>
          {messageText && (
            <div className="results-message">
              {messageText}
            </div>
          )}
          <RecommendationCards recommendations={results} />
        </>
      )}
    </section>
  );
}
