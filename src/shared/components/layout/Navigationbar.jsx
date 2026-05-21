import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { isLoggedIn, getName, clearAuth } from '../../../features/auth/utils/auth';
import ConfirmDialog from '../ConfirmDialog';

export default function Navigationbar({ sidebarOpen = false, onChatThreadStart }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const loggedIn = isLoggedIn();
  const name = getName();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/fridge', label: '냉장고를 부탁해' },
    { to: '/inbody', label: '바디 분석' },
    { to: '/inbody/new', label: '측정 입력' },
    { to: '/calendar', label: '식단 캘린더' },
  ];

  return (
    <>
    <nav
      className="fixed top-0 w-full border-b border-outline-variant/30"
      style={{ background: 'rgb(255, 255, 255)', backdropFilter: 'blur(12px)', zIndex: 'var(--z-navbar)' }}
    >
      <div className="flex justify-between items-center px-4 md:px-8 h-16 md:h-20 w-full">

        {/* 왼쪽: 로고 + 데스크톱 nav 링크 */}
        <div className="flex items-center gap-6">
          <Link
            to="/main"
            onClick={onChatThreadStart}
            className={`text-xl md:text-2xl font-bold tracking-tighter text-on-surface transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-10.5'}`}
          >
            Meal-Bot
          </Link>
          {/* 데스크톱 전용 링크 목록 */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="text-base font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* 오른쪽: 사용자 메뉴 + 모바일 햄버거 */}
        <div className="flex items-center gap-3">
          {/* 환영 문구: md 이상에서만 표시 */}
          <span className="hidden md:inline-flex items-center text-sm font-bold text-on-surface-variant mr-2">
            {loggedIn ? `환영합니다 ${name}님!` : '로그인하여 맞춤 식단을 받아보세요'}
          </span>

          {/* 계정 아이콘 드롭다운 */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <span
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors select-none"
              style={{ fontSize: '32px' }}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              account_circle
            </span>
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
              </div>
            )}
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
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                  onClick={() => { setDropdownOpen(false); setLogoutDialogOpen(true); }}
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  로그아웃
                </button>
              </div>
            )}
          </div>

          {/* 모바일 햄버거 버튼 */}
          <div className="md:hidden relative" ref={mobileMenuRef}>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '24px' }}>
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-outline-variant/30 bg-white/95 shadow-lg backdrop-blur-sm py-1 z-50">
                {loggedIn && (
                  <p className="px-4 py-2 text-xs font-bold text-on-surface-variant border-b border-outline-variant/20">
                    {name}님
                  </p>
                )}
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/40 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    <ConfirmDialog
      open={logoutDialogOpen}
      title="로그아웃"
      message="정말 로그아웃 하시겠습니까?"
      confirmLabel="로그아웃"
      onConfirm={() => { clearAuth(); setLogoutDialogOpen(false); navigate('/main'); }}
      onCancel={() => setLogoutDialogOpen(false)}
    />
    </>
  );
}
