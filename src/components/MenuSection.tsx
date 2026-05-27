import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Flame, CupSoda, Cake, Sparkles, Plus, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Beef } from 'lucide-react';

interface MenuSectionProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onInstantAdd: (item: MenuItem) => void;
}

type CategoryType = 'all' | 'burgers' | 'chicken' | 'sides' | 'drinks' | 'desserts';

export const MenuSection: React.FC<MenuSectionProps> = ({ items, onSelectItem, onInstantAdd }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const categories: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Cravings', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'burgers', label: 'burgers', icon: <Beef className="w-4 h-4" /> },
    { id: 'chicken', label: 'Chicken', icon: <Flame className="w-4 h-4 text-orange-400" /> },
    { id: 'sides', label: 'Golden Sides', icon: <Sparkles className="w-4 h-4 text-gold-500" /> },
    { id: 'drinks', label: 'Refreshments', icon: <CupSoda className="w-4 h-4 text-blue-400" /> },
    { id: 'desserts', label: 'Desserts & Pies', icon: <Cake className="w-4 h-4 text-pink-400" /> },
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  const handleInstantAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onInstantAdd(item);
    
    // Temporarily show checkmark feed
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'best seller':
        return 'bg-gold-500/10 text-gold-500 border-gold-500/30';
      case 'spicy':
      case 'hot & spicy':
        return 'bg-red-500/10 text-red-450 border-red-500/25';
      case 'popular':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      default:
        return 'bg-white/10 text-white/70 border-white/10';
    }
  };

  return (
    <div className="py-8">
      {/* Dynamic Promotion Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 text-white p-8 mb-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gold-500/10 border border-gold-500/30 text-[11px] font-mono tracking-wider font-extrabold uppercase rounded-full mb-3 text-gold-500">
              🎉 EXCLUSIVE GOLD OFFER
            </span>
            <span className="text-gold-500 font-serif italic text-xl select-none mb-1 block">The Signature Collection</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
              Savor the Supreme Golden Double
            </h2>
            <p className="mt-3 text-white/60 text-sm sm:text-base font-normal leading-relaxed">
              Our gold-standard signature double patty burger with secret house truffle sauce. Use coupon <code className="bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono font-bold text-gold-500">MCDELIGHT</code> at checkout for <strong className="text-white font-bold">15% off</strong>.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-inner flex items-center space-x-4 max-w-xs"
          >
            <div className="text-center">
              <p className="text-[10px] font-mono tracking-widest text-[#DBA111] uppercase">Flash Combo Price</p>
              <p className="text-3xl font-black text-white mt-1">$6.99 <span className="text-xs text-white/40 line-through font-normal">$9.48</span></p>
              <button 
                onClick={() => onSelectItem(items[0])}
                className="mt-4 w-full bg-gold-500 text-black text-xs font-black py-2.5 px-5 rounded-xl shadow-lg shadow-gold-500/20 hover:bg-gold-600 transition-all cursor-pointer uppercase tracking-wider"
              >
                Customize Combo
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Category Horizontal Filter Bar */}
      <div className="mb-10">
        <h3 className="text-2xl font-extrabold text-white tracking-tight mb-5">Explore Our Golden Menu</h3>
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl whitespace-nowrap text-sm font-extrabold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gold-500 text-black border-gold-500 shadow-md shadow-gold-500/20'
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Grid of Menu Items */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const hasCustomOptions = item.customizations && 
              ((item.customizations.sizes && item.customizations.sizes.length > 1) || 
               (item.customizations.addOns && item.customizations.addOns.length > 0));

            const isItemJustAdded = addedItemIds[item.id];

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group bg-[#151515] rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-gold-500/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Top */}
                <div className="relative pt-[75%] bg-zinc-900 overflow-hidden cursor-pointer" onClick={() => onSelectItem(item)}>
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  />
                  
                  {/* Category overlay label */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className={`text-[10px] font-bold px-2.5 py-1 border rounded-lg shadow-md ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Calories badge */}
                  {item.calories && (
                    <span className="absolute bottom-3 right-3 bg-black/80 text-white/80 font-mono text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                      {item.calories} kcal
                    </span>
                  )}
                </div>

                {/* Info Center */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 
                        className="text-base font-extrabold text-white hover:text-gold-500 transition-colors cursor-pointer leading-tight h-10 line-clamp-2"
                        onClick={() => onSelectItem(item)}
                      >
                        {item.name}
                      </h4>
                      <span className="text-lg font-black text-gold-500 bg-gold-450/10 px-2.5 py-0.5 rounded-xl border border-gold-500/20 whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-white/50 mt-2 line-clamp-2 min-h-[2rem]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    {/* Size and addons indicator */}
                    <div className="text-[11px] font-semibold text-white/30 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-white/20" />
                      <span>{hasCustomOptions ? 'Customizable' : 'Instant Grab'}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Customize Option Trigger */}
                      {hasCustomOptions && (
                        <button
                          onClick={() => onSelectItem(item)}
                          className="px-3.5 py-2 text-xs font-bold text-gold-500 bg-gold-500/10 hover:bg-gold-500/20 rounded-xl transition-all border border-gold-500/25 cursor-pointer"
                        >
                          Customize
                        </button>
                      )}

                      {/* Main Basket Action Button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleInstantAdd(item, e)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                          isItemJustAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-gold-500 hover:bg-gold-600 text-black shadow-md shadow-gold-500/10'
                        }`}
                        title="Add to order"
                      >
                        {isItemJustAdded ? <Check className="w-4 h-4 font-black" /> : <Plus className="w-4 h-4 font-black" />}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
