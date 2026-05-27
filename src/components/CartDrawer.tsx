import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, BadgePercent, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COUPONS } from '../data/menu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, diff: number) => void;
  onRemoveItem: (itemId: string) => void;
  couponCode: string;
  onApplyCoupon: (code: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  couponCode,
  onApplyCoupon,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalUnitPrice * item.quantity, 0);
  const deliveryCharge = subtotal > 15 ? 0 : 2.99; // Free delivery for orders over $15!
  const tax = subtotal * 0.08; // 8% food tax

  // Calculate discount based on active code
  let discountValue = 0;
  const appliedCoupon = COUPONS.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.code === 'MCDELIGHT' && subtotal >= 10) {
      discountValue = subtotal * 0.15; // 15% off
    } else if (appliedCoupon.code === 'BURGERHEAVEN' && subtotal >= 15) {
      discountValue = 5.00; // Flat $5 off
    } else if (appliedCoupon.code === 'FREEFRIES' && subtotal >= 5) {
      discountValue = 2.50; // Save $2.50
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryCharge + tax - discountValue);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const typed = couponInput.trim().toUpperCase();
    if (!typed) return;

    const matched = COUPONS.find(c => c.code === typed);
    if (!matched) {
      setCouponError('Invalid coupon code. Try MCDELIGHT');
      return;
    }

    // Min spend validation
    if (typed === 'MCDELIGHT' && subtotal < 10) {
      setCouponError('MCDELIGHT requires minimum spend of $10.00');
      return;
    } else if (typed === 'BURGERHEAVEN' && subtotal < 15) {
      setCouponError('BURGERHEAVEN requires minimum spend of $15.00');
      return;
    } else if (typed === 'FREEFRIES' && subtotal < 5) {
      setCouponError('FREEFRIES requires minimum spend of $5.00');
      return;
    }

    onApplyCoupon(typed);
    setCouponInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#0D0D0D] border-l border-white/10 shadow-2xl flex flex-col justify-between h-full text-white"
            >
              {/* Header section */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-xl">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.21 9l-4.3-6.29a1 1 0 00-1.64 0L6.97 9H3a1 1 0 000 2h1.22l2 8a3 3 0 003 2.53h7.6a3 3 0 003-2.53l2-8H21a1 1 0 000-2h-3.79zm-10.1 2h9.78l-1.62 6.5a1 1 0 01-1 .75H9.7c-.47 0-.87-.33-.97-.75L7.11 11zM12 3.65L15.65 9H8.35L12 3.65z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-white tracking-tight leading-none">Your Order Basket</h3>
                    <p className="text-[10px] text-white/40 mt-1 font-mono tracking-wider font-semibold uppercase">
                      {cartItems.length} DISTINCT ITEM{cartItems.length !== 1 ? 'S' : ''} SELECTED
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Central body containing item cards */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-24 h-24 bg-gold-500/5 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-dashed border-gold-500/20">
                      <svg className="w-10 h-10 text-gold-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h4 className="text-base font-extrabold text-white">Your basket is empty</h4>
                    <p className="text-xs text-white/40 max-w-xs mx-auto mt-2 leading-relaxed">
                      Delicious burgers and crunchy golden fries are only a few clicks away! Visit our product listings to satisfy your appetite.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-gold-500/10 cursor-pointer"
                    >
                      Browse Golden Menu
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#151515] rounded-2xl border border-white/10 flex gap-4 hover:border-white/20 hover:shadow-sm transition-all"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0D0D0D] flex-shrink-0">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover brightness-90"
                        />
                      </div>

                      {/* Item Content details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-1">
                          <div>
                            <h4 className="text-xs font-extrabold text-white tracking-tight leading-tight">
                              {item.menuItem.name}
                            </h4>
                            
                            {/* Selected portion size option */}
                            {item.selectedSize && (
                              <span className="inline-block text-[9px] bg-gold-500/10 text-gold-500 font-extrabold px-1.5 py-0.5 border border-gold-500/20 rounded-md mt-1">
                                {item.selectedSize.name}
                              </span>
                            )}
                          </div>

                          <span className="text-xs font-black text-gold-500 bg-gold-500/5 px-2 py-0.5 rounded-lg border border-gold-500/20 whitespace-nowrap">
                            ${(item.totalUnitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Selected additions list */}
                        {item.selectedAddOns.length > 0 && (
                          <div className="mt-2 text-wrap flex flex-wrap gap-1 leading-none">
                            {item.selectedAddOns.map((addOn) => (
                              <span key={addOn.id} className="text-[9px] bg-gold-500/5 text-gold-500 border border-gold-500/10 rounded px-1.5 py-0.5">
                                + {addOn.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Custom Instruction line */}
                        {item.specialInstructions && (
                          <p className="text-[10px] text-white/40 italic mt-2.5 border-l-2 border-white/10 pl-2 leading-tight">
                            &ldquo;{item.specialInstructions}&rdquo;
                          </p>
                        )}

                        {/* Item Cart Modifiers */}
                        <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateQty(item.id, -1);
                                } else {
                                  onRemoveItem(item.id);
                                }
                              }}
                              className="p-1 rounded-md bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:text-white transition cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-xs font-bold text-white w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="p-1 rounded-md bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:text-white transition cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-white/30 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer pricing drawer breakdown */}
              {cartItems.length > 0 && (
                <div className="bg-[#0B0B0B] border-t border-white/10 p-6 space-y-4">
                  {/* Coupon implementation form */}
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest block">
                      Promotional Coupon / Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="E.g. MCDELIGHT"
                          className="w-full pl-3 pr-3 py-2 border border-white/10 bg-[#151515] rounded-xl text-xs uppercase outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all shrink-0"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Success applied banner */}
                    {couponCode && (
                      <div className="flex items-center justify-between text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-2 mt-1">
                        <div className="flex items-center space-x-1.5">
                          <BadgePercent className="w-4 h-4 text-green-450 shrink-0" />
                          <span>Code <strong className="font-extrabold font-mono text-green-300">{couponCode}</strong> Active!</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onApplyCoupon('')}
                          className="text-[10px] underline hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-[10px] font-semibold text-red-400 mt-1">{couponError}</p>
                    )}
                  </form>

                  {/* Summary math block */}
                  <div className="space-y-2 border-t border-white/5 pt-3 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span>Subtotal</span>
                      <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-white/60">
                      <span>Delivery Fast-Charge</span>
                      {deliveryCharge === 0 ? (
                        <span className="text-green-400 font-extrabold flex items-center gap-1">
                          FREE <span className="text-[9px] line-through text-white/20 font-normal">$2.99</span>
                        </span>
                      ) : (
                        <span className="font-mono">${deliveryCharge.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Free shipping discount threshold warning banner */}
                    {deliveryCharge > 0 && (
                      <p className="text-[10px] text-gold-500 bg-gold-500/5 p-2 rounded border border-gold-500/20 text-center font-bold">
                        Add <span className="font-mono">${(15 - subtotal).toFixed(2)}</span> more to unlock <strong className="font-extrabold text-gold-500">FREE Delivery</strong>!
                      </p>
                    )}

                    <div className="flex justify-between text-white/60">
                      <span>Food Taxes (8%)</span>
                      <span className="font-mono">${tax.toFixed(2)}</span>
                    </div>

                    {discountValue > 0 && (
                      <div className="flex justify-between font-bold text-green-400 bg-green-500/5 p-1.5 rounded border border-dashed border-green-500/20 animate-pulse">
                        <span>Active Discount ({couponCode})</span>
                        <span className="font-mono">-${discountValue.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-black text-white border-t border-white/10 pt-3">
                      <span>Grand Total</span>
                      <span className="font-mono text-gold-500 text-2xl font-black">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submit checkout slider button */}
                  <button
                    onClick={onProceedToCheckout}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black font-extrabold py-3.5 px-5 rounded-2xl cursor-pointer shadow-lg shadow-gold-500/10 flex items-center justify-center space-x-2 transition-all mt-4"
                  >
                    <span>Secure Checkout</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <div className="flex items-center justify-center space-x-1.5 text-[10px] text-white/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span>Gold-Standard encrypted secure checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
