// vite-port/src/landing/HowItWorks.jsx

function Step({ num, title, desc, accent, children }) {
  return (
    <div className="step">
      <div className="step-num" style={{ color: accent }}>
        {num.toString().padStart(2, '0')}
        <div className="step-bar" style={{ background: accent }}></div>
      </div>
      <h3 className="step-title">{title}</h3>
      <p className="step-desc">{desc}</p>
      <div className="step-visual">{children}</div>
    </div>
  );
}

export function HowItWorks({ accent1, accent2, accent3 }) {
  return (
    <section className="how" id="how">
      <div className="section-head">
        <div className="section-eyebrow" style={{ color: accent2 }}>How it works</div>
        <h2 className="section-title">30초면 충분합니다.</h2>
      </div>

      <div className="steps">
        <Step num={1} title="Google로 시작" desc="별도 가입 없이 구글 계정으로 30초 만에 입장." accent={accent1}>
          <div className="step-vis step-vis-1">
            <div className="g-pill">
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.3 2-6.9 2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.9 5.5l6 5C40.9 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>
              your.email@gmail.com
            </div>
          </div>
        </Step>
        <Step num={2} title="체성분 입력" desc="InBody 결과를 한 번 입력하거나, 사진으로 자동 인식." accent={accent2}>
          <div className="step-vis step-vis-2">
            <div className="meta-row"><span>체중</span><b>72.3 kg</b></div>
            <div className="meta-row"><span>골격근</span><b style={{ color: accent2 }}>32.1 kg</b></div>
            <div className="meta-row"><span>체지방</span><b>15.6 %</b></div>
          </div>
        </Step>
        <Step num={3} title="대화하면 끝" desc="원하는 끼니를 말하세요. AI가 즉시 추천을 띄웁니다." accent={accent3}>
          <div className="step-vis step-vis-3">
            <div className="msg-out">저녁 가볍게 먹고 싶어</div>
            <div className="msg-in" style={{ borderColor: `${accent3}55` }}>
              <span style={{ color: accent3 }}>✦</span> 그릴드 베지터블 타코 어때요?
            </div>
          </div>
        </Step>
      </div>
    </section>
  );
}

export function FinalCTA({ accent1, accent2, accent3, onGoogleLogin, onKakaoLogin }) {
  return (
    <section className="final-cta">
      <div className="cta-card">
        <div className="cta-shimmer">
          <div className="shimmer-blob" style={{ background: accent1 }}></div>
          <div className="shimmer-blob" style={{ background: accent2, left: '60%' }}></div>
          <div className="shimmer-blob" style={{ background: accent3, left: '30%', top: '50%' }}></div>
        </div>
        <div className="cta-inner">
          <div className="cta-eyebrow">Ready when you are</div>
          <h2 className="cta-headline">
            오늘 메뉴,<br />
            <em>AI에게</em> 물어보세요.
          </h2>
          <p className="cta-sub">무료. 가입 없이 구글 로그인 한 번이면 시작됩니다.</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button className="btn-google btn-google-lg" onClick={onGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.3 2-6.9 2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.9 5.5l6 5C40.9 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
              Google 계정으로 시작하기
            </button>
            <button className="btn-kakao btn-google-lg" onClick={onKakaoLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919" aria-hidden="true">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.599 1.576 4.878 3.938 6.3-.173.616-.627 2.233-.717 2.58-.112.43.158.425.332.31.137-.092 2.167-1.47 3.046-2.065.457.063.926.095 1.401.095 5.523 0 10-3.477 10-7.72C22 6.477 17.523 3 12 3z"/>
              </svg>
              Kakao 계정으로 시작하기
            </button>
          </div>
          <div className="cta-fineprint">
            로그인 시 <a href="#">서비스 약관</a> 및 <a href="#">개인정보 처리방침</a>에 동의하게 됩니다.
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-brand">MealBot</div>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-copy">© 2026 MealBot · 당신의 하루에 어울리는 한 끼</div>
      </footer>
    </section>
  );
}
