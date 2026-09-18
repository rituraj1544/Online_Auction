import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import UserLayout from './layouts/UserLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import WishlistPage from './pages/WishlistPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import CreateAuctionPage from './pages/CreateAuctionPage';
import ProfilePage from './pages/ProfilePage';

import AdminPanelPage from './pages/AdminPanelPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAuctionsPage from './pages/AdminAuctionsPage';
import AdminAuctionFormPage from './pages/AdminAuctionFormPage';
import AdminLoginPage from './pages/AdminLoginPage';

function App() {
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    adminToken: localStorage.getItem('adminToken'),
    adminRole: localStorage.getItem('adminRole'),
  }));

  const token = auth.token;
  const isAdmin = auth.adminRole === 'ADMIN';
  const isNormalUser = Boolean(token && auth.role !== 'ADMIN');
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      setAuth({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        adminToken: localStorage.getItem('adminToken'),
        adminRole: localStorage.getItem('adminRole'),
      });
    };
    window.addEventListener('authChanged', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('authChanged', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#f59e0b', secondary: '#0f172a' } },
        }}
      />

      <Routes>
        <Route element={<UserLayout auth={auth} handleLogout={handleLogout} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isNormalUser ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={isNormalUser ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="/marketplace" element={isNormalUser ? <MarketplacePage /> : <Navigate to="/login" replace />} />
          <Route path="/wishlist" element={isNormalUser ? <WishlistPage /> : <Navigate to="/login" replace />} />
          <Route path="/auctions/:id" element={<AuctionDetailPage />} />
          <Route path="/create-auction" element={isNormalUser ? <CreateAuctionPage /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isNormalUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Completely Separate Admin Routes (No UserLayout) */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={isAdmin ? <AdminPanelPage /> : <Navigate to={token ? '/' : '/admin-login'} replace />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="auctions" element={<AdminAuctionsPage />} />
          <Route path="auctions/new" element={<AdminAuctionFormPage />} />
          <Route path="auctions/:id/edit" element={<AdminAuctionFormPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
