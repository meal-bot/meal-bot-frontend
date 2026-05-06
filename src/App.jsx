import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './features/chat/pages/MainPage';
import LogInPage from './features/auth/pages/LogInPage';
import SignUpPage from './features/auth/pages/SignUpPage';
import UserProfilePage from './features/auth/pages/UserProfilePage';
import OAuthCallbackPage from './features/auth/pages/OAuthCallbackPage';
import MealDetailPage from './features/meal/pages/MealDetailPage';
import InBodyInputPage from './features/inbody/pages/InBodyInputPage';
import InBodyDashboardPage from './features/inbody/pages/InBodyDashboardPage';
import LandingPage from './features/landing/pages/LandingPage';
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
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/meal/:id" element={<MealDetailPage />} />
        <Route path="/inbody" element={<ProtectedRoute><InBodyDashboardPage /></ProtectedRoute>} />
        <Route path="/inbody/new" element={<ProtectedRoute><InBodyInputPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
    </SidebarProvider>
  );
}
