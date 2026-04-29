import { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { doPasswordsMatch } from '../utils/validation';
import AuthPageShell from '../components/AuthPageShell';

export default function SignUpPage() {
  const { form, handleChange } = useForm({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordMatch = form.confirm === '' || doPasswordsMatch(form.password, form.confirm);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordMatch) return;
    // TODO: 백엔드 연결
    console.log('회원가입 시도:', form);
  };

  const handleGoogleSignUp = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <AuthPageShell
      icon="person_add"
      title="시작해볼까요"
      subtitle="나만의 맞춤 식단 여정을 시작하세요"
      mainClassName="flex-1 flex items-center justify-center px-6 py-32"
      onGoogleAuth={handleGoogleSignUp}
      bottomText="이미 계정이 있으신가요?"
      bottomLink="/login"
      bottomLinkText="로그인"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            이름
          </label>
          <div className="flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0"
            />
          </div>
        </div>

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
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            비밀번호
          </label>
          <div className="flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="8자 이상 입력"
              minLength={8}
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            비밀번호 확인
          </label>
          <div
            className={`flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border transition-colors ${
              !passwordMatch
                ? 'border-red-300 focus-within:border-red-400'
                : 'border-outline-variant/30 focus-within:border-primary'
            }`}
          >
            <span className="material-symbols-outlined text-on-surface-variant text-xl">lock_check</span>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              required
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showConfirm ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {!passwordMatch && (
            <p className="text-xs text-red-400 font-medium mt-0.5">비밀번호가 일치하지 않습니다</p>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0"
          />
          <span className="text-sm text-on-surface-variant leading-relaxed">
            <span className="font-semibold text-on-surface">이용약관</span> 및{' '}
            <span className="font-semibold text-on-surface">개인정보처리방침</span>에 동의합니다
          </span>
        </label>

        <button
          type="submit"
          disabled={!passwordMatch}
          className="mt-2 w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          회원가입
        </button>
      </form>
    </AuthPageShell>
  );
}
