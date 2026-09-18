import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ChevronDown, Clock, DollarSign, Users, Gavel } from 'lucide-react';
import api from '../services/api';
import { createBidSocket, disconnectBidSocket } from '../services/socket';
import AuctionCard from './AuctionCard';

export default function AuctionMarketplace({
  title = 'Explore live auctions',
  subtitle = '',
  showHeader = true,
}) {
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());

  // Filter state (applied only on button click)
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ACTIVE');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Applied filters
  const [applied, setApplied] = useState({ search: '', category: 'ALL', status: 'ACTIVE', minPrice: '', maxPrice: '' });

  useEffect(() => {
    let mounted = true;
    Promise.all([api.get('/auctions'), api.get('/categories')])
      .then(([aRes, cRes]) => {
        if (!mounted) return;
        setAuctions(aRes.data);
        setCategories(cRes.data);
        setError('');
      })
      .catch(() => { if (mounted) setError('Unable to load auctions'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const onBid = (payload) => {
      if (!payload?.auctionId) return;
      setAuctions((prev) =>
        prev.map((a) => a.id === payload.auctionId ? { ...a, currentPrice: payload.amount, bidCount: (a.bidCount || 0) + 1 } : a)
      );
    };
    createBidSocket(onBid);
    return () => disconnectBidSocket(onBid);
  }, []);

  useEffect(() => {
    const onAuctionUpdate = (payload) => {
      if (!payload?.id) return;
      setAuctions((prev) =>
        prev.map((a) => a.id === payload.id ? { ...a, ...payload } : a)
      );
    };
    import('../services/socket').then(({ createAuctionSocket, disconnectAuctionSocket }) => {
       createAuctionSocket(onAuctionUpdate);
    });
    return () => {
      import('../services/socket').then(({ disconnectAuctionSocket }) => {
        disconnectAuctionSocket(onAuctionUpdate);
      });
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  function applyFilters() {
    setApplied({ search, category, status, minPrice, maxPrice });
  }

  const filtered = useMemo(() => {
    const q = applied.search.trim().toLowerCase();
    return auctions
      .filter((a) => applied.status === 'ALL' || a.status === applied.status)
      .filter((a) => applied.category === 'ALL' || a.categoryName === applied.category)
      .filter((a) => {
        if (!q) return true;
        return [a.title, a.description, a.categoryName, a.sellerName, a.location]
          .some((v) => searchable(v).includes(q));
      })
      .filter((a) => {
        const price = Number(a.currentPrice ?? a.startingPrice ?? 0);
        if (applied.minPrice && price < Number(applied.minPrice)) return false;
        if (applied.maxPrice && price > Number(applied.maxPrice)) return false;
        return true;
      })
      .sort((a, b) => {
        const aEnd = a.endTime ? new Date(a.endTime).getTime() : Number.MAX_SAFE_INTEGER;
        const bEnd = b.endTime ? new Date(b.endTime).getTime() : Number.MAX_SAFE_INTEGER;
        return aEnd - bEnd;
      });
  }, [auctions, applied]);

  return (
    <div className="min-h-screen bg-[#060d1f] text-slate-100">
      {showHeader && (
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Marketplace</p>
          <h1 className="text-3xl font-black text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="flex gap-6">
        {/* ── Sidebar ── */}
        <aside className="w-56 flex-shrink-0 space-y-5">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Search</label>
            <div className="flex items-center gap-2 bg-[#0d1526] border border-[#1e2d4a] rounded-lg px-3 py-2.5">
              <Search className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="bg-transparent text-sm text-slate-100 outline-none placeholder-slate-600 flex-1 min-w-0"
                placeholder="Items, listings, art"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-[#0d1526] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none cursor-pointer pr-8"
              >
                <option value="ALL">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none bg-[#0d1526] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none cursor-pointer pr-8"
              >
                <option value="ACTIVE">Active</option>
                <option value="ALL">All</option>
                <option value="ENDED">Ended</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-[#0d1526] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none placeholder-slate-600"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#0d1526] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none placeholder-slate-600"
              />
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyFilters}
            id="marketplace-apply-filters"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30"
          >
            Apply Filters
          </button>
        </aside>

        {/* ── Main Grid ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-400">
                <span className="text-slate-100 font-semibold">{filtered.length}</span> auctions found
              </span>
            </div>
            {/* Traffic light dots */}
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-rose-800 bg-rose-950/50 p-6 text-rose-300 text-sm">{error}</div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
              <Gavel className="h-12 w-12 mb-3" />
              <p className="text-lg font-semibold text-slate-400">No auctions found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} now={now} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
