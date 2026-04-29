import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { isLoggedIn, getName, clearAuth } from '../utils/auth';

// sidebarOpen: 사이드바 너비만큼 로고를 우측으로 밀어 사이드바와 겹치지 않게 함
export default function Navigationbar({ sidebarOpen = false, onChatThreadStart }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const loggedIn = isLoggedIn();
  const name = getName();

  // 드롭다운 외부 클릭 시 닫기
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
      className="fixed top-0 w-full border-b border-outline-variant/30"
      style={{ background: 'rgb(255, 255, 255)', backdropFilter: 'blur(12px)', zIndex: 'var(--z-navbar)' }}
    >
      {/* 화면 양 끝까지 확장, px-8로 최소 여백 유지 */}
      <div className="flex justify-between items-center px-8 h-20 w-full">
        {/* 사이드바 너비에 맞춰 로고 위치 이동 */}
        <Link
          to="/main"
          onClick={onChatThreadStart}
          className={`text-2xl font-bold tracking-tighter text-on-surface transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-10.5'}`}
        >
          Meal-Bot
        </Link>

        {/* 오른쪽 사용자 메뉴 - 우측 끝단 고정 */}
        <div className="flex items-center gap-4">
          <Link
            to="/inbody"
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            바디 분석
          </Link>
          <Link
            to="/inbody/new"
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            측정 입력
          </Link>
          {loggedIn && (
            <span className="inline-flex items-center text-sm font-bold text-on-surface-variant mr-2">환영합니다 {name}님!</span>
          )}
          {!loggedIn && (
            <span className="inline-flex items-center text-sm font-bold text-on-surface-variant mr-2">로그인하여 맞춤 식단을 받아보세요</span>
          )}
          <div className="relative flex items-center" ref={dropdownRef}>
            <span
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors select-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              account_circle
            </span>
            {/* 드롭다운 메뉴 NOT 로그인 */}
            {dropdownOpen && !loggedIn && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-outline-variant/30 bg-white/95 shadow-lg backdrop-blur-sm py-1">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  로그인
                </Link>
                <hr className="my-1 border-outline-variant/30" />
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  회원가입
                </Link>
              </div>
            )}

            {/* 드롭다운 메뉴 로그인 상태 */}
            {dropdownOpen && loggedIn && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-outline-variant/30 bg-white/95 shadow-lg backdrop-blur-sm py-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-base">manage_accounts</span>
                  사용자 프로필 편집
                </Link>
                <hr className="my-1 border-outline-variant/30" />
                <Link
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                  onClick={() => { clearAuth(); setDropdownOpen(false); }}
                  to="/main" // 로그아웃 후 로그인 페이지로 이동
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  로그아웃
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}