import { Link } from 'react-router-dom';
import { Heart, Clock, DollarSign, Gavel } from 'lucide-react';
import { formatCurrency, formatTimeLeft } from '../utils/format';
import { useWishlist } from '../hooks/useWishlist';

export default function AuctionCard({ auction, now }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(auction.id);
  const isActive = auction.status === 'ACTIVE';
  const price = auction.currentPrice ?? auction.startingPrice;
  const currentUserId = Number(localStorage.getItem('userId') || 0);
  const isSeller = Boolean(currentUserId && auction?.sellerId === currentUserId);

  return (
    <article className="group rounded-2xl overflow-hidden border border-[#1e2d4a] bg-[#0d1526] hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#060d1f] overflow-hidden">
        <Link to={`/auctions/${auction.id}`} className="block w-full h-full">
          {auction.image ? (
            <img
              src={auction.image}
              alt={auction.title}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gavel className="h-16 w-16 text-[#1e2d4a]" />
            </div>
          )}
        </Link>

        {/* Top-left: category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0d1526]/90 border border-[#1e2d4a] text-slate-300 backdrop-blur-sm">
            {auction.categoryName || 'Uncategorized'}
          </span>
        </div>

        {/* Top-right: status badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isActive
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-600 text-slate-200'
          }`}>
            {isActive ? 'Active' : auction.status}
          </span>
        </div>

        {/* Bottom-right: wishlist */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(auction); }}
          className={`absolute bottom-3 right-3 flex items-center justify-center w-7 h-7 rounded-full border transition-all backdrop-blur-sm ${
            wishlisted 
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' 
              : 'bg-[#0d1526]/80 border-[#1e2d4a] text-slate-400 hover:text-rose-400 hover:border-rose-400/50'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <Link
            to={`/auctions/${auction.id}`}
            className="font-semibold text-slate-100 hover:text-blue-400 transition-colors line-clamp-1 text-base"
          >
            {auction.title}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">by {auction.sellerName || 'Unknown'}</p>
        </div>

        {/* Price + Bids + Time row */}
        <div className="flex items-center gap-2.5 text-sm">
          <div className="flex items-center gap-1 text-slate-100 font-bold">
            <DollarSign className="h-3.5 w-3.5 text-blue-400" />
            <span>{formatCurrency(price).replace('$', '')}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-slate-100 font-bold">
            <span>{auction.bidCount || 0}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs">{formatTimeLeft(auction.endTime, now)}</span>
          </div>
        </div>

        {/* Bid Now button */}
        {isActive && !isSeller ? (
          <Link
            to={`/auctions/${auction.id}`}
            className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
          >
            Place Bid
          </Link>
        ) : (
          <Link
            to={`/auctions/${auction.id}`}
            className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 bg-[#1e2d4a] text-slate-400 hover:bg-[#1e2d4a]/80"
          >
            View Auction
          </Link>
        )}
      </div>
    </article>
  );
}
