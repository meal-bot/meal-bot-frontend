// vite-port/src/landing/Hero.jsx
import ChatPreview from './ChatPreview';

export default function Hero({ onStart }) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            AI MEAL ASSISTANT
          </span>

          <h1 className="hero-title">
            <span className="title-line">AI와 대화하며 찾는</span>
            <span className="title-line"><span className="title-accent">오늘의 맞춤</span> 식단</span>
          </h1>

          <p className="hero-sub">
            복잡한 검색은 그만. 그냥 말 걸듯 이야기하면,
            지금 먹기 좋은 한 끼를 OBOB이 골라드려요.
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
