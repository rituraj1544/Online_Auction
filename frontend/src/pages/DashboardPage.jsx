import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, PlusCircle, Trophy, TrendingUp, Store, ChevronRight, Clock, DollarSign } from 'lucide-react';
import api from '../services/api';
import { formatCurrency, formatTimeLeft } from '../utils/format';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card p-5 rounded-2xl group transition-all duration-300 border border-slate-800 bg-slate-900/50 hover:border-slate-700">
      <div className="mb-3 flex items-center justify-between text-slate-400">
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-50">{value}</p>
        <p className="text-sm font-medium text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function DashboardList({ title, icon: Icon, items, emptyMessage, renderItem }) {
  return (
    <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center gap-2">
        <Icon className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-100">{title}</h2>
      </div>
      <div className="flex-1 p-2">
        {items.length > 0 ? (
          <div className="flex flex-col gap-1">
            {items.map((item, i) => (
              <div key={i} className="p-3 hover:bg-slate-800/50 rounded-xl transition-colors">
                {renderItem(item)}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const userName = localStorage.getItem('userName') || 'User';
  const currentUserId = Number(localStorage.getItem('userId') || 0);

  useEffect(() => {
    Promise.all([api.get('/auctions'), api.get('/bids/my')])
      .then(([aRes, bRes]) => {
        setAuctions(aRes.data);
        setMyBids(bRes.data);
      })
      .finally(() => setLoading(false));

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const myAuctions = auctions.filter((a) => a.sellerId === currentUserId);
  const liveAuctions = auctions.filter((a) => a.status === 'ACTIVE');

  const myBidsByAuction = Object.values(
    myBids.reduce((acc, bid) => {
      if (!acc[bid.auctionId] || bid.amount > acc[bid.auctionId].amount) {
        acc[bid.auctionId] = bid;
      }
      return acc;
    }, {})
  ).map((bid) => {
    const auction = auctions.find(a => a.id === bid.auctionId);
    return auction ? { ...bid, auction } : null;
  }).filter(Boolean);

  const activeBids = myBidsByAuction.filter((b) => b.auction.status === 'ACTIVE');
  const wonAuctions = auctions.filter((a) => a.status === 'ENDED' && a.winnerId === currentUserId);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <div className="animate-spin h-10 w-10 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/50">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Welcome back, {userName}</h1>
          <p className="text-slate-400 mt-1">Here is your detailed auction activity.</p>
        </div>
        <Link to="/create-auction" className="btn-primary flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Create Auction
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Gavel} label="My Auctions" value={myAuctions.length} color="text-sky-400" />
          <StatCard icon={TrendingUp} label="Active Bids" value={activeBids.length} color="text-amber-400" />
          <StatCard icon={Trophy} label="Auctions Won" value={wonAuctions.length} color="text-emerald-400" />
          <StatCard icon={Store} label="Marketplace Live" value={liveAuctions.length} color="text-indigo-400" />
        </div>

        {/* Detailed Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Active Bids List */}
          <DashboardList
            title="Active Bids Details"
            icon={TrendingUp}
            items={activeBids}
            emptyMessage="You have no active bids right now."
            renderItem={(bid) => (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/auctions/${bid.auction.id}`} className="font-semibold text-slate-200 hover:text-amber-400 transition-colors truncate block">
                    {bid.auction.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Your bid: {formatCurrency(bid.amount)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatTimeLeft(bid.auction.endTime, now)}</span>
                  </div>
                </div>
                <Link to={`/auctions/${bid.auction.id}`} className="shrink-0 p-2 text-slate-500 hover:text-slate-300 bg-slate-800 rounded-lg">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          />

          {/* My Auctions List */}
          <DashboardList
            title="My Auctions"
            icon={Gavel}
            items={myAuctions}
            emptyMessage="You haven't created any auctions yet."
            renderItem={(auction) => (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/auctions/${auction.id}`} className="font-semibold text-slate-200 hover:text-sky-400 transition-colors truncate block">
                    {auction.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">Status: <span className={auction.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}>{auction.status}</span></span>
                    <span className="flex items-center gap-1">Bids: {auction.bidCount || 0}</span>
                  </div>
                </div>
                <Link to={`/auctions/${auction.id}`} className="shrink-0 p-2 text-slate-500 hover:text-slate-300 bg-slate-800 rounded-lg">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          />

          {/* Won Auctions List */}
          <DashboardList
            title="Won Auctions"
            icon={Trophy}
            items={wonAuctions}
            emptyMessage="You haven't won any auctions yet. Keep bidding!"
            renderItem={(auction) => (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/auctions/${auction.id}`} className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors truncate block">
                    {auction.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">Winner!</span>
                    <span className="flex items-center gap-1">Ended: {new Date(auction.endTime).toLocaleDateString()}</span>
                  </div>
                </div>
                <Trophy className="shrink-0 h-5 w-5 text-emerald-500 mr-2" />
              </div>
            )}
          />

        </div>
      </div>
    </div>
  );
}