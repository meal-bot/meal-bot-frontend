import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './features/chat/pages/MainPage';
import LogInPage from './features/auth/pages/LogInPage';
import UserProfilePage from './features/auth/pages/UserProfilePage';
import OAuthCallbackPage from './features/auth/pages/OAuthCallbackPage';
import MealDetailPage from './features/meal/pages/MealDetailPage';
import InBodyInputPage from './features/inbody/pages/InBodyInputPage';
import InBodyDashboardPage from './features/inbody/pages/InBodyDashboardPage';
import LandingPage from './features/landing/pages/LandingPage';
import FridgePage from './features/fridge/FridgePage';
import { isLoggedIn, loginWithGoogle } from './features/auth/utils/auth';
import { SidebarProvider } from './shared/context/SidebarContext';

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <SidebarProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onGoogleLogin={loginWithGoogle} />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/meal/:id" element={<MealDetailPage />} />
        {/* 임시: 게스트 접근 허용 (원복 시 ProtectedRoute로 감싸기) */}
        <Route path="/fridge" element={<FridgePage />} />
        <Route path="/inbody" element={<InBodyDashboardPage />} />
        <Route path="/inbody/new" element={<InBodyInputPage />} />
      </Routes>
    </BrowserRouter>
    </SidebarProvider>
  );
}
