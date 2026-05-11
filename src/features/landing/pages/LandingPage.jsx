// vite-port/src/landing/LandingPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import { HowItWorks, FinalCTA } from '../components/HowItWorks';
import { clearAuth } from '../../auth/utils/auth';
import '../styles/landing.css';

const ACCENTS = {
  accent1: '#9CAF88',
  accent2: '#E8A87C',
  accent3: '#D87C5A',
  darkMode: false,
};

export default function LandingPage({ onGoogleLogin, onKakaoLogin }) {
  const navigate = useNavigate();
  // Apply CSS variables for theme
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--accent-1', ACCENTS.accent1);
    r.style.setProperty('--accent-2', ACCENTS.accent2);
    r.style.setProperty('--accent-3', ACCENTS.accent3);

    if (ACCENTS.darkMode) {
      r.style.setProperty('--bg', '#0f0f10');
      r.style.setProperty('--bg-2', '#17171a');
      r.style.setProperty('--bg-3', '#1f1f23');
      r.style.setProperty('--fg', '#f5f3ee');
      r.style.setProperty('--fg-2', 'rgba(245, 243, 238, .72)');
      r.style.setProperty('--fg-3', 'rgba(245, 243, 238, .48)');
      r.style.setProperty('--line', 'rgba(245, 243, 238, .08)');
      r.style.setProperty('--line-2', 'rgba(245, 243, 238, .14)');
    } else {
      r.style.setProperty('--bg', '#ffffff');
      r.style.setProperty('--bg-2', '#ffffff');
      r.style.setProperty('--bg-3', '#f3f1ec');
      r.style.setProperty('--fg', '#1a1a1a');
      r.style.setProperty('--fg-2', 'rgba(26, 26, 26, .72)');
      r.style.setProperty('--fg-3', 'rgba(26, 26, 26, .48)');
      r.style.setProperty('--line', 'rgba(26, 26, 26, .08)');
      r.style.setProperty('--line-2', 'rgba(26, 26, 26, .14)');
    }
  }, []);

  const handleLogin = () => {
    if (onGoogleLogin) onGoogleLogin();
    else console.log('[MealBot] Google login triggered — connect OAuth here');
  };

  const handleKakaoLogin = () => {
    if (onKakaoLogin) onKakaoLogin();
  };

  const handleGuestLogin = () => {
    clearAuth();
    navigate('/main');
  };

  const a = ACCENTS;

  return (
    <div className="landing-root">
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-brand-mark"></div>
          MealBot
        </div>
        {/* <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
        </div> */}
        <button className="nav-cta" onClick={handleLogin}>
          <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.3 2-6.9 2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.9 5.5l6 5C40.9 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"/>
          </svg>
          로그인
        </button>
      </nav>

      <Hero accent1={a.accent1} accent2={a.accent2} accent3={a.accent3} onLogin={handleLogin} onGuestLogin={handleGuestLogin} onKakaoLogin={handleKakaoLogin} />
      <Features accent1={a.accent1} accent2={a.accent2} accent3={a.accent3} />
      <HowItWorks accent1={a.accent1} accent2={a.accent2} accent3={a.accent3} />
      <FinalCTA accent1={a.accent1} accent2={a.accent2} accent3={a.accent3} onLogin={handleLogin} />
    </div>
  );
}
