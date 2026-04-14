import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Navigationbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="fixed top-0 w-full z-50 border-b border-outline-variant/30"
      style={{ background: 'rgb(255, 255, 255)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto w-full">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-on-surface">
          Meal-Bot
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            로그인
          </Link>
          |
          <Link
            to="/signup"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            회원가입
          </Link>
          <div className="relative" ref={dropdownRef}>
            <span
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors select-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              account_circle
            </span>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-outline-variant/30 bg-white/95 shadow-lg backdrop-blur-sm py-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-base">person</span>
                  프로필
                </Link>
                <hr className="my-1 border-outline-variant/30" />
                <button
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  로그아웃
                </button>
                <hr className="my-1 border-outline-variant/30" />
                <button
                  disabled
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-on-surface-variant/50 cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">help_outline</span>
                  추가 예정
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
