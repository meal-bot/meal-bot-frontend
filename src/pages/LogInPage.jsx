import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm';

export default function LogInPage() {
  const { form, handleChange } = useForm({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 백엔드 연결
    console.log('로그인 시도:', form);
  };

  /////////////////////// 구글 로그인 ///////////////////////
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };
  //////////////////////////////////////////////


  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 네비 */}
      <nav
        className="fixed top-0 w-full z-50 border-b border-outline-variant/30"
        style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto w-full">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-on-surface ml-12">
            Meal-Bot
          </Link>
          {/* <div className="flex items-center gap-4">
            <Link
              to="/signup"
              className="text-sm font-bold bg-[#C1D8C3] text-on-surface px-5 py-2.5 rounded-full hover:opacity-90 transition-all shadow-sm"
            >
              회원가입
            </Link>
          </div> */}
        </div>
      </nav>

      {/* 중앙 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md">
          {/* 헤더 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-container mb-5">
              <span className="material-symbols-outlined text-3xl" style={{ color: '#8DA399' }}>
                restaurant
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">다시 만나요</h1>
            <p className="text-on-surface-variant mt-2 text-sm">맞춤 식단 추천을 계속 받아보세요</p>
          </div>

          {/* 폼 카드 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* 이메일 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  이메일
                </label>
                <div className="flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">mail</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="hello@mealbot.kr"
                    required
                    className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0"
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    비밀번호
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
                  >
                    비밀번호 찾기
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                className="mt-2 w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-sm"
              >
                로그인
              </button>
            </form>

            {/* 구분선 */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs text-on-surface-variant font-medium">또는</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            {/* 구글 로그인 */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded-2xl py-3.5 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
              onClick={handleGoogleLogin}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
              </svg>
              Google로 계속하기
            </button>
          </div>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-on-surface-variant mt-6">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="font-bold text-primary hover:opacity-70 transition-opacity">
              회원가입
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
