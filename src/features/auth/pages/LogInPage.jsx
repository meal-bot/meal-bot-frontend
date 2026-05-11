import AuthPageShell from '../components/AuthPageShell';

export default function LogInPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  return (
    <AuthPageShell
      icon="restaurant"
      title="다시 만나요"
      subtitle="맞춤 식단 추천을 계속 받아보세요"
      onGoogleAuth={handleGoogleLogin}
      onKakaoAuth={handleKakaoLogin}
    />
  );
}
