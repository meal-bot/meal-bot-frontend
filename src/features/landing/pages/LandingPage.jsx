// vite-port/src/landing/LandingPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import '../styles/landing.css';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=2200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=2200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=2200&q=80&auto=format&fit=crop',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeBg, setActiveBg] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const id = window.setInterval(() => {
      setActiveBg((current) => (current + 1) % BACKGROUND_IMAGES.length);
    }, 10000);

    return () => window.clearInterval(id);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-root">
      {BACKGROUND_IMAGES.map((image, index) => (
        <div
          key={image}
          className={`landing-photo-bg ${index === activeBg ? 'is-active' : ''}`}
          style={{ backgroundImage: `url("${image}")` }}
        />
      ))}
      <div className="landing-veil" />
      <div className="landing-scrim" />
      <div className="landing-grain" />

      <nav className="nav">
        <div className="nav-brand">
          <span className="nav-brand-dot" />
          OBOB
        </div>
      </nav>

      <Hero onStart={handleLogin} />

      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="footer-dot" />
          OBOB
        </div>
        <div className="footer-right">
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
          <span>© 2026 OBOB · 당신의 하루에 어울리는 한 끼</span>
        </div>
      </footer>
    </div>
  );
}
