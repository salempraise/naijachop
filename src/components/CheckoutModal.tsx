import React, { useState } from 'react';
import { X, Lock, CreditCard, Building2, Smartphone, ShieldCheck, MapPin } from 'lucide-react';
import { CartItem, DeliveryZone, DiscountCode, PaymentMethod, User } from '../types';
import { DELIVERY_ZONES } from '../data/sampleFoods';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  selectedCity: string;
  appliedDiscount: DiscountCode | null;
  currentUser: User | null;
  onLaunchPayment: (orderData: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    notes: string;
    paymentMethod: PaymentMethod;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  selectedCity,
  appliedDiscount,
  currentUser,
  onLaunchPayment,
}) => {
  if (!isOpen) return null;

  const currentZone = DELIVERY_ZONES.find((z) => z.city === selectedCity) || DELIVERY_ZONES[0];
  const deliveryFee = currentZone.fee;
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  let discountAmount = 0;
  if (appliedDiscount && subtotal >= appliedDiscount.minOrder) {
    const calc = (subtotal * appliedDiscount.percentage) / 100;
    discountAmount = Math.min(calc, appliedDiscount.maxDiscount);
  }
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Form States
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.savedAddresses?.[0] || '');
  const [city, setCity] = useState(selectedCity);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setErrorMessage('Please fill in all required customer and delivery address fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address to receive your payment receipt.');
      return;
    }

    const zoneObj = DELIVERY_ZONES.find((z) => z.city === city) || currentZone;

    onLaunchPayment({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city,
      state: zoneObj.state,
      notes: notes.trim(),
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e7ded5] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#e7ded5] bg-[#faf7f2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#008751]" />
            <div>
              <h2 className="text-base font-extrabold text-[#1c140e]">Secure Nigerian Checkout</h2>
              <p className="text-[11px] text-[#736357]">
                Server-calculated total · Verified Paystack & Flutterwave Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#ede4d8] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
                1. Customer Contact Details
              </h3>
              <span className="text-[11px] text-[#e65100] font-medium">Receipt is sent to this email</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Fashola"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Phone Number (+234) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0803 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="babatunde@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
              />
            </div>
          </div>

          {/* Section 2: Delivery Location */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#ede4d8] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
                2. Delivery Destination
              </h3>
              <span className="text-[11px] text-neutral-500">Fast motorcycle courier dispatch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  City / Zone <span className="text-red-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] font-medium text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
                >
                  {DELIVERY_ZONES.map((zone) => (
                    <option key={zone.city} value={zone.city}>
                      {zone.city} — ₦{zone.fee.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  State
                </label>
                <input
                  type="text"
                  disabled
                  value={DELIVERY_ZONES.find((z) => z.city === city)?.state || 'Lagos State'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Street Address / House / Flat <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. 12B Admiralty Way, Lekki Phase 1, Opposite Filmhouse Cinema"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ring the bell at the white gate, call upon arrival"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
              />
            </div>
          </div>

          {/* Section 3: Payment Gateway Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#ede4d8] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c140e]">
                3. Nigerian Online Payment Method
              </h3>
              <span className="text-[11px] text-[#008751] font-semibold">Instant verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentMethod('paystack')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'paystack'
                    ? 'border-[#008751] bg-[#f0f9f4] shadow-xs'
                    : 'border-[#e7ded5] hover:bg-[#faf7f2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#008751] text-white flex items-center justify-center text-xs font-bold">
                      P
                    </div>
                    <span className="text-xs font-bold text-[#1c140e]">Paystack Checkout</span>
                  </div>
                  <span className="text-[10px] bg-[#e8f5e9] text-[#008751] font-bold px-1.5 py-0.5 rounded-sm">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-[#736357]">
                  Pay with Nigerian Card (Verve/Mastercard/Visa), Bank Transfer, or USSD.
                </p>
              </div>

              <div
                onClick={() => setPaymentMethod('flutterwave')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'flutterwave'
                    ? 'border-[#f57c00] bg-[#fff8f2] shadow-xs'
                    : 'border-[#e7ded5] hover:bg-[#faf7f2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#f57c00] text-white flex items-center justify-center text-xs font-bold">
                      F
                    </div>
                    <span className="text-xs font-bold text-[#1c140e]">Flutterwave</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#736357]">
                  Pay with Card, Mobile Money, Barter, or Direct Bank Account.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Strip */}
          <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#ede4d8] space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Items Total ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} meals)</span>
              <span className="tabular-nums font-semibold">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee ({city.split('/')[0]})</span>
              <span className="tabular-nums font-semibold">₦{deliveryFee.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#008751] font-semibold">
                <span>Discount Applied</span>
                <span className="tabular-nums">-₦{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-[#1c140e] pt-2 border-t border-[#d6c7b8]">
              <span>Amount Due</span>
              <span className="text-[#e65100] tabular-nums text-base">₦{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#008751] hover:bg-[#007043] text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Pay ₦{total.toLocaleString()} via {paymentMethod === 'paystack' ? 'Paystack' : 'Flutterwave'}</span>
            </button>
            <div className="text-center text-[11px] text-neutral-500 mt-2">
              You will be redirected to the secure payment modal to authenticate your transaction.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
