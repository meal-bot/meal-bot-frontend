// vite-port/src/landing/Hero.jsx
import ChatPreview from './ChatPreview';

export default function Hero({ onStart }) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="title-line"><span className="title-accent">오늘의 밥,</span> 제가 정해드릴게요</span>
            {/* <span className="title-line">OBOB</span> */}
          </h1>

          <p className="hero-sub">
            <span className="subtitle-line">식단 추천 에이전트가 지금 먹기 좋은 한 끼를 OBOB이 추천해드려요.</span>
          </p>

          <div className="cta-row">
            <button className="btn-guest" onClick={onStart}>
              시작하기
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <ChatPreview accent1="#6f8c56" />
        </div>
      </div>
    </section>
  );
}
