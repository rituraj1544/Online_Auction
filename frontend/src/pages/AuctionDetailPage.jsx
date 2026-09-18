import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Gavel, DollarSign, Clock, Users, Heart, User } from 'lucide-react';
import api from '../services/api';
import { createBidSocket, disconnectBidSocket } from '../services/socket';
import { formatCurrency, formatTimeLeft } from '../utils/format';

function sortBidsHighestFirst(items) {
  return [...items].sort((a, b) => Number(b.amount ?? 0) - Number(a.amount ?? 0));
}

function StatBox({ label, value, highlight }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-blue-600/10 border-blue-500/30' : 'bg-[#0d1526] border-[#1e2d4a]'}`}>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-blue-400' : 'text-slate-100'}`}>{value}</p>
    </div>
  );
}

export default function AuctionDetailPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState(null);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const currentUserId = Number(localStorage.getItem('userId') || 0);

  function upsertBid(incoming) {
    setBids((prev) => {
      const exists = prev.some((b) => b.id === incoming.id);
      const next = exists
        ? prev.map((b) => (b.id === incoming.id ? incoming : b))
        : [incoming, ...prev];
      return sortBidsHighestFirst(next);
    });
  }

  useEffect(() => {
    let mounted = true;
    Promise.all([api.get(`/auctions/${id}`), api.get(`/bids/${id}`)])
      .then(([aRes, bRes]) => {
        if (!mounted) return;
        setAuction(aRes.data);
        setSelectedImage(aRes.data.image || null);
        setBids(sortBidsHighestFirst(bRes.data));
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Unable to load auction');
      })
      .finally(() => { if (mounted) setLoading(false); });

    const onBid = (payload) => {
      if (payload.auctionId === Number(id)) {
        setAuction((prev) => prev ? { ...prev, currentPrice: payload.amount } : prev);
        upsertBid(payload);
      }
    };
    createBidSocket(onBid);

    return () => {
      mounted = false;
      disconnectBidSocket(onBid);
    };
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentPrice = Number(auction?.currentPrice ?? auction?.startingPrice ?? 0);
  const startingPrice = Number(auction?.startingPrice ?? 0);
  const minimumIncrement = Number(auction?.minimumIncrement ?? 1);
  const nextBid = currentPrice + minimumIncrement;
  const hasEnded = auction?.endTime ? new Date(auction.endTime).getTime() <= now.getTime() : false;
  const isSeller = Boolean(currentUserId && auction?.sellerId === currentUserId);
  const canBid = Boolean(token && role !== 'ADMIN' && auction?.status === 'ACTIVE' && !hasEnded && !isSeller);

  const bidBlockMessage = useMemo(() => {
    if (!token) return 'Log in to place a bid.';
    if (role === 'ADMIN') return 'Admin accounts cannot bid.';
    if (isSeller) return 'You cannot bid on your own auction.';
    if (hasEnded) return 'This auction has ended.';
    if (auction?.status !== 'ACTIVE') return 'Auction is not active.';
    return '';
  }, [auction?.status, hasEnded, isSeller, role, token]);

  const uniqueBidderCount = useMemo(() =>
    new Set(bids.map((b) => b.bidderId).filter(Boolean)).size, [bids]);

  const handleBid = async (e) => {
    e.preventDefault();
    setError('');
    const amount = Number(bidAmount);
    if (!canBid) { setError(bidBlockMessage); return; }
    if (!Number.isFinite(amount) || amount < nextBid) {
      setError(`Minimum bid is ${formatCurrency(nextBid)}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/bids', { auctionId: Number(id), amount });
      setBidAmount('');
      setAuction((prev) => ({ ...prev, currentPrice: res.data.amount }));
      upsertBid(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Bid failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d1f] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-[#060d1f] flex items-center justify-center text-rose-400 text-lg">
        {error || 'Auction not found'}
      </div>
    );
  }

  const topBid = bids[0];

  return (
    <div className="min-h-screen bg-[#060d1f] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-[420px_1fr] gap-8">
          {/* ── LEFT: Image + Seller ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden bg-[#0d1526] border border-[#1e2d4a] aspect-[4/3] flex items-center justify-center p-6">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={auction.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Gavel className="h-24 w-24 text-[#1e2d4a]" />
              )}
            </div>

            {/* Thumbnail strip (shows image again as thumb, extensible) */}
            {auction.image && (
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedImage(auction.image)}
                  className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === auction.image ? 'border-blue-500' : 'border-[#1e2d4a] hover:border-[#2a3d5c]'
                  } bg-[#0d1526] flex items-center justify-center p-2`}
                >
                  <img src={auction.image} alt="" className="max-h-full max-w-full object-contain" />
                </button>
              </div>
            )}

            {/* Seller info */}
            <div className="rounded-2xl bg-[#0d1526] border border-[#1e2d4a] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Seller information</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                  {auction.sellerName ? auction.sellerName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <p className="font-semibold text-slate-100">{auction.sellerName || 'Unknown Seller'}</p>
                  <p className="text-xs text-slate-500">Seller</p>
                </div>
              </div>
              {auction.location && (
                <p className="text-xs text-slate-500 mt-3">📍 {auction.location}</p>
              )}
            </div>
          </div>

          {/* ── RIGHT: Details + Bidding ── */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0d1526] border border-[#1e2d4a] text-slate-300">
                {auction.categoryName || 'Uncategorized'}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                auction.status === 'ACTIVE' && !hasEnded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {auction.status === 'ACTIVE' && !hasEnded ? 'Active' : auction.status}
              </span>
              {auction.condition && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0d1526] border border-[#1e2d4a] text-slate-400">
                  {auction.condition}
                </span>
              )}
            </div>

            {/* Title + Description */}
            <div>
              <h1 className="text-3xl font-black text-white leading-tight">{auction.title}</h1>
              {auction.description && (
                <p className="mt-3 text-slate-400 text-sm leading-relaxed">{auction.description}</p>
              )}
            </div>

            {/* Stat Boxes */}
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Starting bid" value={formatCurrency(startingPrice)} />
              <StatBox label="Current bid" value={formatCurrency(currentPrice)} highlight />
              <StatBox label="Time left" value={formatTimeLeft(auction.endTime, now)} />
            </div>

            {/* Bidders count */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Users className="h-4 w-4 text-blue-400" />
              <span><span className="text-slate-100 font-semibold">{uniqueBidderCount}</span> bidder{uniqueBidderCount !== 1 ? 's' : ''}</span>
              {topBid && (
                <>
                  <span className="text-slate-600">•</span>
                  <span>Highest: <span className="text-slate-100 font-semibold">{topBid.bidderName}</span></span>
                </>
              )}
            </div>

            {/* Bid Form */}
            <div className="rounded-2xl bg-[#0d1526] border border-[#1e2d4a] p-5 space-y-4">
              {canBid ? (
                <form onSubmit={handleBid}>
                  <p className="text-xs text-slate-500 mb-3">
                    Minimum bid: <span className="text-slate-300 font-semibold">{formatCurrency(nextBid)}</span>
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        id="bid-amount"
                        type="number"
                        min={nextBid}
                        step={minimumIncrement > 0 ? minimumIncrement : 0.01}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={nextBid.toFixed(2)}
                        className="w-full bg-[#060d1f] border border-[#1e2d4a] rounded-xl px-4 py-3.5 pl-8 text-slate-100 text-sm outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <button
                      id="place-bid"
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 whitespace-nowrap text-sm flex items-center gap-2"
                    >
                      {submitting ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <Gavel className="h-4 w-4" />
                      )}
                      Place Bid
                    </button>
                  </div>
                  {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}
                </form>
              ) : (
                <div className="text-center py-2">
                  <p className="text-slate-400 text-sm">{bidBlockMessage}</p>
                  {!token && (
                    <Link to="/login" className="mt-3 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all">
                      Login to Bid
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Live Bid Activity */}
            <div className="rounded-2xl bg-[#0d1526] border border-[#1e2d4a] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <h2 className="font-bold text-slate-100">Live bid activity</h2>
                <span className="ml-auto text-xs text-slate-500">{bids.length} bid{bids.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="divide-y divide-[#1e2d4a] max-h-72 overflow-y-auto">
                {bids.length === 0 && (
                  <div className="py-10 text-center text-slate-600 text-sm">
                    No bids yet. Be the first!
                  </div>
                )}
                {bids.map((bid, idx) => (
                  <div key={bid.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#0a1020] transition-colors">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {bid.bidderName ? bid.bidderName.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{bid.bidderName || 'Bidder'}</p>
                        <p className="text-xs text-slate-600">{new Date(bid.bidTime).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-400 text-sm">{formatCurrency(bid.amount)}</p>
                      {idx === 0 && (
                        <p className="text-xs text-emerald-400 font-semibold">Highest</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
