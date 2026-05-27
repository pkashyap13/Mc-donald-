import React from 'react';
import { ShoppingBag, Search, Compass, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeOrderCount: number;
  onViewActiveOrderStatus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  activeOrderCount,
  onViewActiveOrderStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0D0D]/95 border-b border-white/10 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Section */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gold-500 rounded-2xl flex items-center justify-center shadow-lg shadow-gold-500/20"
            >
              {/* Modern Golden Arches inspired brand logo */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 fill-black">
                <path d="M20 75 C 20 25, 45 25, 50 55 C 55 25, 80 25, 80 75 L 72 75 C 72 35, 58 35, 54 65 L 46 65 C 42 35, 28 35, 28 75 Z" />
              </svg>
            </motion.div>
            
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                Bite<span className="text-gold-500">Gold</span>
              </h1>
              <p className="text-[10px] font-mono tracking-wider text-white/40 mt-1 uppercase">EST. 2026 • SOPHISTICATED FAST FOOD</p>
            </div>
          </div>

          {/* Quick Stats Bars */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
              <MapPin className="w-4 h-4 text-gold-500 animate-pulse" />
              <span className="font-semibold text-white/80">Downtown Express Hub</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
              <Clock className="w-4 h-4 text-gold-500" />
              <span className="font-semibold text-white/80">15-20 Min Delivery</span>
            </div>
          </div>

          {/* Search bar & Action Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-xs sm:max-w-md md:max-w-sm lg:max-w-md ml-4 sm:ml-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/30" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search burgers, sides, desserts..."
                className="block w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-2xl bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm"
              />
            </div>

            {/* View order status button if an active order exists */}
            {activeOrderCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewActiveOrderStatus}
                className="relative p-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-500 hover:bg-gold-500/20 transition-all cursor-pointer flex items-center space-x-1"
                title="View Active Orders"
              >
                <Compass className="w-5 h-5 animate-spin-slow text-gold-500" />
                <span className="hidden lg:inline text-xs font-semibold">Track Order</span>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold-500 text-black font-mono text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0D0D0D]">
                  {activeOrderCount}
                </span>
              </motion.button>
            )}

            {/* Shopping Cart button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="relative p-3 rounded-2xl bg-gold-500 hover:bg-gold-600 text-black font-bold transition-all shadow-md shadow-gold-500/10 cursor-pointer flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold">Cart</span>
              {cartCount > 0 ? (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-black font-mono text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-gold-500 shadow-sm"
                >
                  {cartCount}
                </motion.span>
              ) : null}
            </motion.button>
          </div>

        </div>
      </div>
    </header>
  );
};
