import RecommendationCards from '../../chat/components/RecommendationCards';

export default function ResultsPanel({ isLoading, results, messageText, errorMessage }) {
  return (
    <section className="results">
      <div className="results-head">
        <div className="results-title">
          AI <em>추천 메뉴</em>
        </div>
        <div className="results-meta">
          {isLoading ? '분석 중' : results.length > 0 ? `${results.length} matches` : 'awaiting input'}
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
        <div className="card-empty" style={{ color: 'var(--danger, #c0392b)' }}>
          {errorMessage}
        </div>
      )}

      {/* 0건 폴백 안내 (백엔드가 FALLBACK_MESSAGE 보낸 경우) */}
      {!isLoading && !errorMessage && results.length === 0 && messageText && (
        <div className="card-empty">{messageText}</div>
      )}

      {/* 완전 초기 상태 */}
      {!isLoading && !errorMessage && results.length === 0 && !messageText && (
        <div className="card-empty">
          왼쪽 냉장고에서 재료를 골라{' '}
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>셰프</span>에게 건네주세요.<br />
          AI가 어울리는 메뉴 2~3가지를 골라드립니다.
        </div>
      )}

      {/* 정상 추천: AI 안내 문구 + 추천 카드 (챗봇과 동일 컴포넌트 재사용) */}
      {!isLoading && !errorMessage && results.length > 0 && (
        <>
          {messageText && (
            <div className="results-message" style={{ margin: '8px 0 4px', fontSize: 13, color: 'var(--ink-muted, #555)' }}>
              {messageText}
            </div>
          )}
          <RecommendationCards recommendations={results} />
        </>
      )}
    </section>
  );
}
