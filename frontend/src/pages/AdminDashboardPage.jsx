import { useEffect, useState } from 'react';
import { Users, Gavel, TrendingUp, CheckCircle2, BarChart3 } from 'lucide-react';
import api from '../services/api';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="card p-6">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} mb-4`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-slate-50">{value ?? '—'}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Platform statistics and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers}
          color="text-sky-400"
          bg="bg-sky-500/10"
        />
        <StatCard
          icon={Gavel}
          label="Total Auctions"
          value={stats?.totalAuctions}
          color="text-amber-400"
          bg="bg-amber-500/10"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Auctions"
          value={stats?.activeAuctions}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Auctions"
          value={stats?.completedAuctions}
          color="text-rose-400"
          bg="bg-rose-500/10"
        />
      </div>

      {/* Info Card */}
      <div className="card p-6 border-amber-900/30">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/20">
            <BarChart3 className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100 mb-1">Admin Access</h2>
            <p className="text-sm text-slate-400">
              You have full administrative access to manage users, auctions, and platform settings.
              Use the navigation above to manage platform data.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                ✓ User Management
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                ✓ Auction Control
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                ✓ Analytics
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
