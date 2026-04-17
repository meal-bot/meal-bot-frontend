import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Navigationbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem('token'); // 토큰이 있으면 로그인된 상태로 간주
  const name = localStorage.getItem('name'); // 사용자 이름 (프로필 편집에서 저장된 값)

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
      className="fixed top-0 w-full z-50 border-b border-outline-variant/30"
      style={{ background: 'rgb(255, 255, 255)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto w-full">
        {/* 로고 및 사이트 이름 */}
        <Link to="/" className="text-2xl font-bold tracking-tighter text-on-surface">
          Meal-Bot
        </Link>

        {/* 오른쪽 사용자 메뉴 */}
        <div className="flex items-center ml-auto">
          {isLoggedIn && (
            <span className="text-sm text-on-surface-variant mr-2">환영합니다 {name}님!</span>
          )}
          {!isLoggedIn && (
            <span className="text-sm text-on-surface-variant mr-2">로그인하여 맞춤 식단을 받아보세요</span>
          )}
          <div className="relative" ref={dropdownRef}>
            <span
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors select-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              account_circle
            </span>
            {/* 드롭다운 메뉴 NOT 로그인 */}
            {dropdownOpen && !isLoggedIn && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-outline-variant/30 bg-white/95 shadow-lg backdrop-blur-sm py-1">
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
            {dropdownOpen && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-outline-variant/30 bg-white/95 shadow-lg backdrop-blur-sm py-1">
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
                  onClick={() => localStorage.removeItem('token') && setDropdownOpen(false)} // 로그아웃 시 토큰 제거
                  to="/login" // 로그아웃 후 로그인 페이지로 이동
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