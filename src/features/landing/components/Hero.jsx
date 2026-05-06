// vite-port/src/landing/Hero.jsx
import { useState, useEffect } from 'react';

function ChatSimulator({ accent1, accent2, accent3 }) {
  const SCRIPT = [
    { who: 'user', text: '오늘 점심 뭐 먹지? 가볍고 단백질 많은 걸로' },
    { who: 'bot', text: '체성분 데이터 보니 단백질 부족하시네요. 이런 메뉴 어때요?' },
    { who: 'cards' },
  ];

  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((s) => !s), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (step >= SCRIPT.length) {
      const id = setTimeout(() => { setStep(0); setTyped(''); }, 4200);
      return () => clearTimeout(id);
    }
    const cur = SCRIPT[step];
    if (cur.who === 'cards') {
      const id = setTimeout(() => setStep(step + 1), 2400);
      return () => clearTimeout(id);
    }
    if (typed.length < cur.text.length) {
      const id = setTimeout(() => setTyped(cur.text.slice(0, typed.length + 1)), 32 + Math.random() * 30);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => { setStep(step + 1); setTyped(''); }, 700);
    return () => clearTimeout(id);
  }, [step, typed]);

  const visible = [];
  for (let i = 0; i < step; i++) {
    if (SCRIPT[i].who !== 'cards') visible.push({ ...SCRIPT[i], full: true });
  }
  if (step < SCRIPT.length && SCRIPT[step].who !== 'cards') {
    visible.push({ ...SCRIPT[step], text: typed, typing: true });
  }
  const showCards = step >= 2;

  return (
    <div className="chat-sim">
      <div className="chat-window">
        <div className="chat-header">
          <span className="chat-dot" style={{ background: accent1 }}></span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', letterSpacing: '.04em' }}>
            MealBot · AI 영양 어시스턴트
          </span>
        </div>
        <div className="chat-body">
          {visible.map((m, i) => (
            <div key={i} className={`bubble bubble-${m.who}`}>
              {m.who === 'bot' && (
                <div className="bot-avatar" style={{ background: `linear-gradient(135deg, ${accent1}, ${accent2})` }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                  </svg>
                </div>
              )}
              <div className="bubble-text">
                {m.text}
                {m.typing && showCursor && <span className="cursor">▍</span>}
              </div>
            </div>
          ))}

          {showCards && (
            <div className="meal-cards-row">
              {[
                { name: '연어 포케볼', kcal: '450', tag: '단백', hue: accent2 },
                { name: '베지터블 타코', kcal: '280', tag: '비건', hue: accent1 },
                { name: '펌킨 스프', kcal: '190', tag: '저칼', hue: accent3 },
              ].map((c, i) => (
                <div key={i} className="meal-card" style={{ animationDelay: `${i * 140}ms` }}>
                  <div className="meal-img" style={{ background: `linear-gradient(135deg, ${c.hue}, ${c.hue}aa)` }}>
                    <div className="meal-img-grain"></div>
                  </div>
                  <div className="meal-tag" style={{ color: c.hue }}>{c.tag}</div>
                  <div className="meal-name">{c.name}</div>
                  <div className="meal-kcal">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    {c.kcal} kcal
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ accent1, accent2, accent3, onLogin, onGuestLogin }) {
  return (
    <section className="hero">
      <div className="blob blob-1" style={{ background: accent1 }}></div>
      <div className="blob blob-2" style={{ background: accent2 }}></div>
      <div className="blob blob-3" style={{ background: accent3 }}></div>
      <div className="grain"></div>

      <div className="hero-grid">
        <div className="hero-copy">
          {/* <div className="eyebrow">
            <span className="eyebrow-dot" style={{ background: accent1 }}></span>
            AI Nutrition Coach · MealBot
          </div> */}
          <h1 className="hero-title">
            당신의 하루에<br />
            <span className="title-accent">
              어울리는 한 끼
              <svg className="underline-svg" viewBox="0 0 320 14" preserveAspectRatio="none">
                <path d="M2 9 Q 80 2, 160 7 T 318 5" stroke={accent2} strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          <p className="hero-sub">
            체성분 데이터를 읽고, 대화로 풀어내는 AI 영양사.<br />
            매일 바뀌는 컨디션에 맞춘 식단을 30초 안에 받아보세요.
          </p>

          <div className="cta-row">
            <button className="btn-guest" onClick={onGuestLogin}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"></svg>
              게스트로 둘러보기
            </button>
            <button className="btn-google" onClick={onLogin}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.3 2-6.9 2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.9 5.5l6 5C40.9 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
              Google 계정으로 시작하기
            </button>
            <a href="#how" className="btn-ghost">
              어떻게 동작하나요?
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>

          <div className="trust-row">
            <div className="trust-stars">
              {[0,1,2,3,4].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={accent2}>
                  <path d="M12 2l3 7 7 .5-5.5 4.7L18 21l-6-3.6L6 21l1.5-6.8L2 9.5 9 9z"/>
                </svg>
              ))}
            </div>
            <span>2,800+명이 매일 식단을 추천받고 있어요</span>
          </div>
        </div>

        <div className="hero-visual">
          <ChatSimulator accent1={accent1} accent2={accent2} accent3={accent3} />
        </div>
      </div>

      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
