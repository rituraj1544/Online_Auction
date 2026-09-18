import { useEffect, useState } from 'react';
import { Users, CheckCircle, Ban, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, null, { params: { status } });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      toast.success(`User ${status.toLowerCase()}`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const updateRole = async (id, role) => {
    if (!confirm(`Are you sure you want to change this user's role to ${role}?`)) return;
    try {
      await api.put(`/admin/users/${id}/role`, null, { params: { role } });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      toast.success(`User role updated to ${role}`);
    } catch {
      toast.error('Failed to update user role');
    }
  };

  const filtered = users.filter((u) =>
    !query || u.fullName?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-400" />
            User Management
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <input
            placeholder="Search users..."
            className="bg-transparent py-2.5 text-sm text-slate-100 outline-none placeholder-slate-500 flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="grid gap-3">
        {filtered.map((user) => (
          <div key={user.id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 h-11 w-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
                  {user.fullName ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-semibold text-slate-100">{user.fullName}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                      {user.role}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {user.role === 'USER' ? (
                  <button
                    onClick={() => updateRole(user.id, 'ADMIN')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/25 transition-colors"
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => updateRole(user.id, 'USER')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/25 transition-colors"
                  >
                    Revoke Admin
                  </button>
                )}
                {user.role !== 'ADMIN' && (
                  <>
                    <button
                      id={`activate-user-${user.id}`}
                      onClick={() => updateStatus(user.id, 'ACTIVE')}
                      disabled={user.status === 'ACTIVE'}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Activate
                    </button>
                    <button
                      id={`suspend-user-${user.id}`}
                      onClick={() => updateStatus(user.id, 'SUSPENDED')}
                      disabled={user.status === 'SUSPENDED'}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Ban className="h-4 w-4" />
                      Suspend
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="card p-10 text-center text-slate-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-slate-700" />
            <p>{query ? 'No users match your search' : 'No users found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
