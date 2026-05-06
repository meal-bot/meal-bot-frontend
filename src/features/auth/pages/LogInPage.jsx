import { useState } from 'react';
import { useForm } from '../../../shared/hooks/useForm';
import AuthPageShell from '../components/AuthPageShell';

export default function LogInPage() {
  const { form, handleChange } = useForm({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 백엔드 연결
    console.log('로그인 시도:', form);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <AuthPageShell
      icon="restaurant"
      title="다시 만나요"
      subtitle="맞춤 식단 추천을 계속 받아보세요"
      onGoogleAuth={handleGoogleLogin}
      bottomText="아직 계정이 없으신가요?"
      bottomLink="/signup"
      bottomLinkText="회원가입"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <button
          type="submit"
          className="mt-2 w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-sm"
        >
          로그인
        </button>
      </form>
    </AuthPageShell>
  );
}
