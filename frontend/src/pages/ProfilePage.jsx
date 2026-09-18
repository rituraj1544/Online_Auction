import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserRound, Mail, Phone, MapPin, PlusCircle, Gavel, Save } from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [myAuctions, setMyAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', address: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/users/profile'),
      api.get('/auctions'),
      api.get('/bids/my'),
    ]).then(([profileRes, auctionsRes, bidsRes]) => {
      setProfile(profileRes.data);
      const userId = Number(localStorage.getItem('userId') || 0);
      setMyAuctions(auctionsRes.data.filter((a) => a.sellerId === userId));
      setMyBids(bidsRes.data);
      setEditForm({ phone: profileRes.data.phone || '', address: profileRes.data.address || '' });
    }).catch(() => toast.error('Failed to load profile'));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', editForm);
      setProfile(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const initials = profile.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const uniqueBidAuctions = new Set(myBids.map((b) => b.auctionId)).size;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Profile Header */}
      <div className="card p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl font-bold text-slate-950 shadow-lg shadow-amber-500/30">
              {initials}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-50">{profile.fullName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </span>
              )}
              {profile.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {profile.address}
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                {profile.status || 'ACTIVE'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-400">
                {profile.role || 'USER'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary text-sm py-2 px-4"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {editing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-800 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                id="profile-phone"
                type="tel"
                className="input-base"
                placeholder="+1 555 0000"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
              <input
                id="profile-address"
                type="text"
                className="input-base"
                placeholder="City, Country"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-2.5 px-6 text-sm disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: PlusCircle, label: 'Auctions Created', value: myAuctions.length, color: 'text-sky-400' },
          { icon: Gavel, label: 'Auctions Bid On', value: uniqueBidAuctions, color: 'text-amber-400' },
          { icon: UserRound, label: 'Total Bids Placed', value: myBids.length, color: 'text-emerald-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-bold text-slate-50">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* My Auctions List */}
      {myAuctions.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Auctions</h2>
            <Link to="/create-auction" className="text-sm text-amber-400 hover:text-amber-300 font-semibold">
              + Create
            </Link>
          </div>
          <div className="space-y-3">
            {myAuctions.slice(0, 5).map((auction) => (
              <Link
                key={auction.id}
                to={`/auctions/${auction.id}`}
                className="flex items-center justify-between gap-4 rounded-lg bg-slate-800/50 p-4 hover:bg-slate-800 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-100">{auction.title}</p>
                  <p className="text-xs text-slate-500">{auction.status}</p>
                </div>
                <p className="font-semibold text-emerald-400 flex-shrink-0">
                  {formatCurrency(auction.currentPrice ?? auction.startingPrice)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
