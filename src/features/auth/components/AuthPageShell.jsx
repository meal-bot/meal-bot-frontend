import { Link } from 'react-router-dom';

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

export default function AuthPageShell({
  icon,
  title,
  subtitle,
  mainClassName = 'flex-1 flex items-center justify-center px-6 pt-20',
  onGoogleAuth,
  bottomText,
  bottomLink,
  bottomLinkText,
  children,
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav
        className="fixed top-0 w-full z-50 border-b border-outline-variant/30"
        style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto w-full">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-on-surface ml-12">
            Meal-Bot
          </Link>
        </div>
      </nav>

      <main className={mainClassName}>
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-container mb-5">
              <span className="material-symbols-outlined text-3xl" style={{ color: '#8DA399' }}>
                {icon}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">{title}</h1>
            <p className="text-on-surface-variant mt-2 text-sm">{subtitle}</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
            {children}

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs text-on-surface-variant font-medium">또는</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <button
              type="button"
              onClick={onGoogleAuth}
              className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded-2xl py-3.5 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              {GOOGLE_SVG}
              Google로 계속하기
            </button>
          </div>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            {bottomText}{' '}
            <Link to={bottomLink} className="font-bold text-primary hover:opacity-70 transition-opacity">
              {bottomLinkText}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
