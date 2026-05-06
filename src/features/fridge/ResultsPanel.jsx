export default function ResultsPanel({ picked, isLoading, results }) {
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

      {!isLoading && results.length === 0 && (
        <div className="card-empty">
          왼쪽 냉장고에서 재료를 골라{' '}
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>셰프</span>에게 건네주세요.<br />
          AI가 어울리는 메뉴 2~3가지를 골라드립니다.
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="cards">
          {results.map((r, idx) => {
            const matched = r.needs.filter(n => picked.includes(n));
            return (
              <div
                className="rcard"
                key={r.id}
                style={{ animationDelay: `${idx * 0.12}s` }}
              >
                <div className={`rcard-img ${r.img}`}>
                  {r.img === 'salad' && '🥗'}
                  {r.img === 'bowl' && '🍱'}
                  {r.img === 'soup' && '🍲'}
                  {r.img === 'pasta' && '🍝'}
                  {r.img === 'taco' && '🌮'}
                </div>
                <div className="rcard-body">
                  <div className="rcard-eyebrow">{r.kicker}</div>
                  <div className="rcard-name">{r.name}</div>
                  <div className="rcard-meta">
                    <span>⏱ <b>{r.time}분</b></span>
                    <span>🔥 <b>{r.kcal}kcal</b></span>
                    <span>난이도 <b>{r.level}</b></span>
                    <span>매치 <b>{matched.length}/{r.needs.length}</b></span>
                  </div>
                </div>
                <button className="rcard-cta" aria-label="레시피 보기">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
