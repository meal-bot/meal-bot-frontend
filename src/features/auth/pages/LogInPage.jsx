import AuthPageShell from '../components/AuthPageShell';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../utils/auth';

export default function LogInPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleGuestStart = () => {
    clearAuth();
    navigate('/main');
  };

  return (
    <AuthPageShell
      icon="restaurant"
      title="어떤 방식으로 시작할까요?"
      subtitle="처음 방문하셔도 소셜 계정 인증 후 바로 시작할 수 있습니다."
      onGoogleAuth={handleGoogleLogin}
      onKakaoAuth={handleKakaoLogin}
      onGuestStart={handleGuestStart}
    />
  );
}
