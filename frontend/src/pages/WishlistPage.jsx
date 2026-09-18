import { useEffect, useState } from 'react';
import { Heart, Search, Gavel } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import AuctionCard from '../components/AuctionCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered = wishlist.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    (a.categoryName && a.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#060d1f] text-slate-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-rose-500 font-bold text-xs tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 fill-current" /> My Wishlist
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Saved Auctions</h1>
            <p className="text-slate-400 text-sm">Keep track of the items you love.</p>
          </div>
          
          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d1526] border border-[#1e2d4a] rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-100 outline-none placeholder-slate-600 focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="bg-[#0a1128] border border-[#1e2d4a] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Heart className="h-16 w-16 text-[#1e2d4a] mb-4" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-500 max-w-sm">
              Click the heart icon on any auction in the marketplace to save it here for later.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#0a1128] border border-[#1e2d4a] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Search className="h-12 w-12 text-[#1e2d4a] mb-4" />
            <h3 className="text-lg font-bold text-slate-200 mb-2">No matches found</h3>
            <p className="text-slate-500">
              No saved auctions match your search '{search}'.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} now={now} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
