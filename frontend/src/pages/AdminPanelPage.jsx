import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Gavel, LogOut, ShieldCheck } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/auctions', label: 'Auctions', icon: Gavel },
];

export default function AdminPanelPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminUserId');
    localStorage.removeItem('adminUserName');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/admin-login', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/20">
              <ShieldCheck className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-slate-100 leading-tight">Admin Panel</p>
              <p className="text-xs text-slate-500 leading-tight">AuctionHub Management</p>
            </div>
          </div>
          <button
            id="admin-logout"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors px-3 py-2 rounded-lg hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 px-6 pb-0 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
