// vite-port/src/landing/Features.jsx

function FeatureCard({ accent, icon, eyebrow, title, body, visual }) {
  return (
    <div className="feature-card">
      <div className="feature-icon" style={{ background: `${accent}22`, color: accent }}>
        {icon}
      </div>
      <div className="feature-eyebrow" style={{ color: accent }}>{eyebrow}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-body">{body}</p>
      <div className="feature-visual">{visual}</div>
    </div>
  );
}

function ChatVisual({ accent1, accent2 }) {
  return (
    <div className="vis vis-chat">
      <div className="mini-bubble mini-user">오늘 야식 추천해줘</div>
      <div className="mini-bubble mini-bot" style={{ borderColor: `${accent1}55` }}>
        <span style={{ color: accent1 }}>✦</span> 단백질이 부족해 보여요
      </div>
      <div className="mini-card-row">
        <div className="mini-card" style={{ background: `linear-gradient(135deg, ${accent2}, ${accent2}88)` }}></div>
        <div className="mini-card" style={{ background: `linear-gradient(135deg, ${accent1}, ${accent1}88)` }}></div>
        <div className="mini-card" style={{ background: `linear-gradient(135deg, ${accent2}aa, ${accent1}88)` }}></div>
      </div>
    </div>
  );
}

function ChartVisual({ accent1, accent2, accent3 }) {
  return (
    <div className="vis vis-chart">
      <div className="vis-ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,.06)" strokeWidth="10" fill="none"/>
          <circle cx="50" cy="50" r="38" stroke={accent1} strokeWidth="10" fill="none"
                  strokeDasharray="160 240" strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round"/>
          <circle cx="50" cy="50" r="26" stroke={accent2} strokeWidth="6" fill="none"
                  strokeDasharray="100 165" transform="rotate(-90 50 50)" strokeLinecap="round"/>
        </svg>
        <div className="vis-ring-num">72<span>kg</span></div>
      </div>
      <div className="vis-bars">
        <div className="bar"><span style={{ width: '78%', background: accent1 }}></span></div>
        <div className="bar"><span style={{ width: '54%', background: accent2 }}></span></div>
        <div className="bar"><span style={{ width: '88%', background: accent3 }}></span></div>
      </div>
    </div>
  );
}

function MatchVisual({ accent1, accent2, accent3 }) {
  return (
    <div className="vis vis-match">
      <div className="match-line">
        <div className="match-dot match-from" style={{ background: accent1 }}>나</div>
        <svg className="match-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
          <path d="M10 30 Q 50 5, 100 30 T 190 30" stroke={accent2} strokeWidth="2" fill="none" strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.4s" repeatCount="indefinite"/>
          </path>
        </svg>
        <div className="match-dot match-to" style={{ background: accent3 }}>밥</div>
      </div>
      <div className="match-tags">
        <span style={{ borderColor: `${accent1}55`, color: accent1 }}>고단백</span>
        <span style={{ borderColor: `${accent2}55`, color: accent2 }}>저염</span>
        <span style={{ borderColor: `${accent3}55`, color: accent3 }}>비건</span>
        <span style={{ borderColor: 'rgba(255,255,255,.15)' }}>저당</span>
      </div>
    </div>
  );
}

export default function Features({ accent1, accent2, accent3 }) {
  return (
    <section className="features">
      <div className="section-head">
        <div className="section-eyebrow" style={{ color: accent1 }}>What we do</div>
        <h2 className="section-title">
          그냥 식단표가 아니라,<br />
          <em>당신을 읽는</em> 식단입니다.
        </h2>
      </div>

      <div className="feature-grid">
        <FeatureCard
          accent={accent1}
          eyebrow="01 — Conversation"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          title="대화로 풀어내는 식단"
          body="GPT 기반 영양 코치와 채팅하듯 자연스럽게 끼니를 결정하세요. 알레르기, 기분, 일정까지 반영합니다."
          visual={<ChatVisual accent1={accent1} accent2={accent2} />}
        />
        <FeatureCard
          accent={accent2}
          eyebrow="02 — Body Data"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-3 4 4 5-6"/></svg>}
          title="체성분을 읽고 그려냅니다"
          body="InBody 데이터를 자동 분석해 BMI, BMR, 부위별 균형까지 한눈에. 숫자가 아닌 맥락으로 보여드려요."
          visual={<ChartVisual accent1={accent1} accent2={accent2} accent3={accent3} />}
        />
        <FeatureCard
          accent={accent3}
          eyebrow="03 — Personalized"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
          title="딱 맞는 끼니를 매칭"
          body="당신의 체성분, 입맛, 활동량을 모두 묶어 단 하나의 끼니로 좁혀드립니다. 매일 새롭게, 매일 정확하게."
          visual={<MatchVisual accent1={accent1} accent2={accent2} accent3={accent3} />}
        />
      </div>
    </section>
  );
}
