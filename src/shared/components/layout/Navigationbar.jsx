import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { isLoggedIn, getName, clearAuth } from '../../../features/auth/utils/auth';
import { ConfirmDialog } from '../ui';

export default function Navigationbar({ sidebarOpen = false, onStartNewChat }) {
  const navigate = useNavigate();
  const location = useLocation();
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
    { to: '/main', label: '채팅', icon: 'forum' },
    { to: '/fridge', label: '냉장고', icon: 'kitchen' },
    { to: '/calendar', label: '캘린더', icon: 'calendar_month' },
    { to: '/inbody', label: '바디 분석', icon: 'monitoring' },
  ];

  const isActiveLink = (to) => {
    if (to === '/main') return location.pathname === '/main';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <>
    <nav
      className="fixed top-0 w-full border-b border-outline-variant/30"
      style={{ background: 'rgb(255, 255, 255)', backdropFilter: 'blur(12px)', zIndex: 'var(--z-navbar)' }}
    >
      <div className="flex justify-between items-center px-4 md:px-8 h-16 md:h-20 w-full">

        {/* 왼쪽: 로고 + 데스크톱 nav 링크 */}
        <div className="flex items-center gap-4">
          <Link
            to="/main"
            onClick={onStartNewChat}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 hover:bg-surface-container md:h-11 md:w-11 ${sidebarOpen ? 'md:ml-60' : 'md:ml-10.5'}`}
            aria-label="OBOB 홈"
          >
            <img
              src="/favicon-512.png"
              alt=""
              className="h-8 w-8 object-contain md:h-9 md:w-9"
              aria-hidden="true"
            />
          </Link>
          {/* 데스크톱 전용 링크 목록 */}
          <div className="hidden md:flex h-16 md:h-20 items-end gap-1">
          {navLinks.map(({ to, label, icon }) => {
            const active = isActiveLink(to);
            return (
              <Link
                key={to}
                to={to}
                className={`inline-flex h-11 items-center gap-1.5 px-4 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'nav-tab-active -mb-px rounded-t-2xl border border-b-white border-outline-variant/50 bg-white text-on-surface shadow-sm'
                    : 'mb-3 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
                {label}
              </Link>
            );
          })}
          </div>
        </div>

        {/* 오른쪽: 사용자 메뉴 + 모바일 햄버거 */}
        <div className="flex items-center justify-end gap-3">
          <span className="inline-flex items-center text-xl font-bold tracking-tighter text-on-surface md:text-2xl">
            OBOB
          </span>

          {/* 환영 문구: md 이상에서만 표시 */}
          <span className="hidden md:inline-flex items-center text-sm font-bold text-on-surface-variant mr-2">
            {loggedIn ? `환영합니다 ${name}님!` : '로그인하여 맞춤 식단을 받아보세요'}
          </span>

          {/* 계정 아이콘 드롭다운 */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              type="button"
              aria-label="계정 메뉴 열기"
              aria-expanded={dropdownOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="material-symbols-outlined select-none" style={{ fontSize: '32px' }} aria-hidden="true">
                account_circle
              </span>
            </button>
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
              type="button"
              aria-label={mobileMenuOpen ? '모바일 메뉴 닫기' : '모바일 메뉴 열기'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '24px' }} aria-hidden="true">
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
                {navLinks.map(({ to, label, icon }) => {
                  const active = isActiveLink(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        active
                          ? 'bg-surface-container text-on-surface font-semibold'
                          : 'text-on-surface hover:bg-surface-variant/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base text-on-surface-variant">{icon}</span>
                      {label}
                    </Link>
                  );
                })}
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
