import React, { useState, useEffect } from 'react';
import { MenuItem, CustomizationOption, CartItem } from '../types';
import { X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddCartItem: (cartItem: CartItem) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  onClose,
  onAddCartItem,
}) => {
  const [selectedSize, setSelectedSize] = useState<CustomizationOption | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalUnitPrice, setTotalUnitPrice] = useState(0);

  // Initialize customization options whenever item changes
  useEffect(() => {
    if (item) {
      // Default to first size if sizes exist
      if (item.customizations?.sizes && item.customizations.sizes.length > 0) {
        setSelectedSize(item.customizations.sizes[0]);
      } else {
        setSelectedSize(undefined);
      }
      setSelectedAddOns([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [item]);

  // Recalculate dynamic price
  useEffect(() => {
    if (!item) return;

    let base = item.price;
    if (selectedSize) {
      base += selectedSize.price;
    }

    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    setTotalUnitPrice(base + addOnTotal);
  }, [item, selectedSize, selectedAddOns]);

  if (!item) return null;

  const handleToggleAddOn = (addOn: CustomizationOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((opt) => opt.id === addOn.id);
      if (exists) {
        return prev.filter((opt) => opt.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const handleIncrementQty = () => setQuantity((q) => q + 1);
  const handleDecrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToOrder = () => {
    // Generate a secure cart hash ID based on properties so identical items group correctly in the cart!
    const addOnIds = selectedAddOns.map((a) => a.id).sort().join(',');
    const sizeId = selectedSize ? selectedSize.id : 'default';
    const cartId = `${item.id}-${sizeId}-[${addOnIds}]-${specialInstructions.trim()}`;

    const newCartItem: CartItem = {
      id: cartId,
      menuItem: item,
      quantity,
      selectedSize,
      selectedAddOns,
      specialInstructions: specialInstructions.trim(),
      totalUnitPrice,
    };

    onAddCartItem(newCartItem);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-[#111111] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col max-h-[90vh]"
        >
          {/* Header Image Cover */}
          <div className="relative h-60 bg-zinc-900 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-75"
            />
            {/* Close trigger button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white cursor-pointer transition-all border border-white/10 shadow-sm z-20"
            >
              <X className="w-5 h-5 animate-pulse" />
            </button>

            {/* Gradient Mask Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#111111] to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute bottom-4 left-6 z-10">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gold-500/10 border border-gold-500/30 text-gold-500 text-[10px] font-bold tracking-wider rounded-md uppercase mb-2">
                Customize Recipe
              </span>
              <h3 className="text-2xl font-black text-white leading-none">{item.name}</h3>
            </div>
          </div>

          {/* Configuration Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <p className="text-xs text-white/50 leading-relaxed max-w-xl">
              {item.description}
            </p>

            {/* 1. SIZES & BEEF MULTIPLIERS */}
            {item.customizations?.sizes && item.customizations.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-extrabold text-white/80 uppercase tracking-wider">
                    1. Choose Portion Size
                  </span>
                  <span className="bg-gold-500/10 text-gold-500 text-[9px] font-bold px-2 py-0.5 rounded border border-gold-500/20">REQUIRED</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {item.customizations.sizes.map((sizeOption) => {
                    const isSelected = selectedSize?.id === sizeOption.id;
                    return (
                      <button
                        key={sizeOption.id}
                        onClick={() => setSelectedSize(sizeOption)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500 ring-2 ring-gold-500/15'
                            : 'border-white/10 bg-white/5 text-white/90 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-extrabold leading-tight">{sizeOption.name}</span>
                        <span className={`text-[11px] font-bold mt-2 ${isSelected ? 'text-gold-500' : 'text-white/40'}`}>
                          {sizeOption.price === 0 ? 'Included' : `+$${sizeOption.price.toFixed(2)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. CHOOSE ADD-ONS */}
            {item.customizations?.addOns && item.customizations.addOns.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-extrabold text-white/80 uppercase tracking-wider">
                    2. Add Extra Goodies
                  </span>
                  <span className="text-white/40 text-[9px] font-bold tracking-wider">OPTIONAL • MULTIPLE SELECT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.customizations.addOns.map((addOn) => {
                    const isSelected = selectedAddOns.some((opt) => opt.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => handleToggleAddOn(addOn)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                            : 'border-white/10 bg-white/5 text-white/90 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold">{addOn.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                            +${addOn.price.toFixed(2)}
                          </span>
                          <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-gold-500 border-gold-500 text-black' : 'border-white/20'
                          }`}>
                            {isSelected && <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. SPECIAL INSTRUCTIONS PANEL */}
            <div className="space-y-3">
              <span className="block text-xs font-extrabold text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">
                3. Special Cooking Info?
              </span>
              <div className="relative">
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="E.g. No onion, no mustard sauce, toasted well, separate pickles... We accommodate most requests!"
                  rows={2}
                  maxLength={160}
                  className="w-full border border-white/10 rounded-2xl bg-white/5 p-3.5 text-xs text-white outline-none focus:bg-white/10 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all font-sans resize-none"
                />
                <div className="absolute right-3.5 bottom-3 text-[10px] font-mono text-white/30">
                  {specialInstructions.length}/160 chars
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Total Actions footer */}
          <div className="p-6 bg-[#0D0D0D] border-t border-white/10 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Quantity Controller Panel */}
            <div className="flex items-center space-x-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shadow-sm">
              <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={handleDecrementQty}
                  disabled={quantity <= 1}
                  className="p-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-base text-white w-5 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrementQty}
                  className="p-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Final checkout item CTA */}
            <button
              onClick={handleAddToOrder}
              className="w-full sm:w-auto flex-1 bg-gold-500 hover:bg-gold-600 text-black font-extrabold py-3.5 px-6 rounded-2xl cursor-pointer shadow-lg shadow-gold-500/10 flex items-center justify-between gap-4"
            >
              <span className="text-sm font-black whitespace-nowrap">Add to order Bag • {quantity} item{quantity > 1 ? 's' : ''}</span>
              <span className="text-sm font-black bg-black/10 text-black px-3 py-1 rounded-xl">
                ${(totalUnitPrice * quantity).toFixed(2)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
