import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import MealDetailPage from './pages/MealDetailPage';
import InBodyInputPage from './pages/InBodyInputPage';
import InBodyDashboardPage from './pages/InBodyDashboardPage';
import LandingPage from './pages/LandingPage';
import { isLoggedIn } from './utils/auth';
import { SidebarProvider } from './context/SidebarContext';

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <SidebarProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
