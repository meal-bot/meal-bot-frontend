import AuthPageShell from '../components/AuthPageShell';

export default function LogInPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <AuthPageShell
      icon="restaurant"
      title="다시 만나요"
      subtitle="맞춤 식단 추천을 계속 받아보세요"
      onGoogleAuth={handleGoogleLogin}
    />
  );
}
