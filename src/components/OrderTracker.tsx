import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { ClipboardCheck, CookingPot, Bike, Compass, CheckCircle2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderTrackerProps {
  order: Order | null;
  onPlaceNewOrder: () => void;
}

type DeliveryStage = 'ordered' | 'preparing' | 'transit' | 'delivered';

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order, onPlaceNewOrder }) => {
  const [currentStage, setCurrentStage] = useState<DeliveryStage>('ordered');
  const [etaSeconds, setEtaSeconds] = useState(120); // 2 minutes visual countdown
  const [simulationActive, setSimulationActive] = useState(true);

  // Status mapping
  const stages: { key: DeliveryStage; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      key: 'ordered',
      label: 'Order Placed',
      desc: 'The kitchen has accepted your request & starting selection.',
      icon: <ClipboardCheck className="w-5 h-5" />,
      color: 'bg-gold-500'
    },
    {
      key: 'preparing',
      label: 'Kitchen Cooking',
      desc: 'Searing the double beef patties and frying golden potatoes.',
      icon: <CookingPot className="w-5 h-5" />,
      color: 'bg-gold-500'
    },
    {
      key: 'transit',
      label: 'Out for Delivery',
      desc: 'Fast-courier is cycling down Golden Highway to your block.',
      icon: <Bike className="w-5 h-5" />,
      color: 'bg-gold-500'
    },
    {
      key: 'delivered',
      label: 'Arrived & Ready!',
      desc: 'Dinner is served. Relish your hot & fresh bite!',
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'bg-[#10B981]'
    }
  ];

  // Set initial stage from order property if exists
  useEffect(() => {
    if (order) {
      setCurrentStage(order.status);
    }
  }, [order]);

  // Handle simulation countdown and stage transition
  useEffect(() => {
    if (!simulationActive || currentStage === 'delivered') return;

    const interval = setInterval(() => {
      // Countdown timer
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));

      // Randomly advance stage slightly faster for interactive demonstration
      if (Math.random() < 0.08) {
        setCurrentStage((curr) => {
          if (curr === 'ordered') return 'preparing';
          if (curr === 'preparing') return 'transit';
          if (curr === 'transit') return 'delivered';
          return curr;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStage, simulationActive]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-white/25 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white">No active tracking session</h3>
        <p className="text-white/40 text-xs mt-1.5">You don&apos;t have any active orders right now. satisfying your hunger is only clicks away!</p>
        <button
          onClick={onPlaceNewOrder}
          className="mt-6 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-black text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md shadow-gold-500/10"
        >
          Order Food Now
        </button>
      </div>
    );
  }

  const formatCountdown = (secs: number) => {
    if (currentStage === 'delivered') return '00:00 - Bon Appétit!';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')} arriving soon`;
  };

  const getStageIndex = (stage: DeliveryStage) => {
    return stages.findIndex(s => s.key === stage);
  };

  const activeIndex = getStageIndex(currentStage);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Tracker Hero Panel */}
      <div className="bg-[#151515] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5 text-white">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[11px] font-bold tracking-wider rounded-lg uppercase">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Real-Time Delivery tracking</span>
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
              Order No: <span className="font-mono text-gold-500 select-all">{order.id}</span>
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-white/40">Estimated Delivery Time</p>
            <p className="text-xl font-black font-mono text-white mt-1">
              {formatCountdown(etaSeconds)}
            </p>
          </div>
        </div>

        {/* Visual Map/Progress Path bar */}
        <div className="relative mt-10 mb-8 px-4">
          {/* Background Connector Bar Line */}
          <div className="absolute top-5 left-10 right-10 h-1 bg-white/5" />
          
          {/* Active Colored Connector Bar Line */}
          <motion.div 
            className="absolute top-5 left-10 h-1 bg-gold-500"
            style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
            layout
          />

          <div className="relative flex justify-between">
            {stages.map((stage, idx) => {
              const isDone = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center max-w-[120px] text-center">
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isCurrent ? '#DBA111' : isDone ? '#10B981' : '#1A1A1A',
                      color: isCurrent ? '#000000' : isDone ? '#FFFFFF' : '#FFFFFF',
                      borderColor: isCurrent ? '#DBA111' : isDone ? '#10B981' : '#222222',
                    }}
                    transition={{ type: 'spring', damping: 15 }}
                    className={`w-10 h-10 rounded-full border border-white/5 flex items-center justify-center shadow-md z-10`}
                  >
                    {isCurrent ? (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        {stage.icon}
                      </motion.div>
                    ) : (
                      stage.icon
                    )}
                  </motion.div>

                  <p className={`text-[10px] sm:text-xs font-extrabold mt-3.5 leading-tight ${isCurrent ? 'text-gold-500' : isDone ? 'text-white/80' : 'text-white/30'}`}>
                    {stage.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Detail Card describing exactly what is happening in the current stage */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
          <div className="p-3 bg-[#151515] rounded-xl shadow-xs border border-white/10 text-gold-500 shrink-0">
            {stages[activeIndex].icon}
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-tight">
              Current Stage: {stages[activeIndex].label}
            </h4>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              {stages[activeIndex].desc}
            </p>
          </div>
        </div>

        {/* Simulation Sandbox Control for User Delight to advance stages if they want */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div className="text-xs text-white/30">
            <span className="font-semibold text-white/50">Live Simulation Sandbox:</span> The tracker auto-advances, or you can speed up the kitchen pipeline manually for instant evaluation!
          </div>
          
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setCurrentStage((curr) => {
                  if (curr === 'ordered') return 'preparing';
                  if (curr === 'preparing') return 'transit';
                  if (curr === 'transit') return 'delivered';
                  return 'ordered';
                });
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white/70" />
              <span>Advance Status</span>
            </button>
            
            <button
              onClick={() => setSimulationActive(!simulationActive)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl cursor-pointer border transition-all shrink-0 ${
                simulationActive 
                  ? 'bg-gold-500 hover:bg-gold-600 border-gold-600 text-black shadow-md' 
                  : 'bg-[#1A1A1A] hover:bg-white/5 border-white/10 text-white/70'
              }`}
            >
              {simulationActive ? 'Pause Sim' : 'Resume Sim'}
            </button>
          </div>
        </div>
      </div>

      {/* Deliver Address Detail & Receipt Block combo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-xs">
        
        {/* Recipient Logistics */}
        <div className="bg-[#151515] rounded-3xl border border-white/10 p-6 shadow-sm">
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
            📍 Delivery Logistics
          </h4>
          <div className="space-y-4 text-xs text-white/70">
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Recipient Name</p>
              <p className="font-extrabold text-white text-sm mt-0.5">{order.customerDetails.name}</p>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Contact Number</p>
              <p className="font-mono text-white/80 text-sm mt-0.5">{order.customerDetails.phone}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Drop-off Street Address</p>
              <p className="font-medium text-white/80 mt-0.5 leading-relaxed">{order.customerDetails.address}</p>
            </div>

            <div className="pt-2">
              <span className="p-2 border border-green-500/20 bg-green-500/5 text-green-400 font-bold rounded-xl inline-flex items-center gap-1.5 uppercase text-[9px] tracking-wide">
                <span>Secure payment: {order.customerDetails.paymentMethod === 'card' ? 'CREDIT CARD' : 'CASH ON DELIVERY'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Food Receipt */}
        <div className="bg-[#151515] rounded-3xl border border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
              🍟 Order Summary / Receipt
            </h4>
            
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs pb-3 border-b border-white/5">
                  <div className="flex-1 pr-3 text-white">
                    <p className="font-extrabold leading-tight">
                      {item.menuItem.name} <span className="font-mono text-[10px] text-white/40 ml-1">x{item.quantity}</span>
                    </p>
                    {item.selectedSize && (
                      <span className="text-[9px] bg-gold-500/10 text-gold-500 font-extrabold px-1 py-0.2 rounded mt-1 inline-block border border-gold-500/20">
                        {item.selectedSize.name}
                      </span>
                    )}
                    {item.selectedAddOns.length > 0 && (
                      <p className="text-[9px] text-[#DBA111]/70 mt-1">
                        + {item.selectedAddOns.map(a => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-medium text-gold-500 shrink-0">
                    ${(item.totalUnitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 text-xs space-y-1.5">
            <div className="flex justify-between text-white/40">
              <span>Subtotal</span>
              <span className="font-mono">${order.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-white/40">
              <span>Fast-Delivery Fee</span>
              <span className="font-mono">{order.deliveryCharge === 0 ? 'FREE' : `$${order.deliveryCharge.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between text-white/40">
              <span>Sales Tax</span>
              <span className="font-mono">${order.tax.toFixed(2)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-green-400 font-bold bg-green-500/5 p-1 rounded border border-green-500/25">
                <span>Applied Coupon Discount</span>
                <span className="font-mono">-${order.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-black text-white text-sm border-t border-white/10 pt-2.5">
              <span>Paid Total</span>
              <span className="font-mono text-gold-500 text-[15px] font-black">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Place a new food order floating prompt */}
      <div className="text-center mt-12 mb-8">
        <button
          onClick={onPlaceNewOrder}
          className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-sm rounded-2xl cursor-pointer shadow-lg shadow-gold-500/10 transition-all text-center flex items-center justify-center space-x-2 mx-auto"
        >
          <Sparkles className="w-4.5 h-4.5 text-black" fill="currentColor" />
          <span className="uppercase tracking-wider">Craving More? Order Again</span>
        </button>
      </div>

    </div>
  );
};
