import { Link } from 'react-router-dom';
import { Button, Card } from '../../../shared/components/ui';

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

export default function AuthPageShell({
  title,
  subtitle,
  mainClassName = 'flex-1 flex items-center justify-center px-6 pt-24 pb-12',
  onGoogleAuth,
  onKakaoAuth,
  onGuestStart,
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
        <div className="flex justify-between items-center px-4 md:px-8 h-16 md:h-20 w-full">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold tracking-tighter text-on-surface transition-all duration-300 md:ml-10.5"
          >
            OBOB
          </Link>
          <Button as={Link} to="/main" variant="outline" size="sm" className="font-semibold">
            로그인 없이 시작하기
          </Button>
        </div>
      </nav>

      <main className={mainClassName}>
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_420px]">
          <section className="hidden lg:flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/40 bg-white/80 px-4 py-2 text-xs font-bold text-on-surface-variant shadow-sm">
                <span className="material-symbols-outlined text-base text-primary">auto_awesome</span>
                AI Meal Assistant
              </div>
              <div>
                <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-on-surface">
                  대화로 고르고,<br />
                  기록으로 이어보세요.
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-on-surface-variant">
                  별도 가입 양식 없이 소셜 계정으로 시작하고, 게스트로도 바로 식단 추천을 체험할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm">
                <span className="material-symbols-outlined text-primary">chat</span>
                <p className="mt-3 text-sm font-bold text-on-surface">AI 채팅 추천</p>
                <p className="mt-1 text-xs leading-5 text-on-surface-variant">먹고 싶은 상황을 말하면 메뉴를 추천합니다.</p>
              </div>
              <div className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm">
                <span className="material-symbols-outlined text-secondary">event_note</span>
                <p className="mt-3 text-sm font-bold text-on-surface">추천 기록 관리</p>
                <p className="mt-1 text-xs leading-5 text-on-surface-variant">이전 대화와 날짜별 기록을 다시 볼 수 있습니다.</p>
              </div>
            </div>
          </section>

          <div className="w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container mb-5">
                <img
                  src="/favicon-512.png"
                  alt=""
                  className="h-12 w-12 object-contain"
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">{title}</h1>
              <p className="text-on-surface-variant mt-2 text-sm leading-6">{subtitle}</p>
            </div>

            <Card className="flex flex-col gap-3">
              {children}

              {children && (
                <div className="flex items-center gap-4 my-3">
                  <div className="flex-1 h-px bg-outline-variant" />
                  <span className="text-xs text-on-surface-variant font-medium">또는</span>
                  <div className="flex-1 h-px bg-outline-variant" />
                </div>
              )}

              <Button
                onClick={onGoogleAuth}
                variant="outline"
                size="lg"
                className="w-full font-semibold"
              >
                {GOOGLE_SVG}
                Google 계정으로 계속하기
              </Button>

              <Button
                onClick={onKakaoAuth}
                variant="outline"
                size="lg"
                className="w-full font-semibold"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919" aria-hidden="true">
                  <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.599 1.576 4.878 3.938 6.3-.173.616-.627 2.233-.717 2.58-.112.43.158.425.332.31.137-.092 2.167-1.47 3.046-2.065.457.063.926.095 1.401.095 5.523 0 10-3.477 10-7.72C22 6.477 17.523 3 12 3z"/>
                </svg>
                Kakao 계정으로 계속하기
              </Button>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-outline-variant" />
                <span className="text-xs text-on-surface-variant font-medium">또는</span>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>

              <Button
                onClick={onGuestStart}
                variant="ghost"
                size="lg"
                className="w-full font-semibold"
              >
                로그인 없이 시작하기
              </Button>
            </Card>

            {bottomText && bottomLink && bottomLinkText && (
              <p className="text-center text-sm text-on-surface-variant mt-6">
                {bottomText}{' '}
                <Link to={bottomLink} className="font-bold text-primary hover:opacity-70 transition-opacity">
                  {bottomLinkText}
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
