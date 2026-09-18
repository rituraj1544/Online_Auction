import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      if (res.data.user.role !== 'ADMIN') {
        window.dispatchEvent(new Event('authChanged'));
        toast.error('This login is for admin accounts only');
        return;
      }
      localStorage.setItem('adminToken', res.data.accessToken);
      localStorage.setItem('adminRole', res.data.user.role);
      localStorage.setItem('adminUserId', res.data.user.id);
      localStorage.setItem('adminUserName', res.data.user.fullName || 'Admin');
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Admin login successful!');
      navigate('/admin', { replace: true });
    } catch {
      toast.error('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/20 mb-4">
            <ShieldCheck className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50">Admin Portal</h1>
          <p className="mt-2 text-slate-400">Restricted access — administrators only</p>
        </div>

        <div className="card p-8 shadow-2xl shadow-black/50 border-red-900/30">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-2">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                className="input-base"
                placeholder="admin@auction.local"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-base pr-12"
                  placeholder="Admin password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Admin Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
