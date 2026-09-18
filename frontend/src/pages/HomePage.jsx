import { Link } from 'react-router-dom';
import { ArrowRight, Gavel, Shield, Zap, Trophy } from 'lucide-react';
import AuctionMarketplace from '../components/AuctionMarketplace';
import DashboardPage from './DashboardPage';

const token = () => localStorage.getItem('token');

function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Real-time bidding is live
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-50 leading-tight tracking-tight">
            Bid, Win &{' '}
            <span className="gradient-brand">Collect</span>{' '}
            Anything
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The premier online auction platform where you can list items, place real-time bids,
            and win amazing deals — all in one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              id="hero-register"
              to="/register"
              className="btn-primary text-base px-8 py-4 rounded-xl shadow-lg shadow-amber-500/25"
            >
              Start Bidding Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              id="hero-browse"
              to="/login"
              className="btn-secondary text-base px-8 py-4 rounded-xl"
            >
              Browse Auctions
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { label: 'Live Auctions', value: '500+' },
              { label: 'Happy Bidders', value: '10K+' },
              { label: 'Items Sold', value: '50K+' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-slate-50">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { icon: Zap, title: 'Real-time Bidding', desc: 'Instant bid updates via WebSocket — see prices change as they happen.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            { icon: Shield, title: 'Secure & Trusted', desc: 'JWT auth, encrypted data, and a protected payment environment.', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
            { icon: Trophy, title: 'Win Notifications', desc: 'Get notified instantly when you win an auction or someone outbids you.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className={`card p-6 border ${bg}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} mb-4`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  if (isLoggedIn && !isAdmin) {
    return <DashboardPage />;
  }

  return (
    <div>
      <HeroSection />
      <div className="border-t border-slate-800/50 py-16 px-6 max-w-7xl mx-auto">
        <AuctionMarketplace title="Live Auctions" subtitle="Preview what's available — sign in to start bidding." showHeader={true} />
      </div>
    </div>
  );
}
