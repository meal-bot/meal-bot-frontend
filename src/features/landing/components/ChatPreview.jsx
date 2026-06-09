import { useState, useEffect } from 'react';

const SCRIPT = [
  { who: 'user', text: '가볍게 먹을 점심 메뉴 추천해줘' },
  { who: 'bot', text: '점심에 가볍게 드시기 좋은 선택으로 연어 포케볼과 베지터블 타코를 골라봤어요. 편한 걸로 골라서 산뜻하게 즐겨보세요!' },
  {
    who: 'cards',
    cards: [
      { name: '연어 포케볼', ingredients: ['연어', '아보카도', '현미밥'], cookingTime: 15, summary: '고단백 저칼로리, 점심으로 완벽한 조합이에요.' },
      { name: '베지터블 타코', ingredients: ['또띠아', '블랙빈', '옥수수'], cookingTime: 10, summary: '가볍고 든든하게 채워주는 비건 메뉴예요.' },
    ],
  },
  { who: 'user', text: '닭가슴살이 들어갔으면 좋겠어' },
  { who: 'bot', text: '닭가슴살을 넣어 단백질 챙기기 좋은 쪽으로 바꿔봤어요. 점심으로 가볍게 즐겨보세요!' },
  {
    who: 'cards',
    cards: [
      { name: '닭가슴살 포케볼', ingredients: ['닭가슴살', '아보카도', '현미밥'], cookingTime: 15, summary: '고단백 저지방, 든든하게 즐기는 한 끼예요.' },
      { name: '닭가슴살 타코', ingredients: ['또띠아', '닭가슴살', '옥수수'], cookingTime: 12, summary: '단백질 가득, 가볍게 채워주는 메뉴예요.' },
    ],
  },
];

export default function ChatPreview({ accent1 }) {
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

  // Completed steps render fully; the current step renders as it types
  // (cards show immediately when the step lands on them).
  const items = [];
  for (let i = 0; i <= step && i < SCRIPT.length; i++) {
    const entry = SCRIPT[i];
    if (i < step) {
      items.push({ ...entry, idx: i });
    } else if (entry.who === 'cards') {
      items.push({ ...entry, idx: i });
    } else {
      items.push({ ...entry, text: typed, typing: true, idx: i });
    }
  }

  // Group each bot bubble with its following cards into one "turn",
  // mirroring the real chat where recommendations sit under the message.
  const turns = [];
  items.forEach((m) => {
    const prev = turns[turns.length - 1];
    if (m.who === 'cards' && prev && prev.who === 'bot') {
      prev.cards = m.cards;
    } else {
      turns.push({ ...m });
    }
  });

  return (
    <div className="chat-sim">
      <div className="chat-window">
        <div className="chat-header">
          <span className="chat-dot" style={{ background: accent1 }}></span>
          <span style={{ fontSize: 11, color: 'var(--fg-2)', letterSpacing: '.04em' }}>
            OBOB · AI 영양 어시스턴트
          </span>
        </div>
        <div className="chat-body">
          {turns.map((m) => (
            <div key={m.idx} className={`chat-turn chat-turn-${m.who}`}>
              <div className={`bubble bubble-${m.who}`}>
                {m.who === 'bot' && (
                  <div className="bot-avatar">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#5c7a68' }}>smart_toy</span>
                  </div>
                )}
                <div className="bubble-text">
                  {m.text}
                  {m.typing && showCursor && <span className="cursor" />}
                </div>
              </div>

              {m.cards && (
                <div className="meal-cards-row">
                  {m.cards.map((c, i) => (
                    <div key={i} className="rec-card" style={{ animationDelay: `${i * 140}ms` }}>
                      <div className="rec-card-header">
                        <span className="rec-badge">{i + 1}</span>
                        <span className="rec-name">{c.name}</span>
                      </div>
                      <div className="rec-tags">
                        {c.ingredients.map((ing, j) => (
                          <span key={j} className="rec-tag">{ing}</span>
                        ))}
                        <span className="rec-time">
                          <span className="material-symbols-outlined" style={{ fontSize: 11 }}>timer</span>
                          {c.cookingTime}분
                        </span>
                      </div>
                      <p className="rec-summary">{c.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
