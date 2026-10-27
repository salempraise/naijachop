import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { CartItem, DeliveryZone, DiscountCode } from '../types';
import { DELIVERY_ZONES, DISCOUNT_CODES } from '../data/sampleFoods';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  appliedDiscount: DiscountCode | null;
  onApplyDiscount: (code: string) => { success: boolean; message: string };
  onRemoveDiscount: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  selectedCity,
  onSelectCity,
  appliedDiscount,
  onApplyDiscount,
  onRemoveDiscount,
  onProceedToCheckout,
}) => {
  const [discountInput, setDiscountInput] = useState('');
  const [discountFeedback, setDiscountFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find delivery zone
  const currentZone = DELIVERY_ZONES.find((z) => z.city === selectedCity) || DELIVERY_ZONES[0];
  const deliveryFee = currentZone.fee;

  // Subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedDiscount) {
    if (subtotal >= appliedDiscount.minOrder) {
      const calculated = (subtotal * appliedDiscount.percentage) / 100;
      discountAmount = Math.min(calculated, appliedDiscount.maxDiscount);
    }
  }

  const finalTotal = Math.max(0, subtotal + (cartItems.length > 0 ? deliveryFee : 0) - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountInput.trim()) return;
    const res = onApplyDiscount(discountInput.trim().toUpperCase());
    setDiscountFeedback(res.message);
    if (res.success) {
      setDiscountInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e7ded5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#e7ded5] flex items-center justify-between bg-[#faf7f2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#e65100]" />
              <h2 className="text-base font-extrabold text-[#1c140e]">Your Food Tray</h2>
              <span className="text-xs font-semibold text-neutral-500 tabular-nums">
                ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <div className="w-16 h-16 rounded-full bg-[#faf7f2] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-[#d6c7b8]" />
                </div>
                <p className="text-sm font-bold text-[#1c140e]">Your tray is hungry!</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Browse our authentic party jollof, egusi soups, and suya grills to start your feast.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-[#e65100] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Explore Dishes
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-[#e7ded5] bg-[#faf7f2]/50 hover:bg-[#faf7f2] transition-colors"
                >
                  <img
                    src={item.foodItem.image}
                    alt={item.foodItem.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#1c140e] truncate">{item.foodItem.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Protein & Extras Details */}
                    {item.selectedProtein && (
                      <div className="text-[11px] text-[#736357] truncate mt-0.5">
                        Meat: {item.selectedProtein.name}
                      </div>
                    )}
                    {item.selectedExtras.length > 0 && (
                      <div className="text-[11px] text-[#736357] truncate">
                        Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-[10px] text-neutral-500 italic truncate">{item.notes}</div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#ede4d8]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#d6c7b8] rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-extrabold text-[#1c140e] tabular-nums">
                        ₦{item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Calculations */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#e7ded5] bg-white space-y-4">
              {/* Delivery Zone Selector */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Delivery Destination
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] font-semibold text-[#1c140e] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
                >
                  {DELIVERY_ZONES.map((zone) => (
                    <option key={zone.city} value={zone.city}>
                      {zone.city} (₦{zone.fee.toLocaleString()}) · ~{zone.estimatedMinutes}m
                    </option>
                  ))}
                </select>
              </div>

              {/* Coupon Code Input */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. NAIJA10)"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#d6c7b8] uppercase font-mono tracking-wider focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-bold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {discountFeedback && (
                  <div className="text-[11px] text-neutral-600 mt-1">{discountFeedback}</div>
                )}

                {appliedDiscount && (
                  <div className="flex items-center justify-between text-xs text-[#008751] font-semibold mt-1.5 bg-[#e8f5e9] p-1.5 rounded-md">
                    <span>
                      Coupon <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.percentage}% off)
                    </span>
                    <button
                      onClick={onRemoveDiscount}
                      className="text-red-500 hover:underline text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-[#ede4d8] text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Dishes Subtotal</span>
                  <span className="tabular-nums font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery ({currentZone.city.split('/')[0]})</span>
                  <span className="tabular-nums font-semibold">₦{deliveryFee.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#008751] font-semibold">
                    <span>Promo Discount</span>
                    <span className="tabular-nums">-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#1c140e] pt-2 border-t border-[#ede4d8]">
                  <span>Total Amount</span>
                  <div className="text-right">
                    <div className="tabular-nums text-[#e65100]">₦{finalTotal.toLocaleString()}</div>
                    <div className="text-[10px] text-neutral-400 font-normal">
                      ({(finalTotal * 100).toLocaleString()} Kobo)
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#e65100] hover:bg-[#c94500] text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" />
                <span>Protected by Paystack & Flutterwave 256-bit encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
