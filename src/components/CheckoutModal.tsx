import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { X, CreditCard, DollarSign, Bike, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  total: number;
  couponCode: string;
  onSubmitOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  deliveryCharge,
  tax,
  discount,
  total,
  couponCode,
  onSubmitOrder,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  
  // Card mock state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (phone.trim() && !/^\+?[\d\s-]{8,15}$/.test(phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!address.trim()) errors.address = 'Full delivery address is required';

    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (cardNumber && cardNumber.replace(/\s/g, '').length !== 16) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      if (!cardExpiry.trim()) errors.cardExpiry = 'Expiry date is required';
      if (cardExpiry && !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        errors.cardExpiry = 'Format must be MM/YY';
      }
      if (!cardCvc.trim()) errors.cardCvc = 'CVC is required';
      if (cardCvc && cardCvc.length !== 3) {
        errors.cardCvc = 'Must be 3 chars';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate cooking & pipeline initiation
    setTimeout(() => {
      const mockOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: cartItems,
        customerDetails: {
          name,
          phone,
          address,
          paymentMethod,
        },
        subtotal,
        deliveryCharge,
        tax,
        discount,
        total,
        couponCode: couponCode || undefined,
        timestamp: new Date().toISOString(),
        status: 'ordered',
      };

      onSubmitOrder(mockOrder);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  // Helper formats inputs
  const parseCardNumber = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').substring(0, 16);
    const parts = [];
    for (let i = 0; i < digitsOnly.length; i += 4) {
      parts.push(digitsOnly.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const parseExpiry = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').substring(0, 4);
    if (digitsOnly.length >= 3) {
      setCardExpiry(`${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`);
    } else {
      setCardExpiry(digitsOnly);
    }
  };

  const parseCvc = (val: string) => {
    setCardCvc(val.replace(/\D/g, '').substring(0, 3));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-[#111111] border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col md:flex-row max-h-[92vh] text-white"
          >
            {/* Left Portion: Shipping Details Form */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto border-r border-white/10 bg-[#111111]">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-none">Shipping & Payment</h3>
                  <p className="text-[10px] font-mono tracking-wide text-white/40 mt-1.5 uppercase">Complete delicious delivery specs</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter recipient's full name"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition"
                  />
                  {formErrors.name && (
                    <p className="text-[10px] font-bold text-red-400 mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Phone & Contact */}
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. +1 555-0199"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition"
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] font-bold text-red-400 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Delivery Street Address */}
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase mb-1.5">Street Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Write your complete shipping coordinates (E.g. Apartment, Suite, Street name, City)"
                    rows={2}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition resize-none"
                  />
                  {formErrors.address && (
                    <p className="text-[10px] font-bold text-red-400 mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* Payment methodology choice */}
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition ${
                        paymentMethod === 'card'
                          ? 'border-gold-500 bg-gold-500/10 text-gold-500 ring-2 ring-gold-500/20'
                          : 'border-white/10 bg-[#151515] text-white/70 hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs font-bold">Credit/Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition ${
                        paymentMethod === 'cash'
                          ? 'border-gold-500 bg-gold-500/10 text-gold-500 ring-2 ring-gold-500/20'
                          : 'border-white/10 bg-[#151515] text-white/70 hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-bold">Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                {/* Card input visual frame */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-5 border border-white/10 rounded-2xl bg-white/5 space-y-3.5 overflow-hidden"
                  >
                    <span className="block text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">
                      🔒 SECURE HIGH-GRADE CREDIT PIPELINE
                    </span>
                    
                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => parseCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-sm bg-white/5 text-white font-mono tracking-widest outline-none focus:ring-1 focus:ring-gold-500"
                      />
                      {formErrors.cardNumber && (
                        <p className="text-[10px] font-bold text-red-400 mt-1">{formErrors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => parseExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-sm bg-white/5 text-white font-mono outline-none focus:ring-1 focus:ring-gold-500"
                        />
                        {formErrors.cardExpiry && (
                          <p className="text-[10px] font-bold text-red-400 mt-1">{formErrors.cardExpiry}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => parseCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-sm bg-white/5 text-white font-mono outline-none focus:ring-1 focus:ring-gold-500"
                        />
                        {formErrors.cardCvc && (
                          <p className="text-[10px] font-bold text-red-400 mt-1">{formErrors.cardCvc}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-black font-extrabold py-3.5 px-5 rounded-2xl transition-all shadow-lg shadow-gold-500/10 text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-black font-bold">Validating secure channel, please wait...</span>
                    </div>
                  ) : (
                    <>
                      <Bike className="w-5 h-5 text-black" />
                      <span className="text-black font-black uppercase tracking-wider">Confirm & Track Delivery Order (${total.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Portion: Cost Breakdowns & Order Cart preview wrapper */}
            <div className="w-full md:w-80 bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">
                  🧾 Your order packet
                </span>

                {/* Items preview list */}
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs border-b border-white/5 pb-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0 brightness-95"
                      />
                      <div className="flex-1">
                        <h5 className="font-extrabold text-white line-clamp-1 leading-tight">{item.menuItem.name}</h5>
                        {item.selectedSize && (
                          <span className="text-[9px] text-gold-500 font-extrabold bg-gold-500/5 px-1.5 py-0.5 border border-gold-500/25 rounded mt-1 inline-block">
                            {item.selectedSize.name}
                          </span>
                        )}
                        <p className="text-white/40 text-[10px] font-mono mt-1">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-gold-550 font-bold">${(item.totalUnitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown maths */}
              <div className="border-t border-white/10 pt-4 mt-6 text-xs space-y-2">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white/60">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-white/60">
                  <span>Sales Tax (8%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400 font-bold bg-green-500/5 p-2 border border-green-500/20 rounded">
                    <span>Applied Coupon</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-black text-white border-t border-white/10 pt-3">
                  <span>Grand Total</span>
                  <span className="font-mono text-gold-500 font-black text-xl">${total.toFixed(2)}</span>
                </div>

                <div className="pt-4 flex items-start gap-2 text-[10px] text-white/30">
                  <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                  <span>By finalizing, you agree to our terms of swift fresh arrival & hot prep guarantee.</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
