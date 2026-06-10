import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './features/chat/pages/ChatPage';
import LogInPage from './features/auth/pages/LogInPage';
import UserProfilePage from './features/auth/pages/UserProfilePage';
import OAuthCallbackPage from './features/auth/pages/OAuthCallbackPage';
import InBodyInputPage from './features/inbody/pages/InBodyInputPage';
import InBodyDashboardPage from './features/inbody/pages/InBodyDashboardPage';
import LandingPage from './features/landing/pages/LandingPage';
import FridgePage from './features/fridge/pages/FridgePage';
import CalendarPage from './features/calender/pages/CalendarPage';
import { isLoggedIn } from './features/auth/utils/auth';
import { SidebarProvider } from './shared/context/SidebarContext';

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <SidebarProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<ChatPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/fridge" element={<ProtectedRoute><FridgePage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/inbody" element={<ProtectedRoute><InBodyDashboardPage /></ProtectedRoute>} />
        <Route path="/inbody/new" element={<ProtectedRoute><InBodyInputPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
    </SidebarProvider>
  );
}
