import { useState, useEffect } from 'react';

export function useWishlist() {
  const getWishlist = () => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const [wishlist, setWishlistState] = useState(getWishlist());

  useEffect(() => {
    const handleStorage = () => {
      setWishlistState(getWishlist());
    };
    window.addEventListener('wishlistChanged', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('wishlistChanged', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleWishlist = (auction) => {
    let current = getWishlist();
    const exists = current.some((item) => item.id === auction.id);
    
    if (exists) {
      current = current.filter((item) => item.id !== auction.id);
    } else {
      current.push(auction);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(current));
    setWishlistState(current);
    window.dispatchEvent(new Event('wishlistChanged'));
  };

  const isWishlisted = (auctionId) => {
    return wishlist.some((item) => item.id === auctionId);
  };

  return { wishlist, toggleWishlist, isWishlisted };
}
