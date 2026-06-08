import { EmptyState } from '../../../shared/components/ui';
import RecommendationCards from '../../chat/components/RecommendationCards';

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
          <div className="cards">
            {[0, 1, 2].map(i => (
              <div className="skel" key={i}>
                <div className="skel-img"></div>
                <div className="skel-body">
                  <div className="skel-line short"></div>
                  <div className="skel-line long"></div>
                  <div className="skel-line med"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 네트워크/서버 오류: 가장 우선해서 노출 */}
      {!isLoading && errorMessage && (
        <EmptyState
          icon="error"
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
