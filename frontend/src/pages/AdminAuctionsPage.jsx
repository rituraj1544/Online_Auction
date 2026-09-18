import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Search, Trash2, ExternalLink, Edit2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/auctions')
      .then((res) => setAuctions(res.data))
      .catch(() => toast.error('Failed to load auctions'))
      .finally(() => setLoading(false));
  }, []);

  const deleteAuction = async (id) => {
    if (!confirm('Are you sure you want to delete this auction? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/auction/${id}`);
      setAuctions((prev) => prev.filter((a) => a.id !== id));
      toast.success('Auction deleted');
    } catch {
      toast.error('Failed to delete auction');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = auctions.filter((a) =>
    !query ||
    a.title?.toLowerCase().includes(query.toLowerCase()) ||
    a.sellerName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Gavel className="h-6 w-6 text-amber-400" />
            Auction Management
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{auctions.length} total auctions</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 w-full sm:w-64">
            <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <input
              placeholder="Search auctions..."
              className="bg-transparent py-2.5 text-sm text-slate-100 outline-none placeholder-slate-500 flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Link
            to="/admin/auctions/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            Create Auction
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="grid gap-3">
        {filtered.map((auction) => (
          <div key={auction.id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-100 truncate">{auction.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                    auction.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : auction.status === 'ENDED'
                      ? 'bg-slate-700 text-slate-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {auction.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{auction.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Seller: <span className="text-slate-300">{auction.sellerName}</span></span>
                  <span>Category: <span className="text-slate-300">{auction.categoryName || '—'}</span></span>
                  <span className="text-emerald-400 font-semibold text-sm">
                    {formatCurrency(auction.currentPrice ?? auction.startingPrice)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/auctions/${auction.id}`}
                  id={`view-auction-${auction.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-slate-100 hover:border-slate-600 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </Link>
                <Link
                  to={`/admin/auctions/${auction.id}/edit`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/25 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  id={`delete-auction-${auction.id}`}
                  onClick={() => deleteAuction(auction.id)}
                  disabled={deleting === auction.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-400 text-sm hover:bg-rose-500/25 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting === auction.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="card p-10 text-center text-slate-500">
            <Gavel className="h-8 w-8 mx-auto mb-2 text-slate-700" />
            <p>{query ? 'No auctions match your search' : 'No auctions found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
