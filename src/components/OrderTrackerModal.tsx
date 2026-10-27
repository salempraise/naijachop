import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, Truck, ChefHat, Package, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderRef?: string;
  onViewReceipt: (order: Order) => void;
}

const ORDER_STEPS: OrderStatus[] = [
  'Pending Payment',
  'Payment Confirmed',
  'Order Accepted',
  'Preparing Food',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered',
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderRef,
  onViewReceipt,
}) => {
  if (!isOpen) return null;

  const [searchRef, setSearchRef] = useState(initialOrderRef || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (initialOrderRef) {
      return orders.find((o) => o.orderRef.toLowerCase() === initialOrderRef.toLowerCase()) || null;
    }
    return orders.length > 0 ? orders[0] : null;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const found = orders.find(
      (o) => o.orderRef.toLowerCase() === searchRef.trim().toLowerCase()
    );
    if (found) {
      setActiveOrder(found);
    } else {
      setErrorMessage(`No order found matching "${searchRef}". Please check your receipt reference.`);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return ORDER_STEPS.indexOf(status);
  };

  const currentStepIndex = activeOrder ? getStepIndex(activeOrder.orderStatus) : -1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e7ded5] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#e7ded5] bg-[#faf7f2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#e65100]" />
            <div>
              <h2 className="text-base font-extrabold text-[#1c140e]">Live Order Tracking</h2>
              <p className="text-[11px] text-[#736357]">Real-time Nigerian Kitchen & Dispatch Tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Ref Bar */}
        <div className="p-6 bg-[#fbf9f6] border-b border-[#ede4d8]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Enter order reference (e.g. NC-2026-8942)"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono rounded-lg border border-[#d6c7b8] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1c140e] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          {errorMessage && (
            <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Order Selector if multiple exist */}
          {orders.length > 1 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-neutral-500 shrink-0 font-medium">Recent Orders:</span>
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setActiveOrder(o);
                    setSearchRef(o.orderRef);
                    setErrorMessage(null);
                  }}
                  className={`px-2 py-0.5 rounded-sm border font-mono transition-colors shrink-0 cursor-pointer ${
                    activeOrder?.id === o.id
                      ? 'bg-[#e65100] text-white border-[#e65100]'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {o.orderRef}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tracker Content Body */}
        {activeOrder ? (
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* Status Summary Banner */}
            <div className="p-4 rounded-xl bg-[#fff8f2] border border-[#ffe0b2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#e65100]">
                  Current Status
                </div>
                <div className="text-lg font-black text-[#1c140e] flex items-center gap-2 mt-0.5">
                  <span>{activeOrder.orderStatus}</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#008751] animate-pulse" />
                </div>
                <div className="text-xs text-[#5d4d42] mt-0.5">
                  Destination: {activeOrder.deliveryAddress}, {activeOrder.city}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[11px] text-neutral-500">Estimated Arrival:</div>
                <div className="text-base font-extrabold text-[#008751] tabular-nums">
                  ~{activeOrder.estimatedDeliveryMinutes || 25} minutes
                </div>
                <button
                  onClick={() => onViewReceipt(activeOrder)}
                  className="mt-1 text-xs text-[#e65100] hover:underline font-semibold cursor-pointer block"
                >
                  View Verified Receipt →
                </button>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
                Order Milestones
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#ede4d8]">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} className="relative flex items-start gap-3">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-[#008751] border-[#008751] text-white'
                            : 'bg-white border-[#d6c7b8]'
                        } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                      >
                        {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div className="flex-1">
                        <div
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#e65100]'
                              : isCompleted
                              ? 'text-[#1c140e]'
                              : 'text-neutral-400'
                          }`}
                        >
                          {step}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {step === 'Payment Confirmed' && 'Verified with Paystack transaction ref'}
                          {step === 'Order Accepted' && 'NaijaChop Victoria Island kitchen initiated ticket'}
                          {step === 'Preparing Food' && 'Chef grilling protein & steaming hot jollof'}
                          {step === 'Ready for Pickup' && 'Sealed in insulated thermal delivery packaging'}
                          {step === 'Out for Delivery' && 'Rider on the road to your location'}
                          {step === 'Delivered' && 'Meal safely handed over. Enjoy your feast!'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Dispatch Driver Card */}
            <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#ede4d8] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1c140e] text-white flex items-center justify-center font-bold text-sm">
                  EO
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1c140e]">
                    Rider: {activeOrder.driverInfo?.name || 'Emeka Okoro'}
                  </div>
                  <div className="text-[11px] text-[#736357]">
                    {activeOrder.driverInfo?.vehicle || 'Bajaj Boxer Motorcycle'} · Plate:{' '}
                    {activeOrder.driverInfo?.plateNumber || 'LAG-492-XY'}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${activeOrder.driverInfo?.phone || '+2348031234567'}`}
                className="py-1.5 px-3 bg-white border border-[#d6c7b8] hover:bg-neutral-50 text-xs font-semibold text-[#1c140e] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#008751]" />
                <span>Call Driver</span>
              </a>
            </div>

            {/* Order Items Summary */}
            <div className="space-y-2 border-t border-[#ede4d8] pt-4 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Dishes in this Dispatch
              </div>
              {activeOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-neutral-700">
                  <span>
                    {item.quantity}x {item.foodItem.name}
                    {item.selectedProtein && ` (${item.selectedProtein.name})`}
                  </span>
                  <span className="tabular-nums font-semibold">₦{item.totalPrice.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-extrabold text-[#1c140e] pt-2 border-t border-[#ede4d8]">
                <span>Total Paid:</span>
                <span className="text-[#e65100] tabular-nums">₦{activeOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 text-xs">
            No active orders to track. Place an order or enter an order reference above.
          </div>
        )}
      </div>
    </div>
  );
};
