import { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order } from './types';
import { MENU_ITEMS, COUPONS } from './data/menu';
import { Header } from './components/Header';
import { MenuSection } from './components/MenuSection';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { Compass, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  
  // Single active order tracker, plus a history list
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [viewingOrderStatus, setViewingOrderStatus] = useState(false);

  // Initialize order states from localStorage for elegant endurance across sessions
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('mc_cart_items');
      if (storedCart) setCartItems(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem('mc_order_history');
      if (storedOrders) {
        const history: Order[] = JSON.parse(storedOrders);
        setOrderHistory(history);
        if (history.length > 0) {
          // Default to the last order if it is not marked as fully delivered yet
          const last = history[history.length - 1];
          if (last.status !== 'delivered') {
            setActiveOrder(last);
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse state from storage', e);
    }
  }, []);

  // Sync cart state
  const saveCartToStorage = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('mc_cart_items', JSON.stringify(items));
  };

  // Add customized item to ordering basket
  const handleAddCartItem = (newItem: CartItem) => {
    const existingIndex = cartItems.findIndex((item) => item.id === newItem.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += newItem.quantity;
      saveCartToStorage(updated);
    } else {
      saveCartToStorage([...cartItems, newItem]);
    }
    // Briefly slide open cart drawer for luxurious delightful confirmation response!
    setIsCartOpen(true);
  };

  // Simple instant-add bypassing customization (uses default size selection with no extra cheese add-ons)
  const handleInstantAdd = (item: MenuItem) => {
    const size = item.customizations?.sizes && item.customizations.sizes.length > 0 
      ? item.customizations.sizes[0] 
      : undefined;

    const cartItem: CartItem = {
      id: `${item.id}-default-[]-`,
      menuItem: item,
      quantity: 1,
      selectedSize: size,
      selectedAddOns: [],
      specialInstructions: '',
      totalUnitPrice: item.price,
    };

    handleAddCartItem(cartItem);
  };

  const handleUpdateQty = (itemId: string, diff: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        const nextQty = item.quantity + diff;
        return { ...item, quantity: Math.max(1, nextQty) };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const handleRemoveItem = (itemId: string) => {
    const filtered = cartItems.filter((item) => item.id !== itemId);
    saveCartToStorage(filtered);
  };

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
  };

  // Checkout maths calculation block
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalUnitPrice * item.quantity, 0);
  const deliveryCharge = subtotal > 15 ? 0 : 2.99;
  const tax = subtotal * 0.08;

  let discountValue = 0;
  const appliedCoupon = COUPONS.find((c) => c.code === couponCode);
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.code === 'MCDELIGHT' && subtotal >= 10) {
      discountValue = subtotal * 0.15;
    } else if (appliedCoupon.code === 'BURGERHEAVEN' && subtotal >= 15) {
      discountValue = 5.00;
    } else if (appliedCoupon.code === 'FREEFRIES' && subtotal >= 5) {
      discountValue = 2.50;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryCharge + tax - discountValue);

  // Execute actual submission
  const handleSubmitOrder = (order: Order) => {
    const nextHistory = [...orderHistory, order];
    setOrderHistory(nextHistory);
    localStorage.setItem('mc_order_history', JSON.stringify(nextHistory));

    setActiveOrder(order);
    
    // Clear ordering basket completely
    saveCartToStorage([]);
    setCouponCode('');
    
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    
    // Open live progress tracker screen instantly!
    setViewingOrderStatus(true);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleViewActiveOrderStatus = () => {
    setViewingOrderStatus(true);
  };

  const handlePlaceNewOrder = () => {
    setViewingOrderStatus(false);
  };

  // Filter items based on header search box
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E5E5E5] antialiased font-sans">
      
      {/* 1. Header Branded Navigation bar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrderCount={activeOrder ? 1 : 0}
        onViewActiveOrderStatus={handleViewActiveOrderStatus}
      />

      {/* 2. Main Content Screens */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {viewingOrderStatus && activeOrder ? (
            /* (A) Live Delivery Pipeline Screen */
            <motion.div
              key="tracking-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <OrderTracker
                order={activeOrder}
                onPlaceNewOrder={handlePlaceNewOrder}
              />
            </motion.div>
          ) : (
            /* (B) Main E-Commerce Catalog Menu Screen */
            <motion.div
              key="catalog-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <MenuSection
                items={filteredMenuItems}
                onSelectItem={(item) => setSelectedItem(item)}
                onInstantAdd={handleInstantAdd}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Global Floating Sticky Quick Checkout bar for premium user experience */}
      {cartCount > 0 && !viewingOrderStatus && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4"
        >
          <div className="bg-[#151515] text-white rounded-3xl p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 pl-2">
              <span className="relative p-2.5 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-[9px] font-mono font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </span>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-semibold">Your items are hungry</p>
                <p className="text-[17px] font-black text-gold-500 mt-1 leading-none font-mono">
                  ${grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs py-3 px-6 rounded-2xl cursor-pointer flex items-center space-x-1.5 transition-all outline-none"
            >
              <span className="font-extrabold">View Basket</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. Overlay Modals & Sidebar Drawers */}
      {/* (A) Item Recipe Customizer Overlay Dial */}
      <ItemCustomizeModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddCartItem={handleAddCartItem}
      />

      {/* (B) Slider Shopping Basket Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        couponCode={couponCode}
        onApplyCoupon={handleApplyCoupon}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* (C) Logistic address & Credit card checkout modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        tax={tax}
        discount={discountValue}
        total={grandTotal}
        couponCode={couponCode}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Standard simple footer block */}
      <footer className="bg-[#0B0B0B] border-t border-white/10 py-10 mt-20 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-extrabold tracking-widest text-gold-500 text-sm uppercase">McGold Premium Commerce Hub</p>
          <p className="mt-2 text-[10px] font-mono text-white/20 tracking-wider">SECURE PAYMENT • © 2026 MCDONALDS INSPIRED MODERN DIGITAL PORTAL. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

    </div>
  );
}
