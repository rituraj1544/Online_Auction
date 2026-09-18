import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Gavel, LogOut, User, LayoutDashboard, Store, PlusCircle, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import NotificationPanel from '../components/NotificationPanel';

export default function UserLayout({ auth, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const token = auth.token;
  const isAdmin = auth.role === 'ADMIN';
  const isNormalUser = token && !isAdmin;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand */}
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/20">
                <Gavel className="h-5 w-5 text-amber-400" />
              </div>
              <span className="text-lg font-bold gradient-brand hidden sm:block">AuctionHub</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              {isNormalUser && (
                <>
                  <NavLink to="/marketplace" className={navLinkClass}>
                    <Store className="h-4 w-4" /> Marketplace
                  </NavLink>
                  <NavLink to="/wishlist" className={navLinkClass}>
                    <Heart className="h-4 w-4" /> Wishlist
                  </NavLink>
                  <NavLink to="/create-auction" className={navLinkClass}>
                    <PlusCircle className="h-4 w-4" /> Create
                  </NavLink>
                </>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {isNormalUser && <NotificationPanel />}

              {!isNormalUser && (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Login</Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-sm">Register</Link>
                </div>
              )}

              {isNormalUser && (
                <div className="hidden md:flex items-center gap-2">
                  <NavLink to="/profile" className={navLinkClass}>
                    <User className="h-4 w-4" />
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors px-3 py-2 rounded-lg hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-800 transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Home</Link>
            {isNormalUser && (
              <>
                <Link to="/marketplace" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Marketplace</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Wishlist</Link>
                <Link to="/create-auction" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Create</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Profile</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10">Logout</button>
              </>
            )}
            {!isNormalUser && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-amber-500/10">Register</Link>
              </>
            )}
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
