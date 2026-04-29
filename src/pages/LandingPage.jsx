import { Link } from 'react-router-dom';
import { loginWithGoogle } from '../utils/auth';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">AI 맞춤 식단 추천</p>
      <h1 className="text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
        나에게 맞는 식단,<br />Meal-Bot이 찾아드립니다
      </h1>
      <p className="text-on-surface-variant text-base max-w-md mb-10">
        체성분 데이터를 기반으로 오늘 먹어야 할 음식을 AI가 직접 추천해드립니다
      </p>
      <button
        onClick={loginWithGoogle}
        className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-sm text-base"
      >
        Google로 시작하기
      </button>

      <Link to="/main" className="mt-4 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
        게스트 메인 페이지 ** 로그인 없는 화면 테스트 **
      </Link>
    </div>
  );
}
