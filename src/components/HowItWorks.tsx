import React from 'react';
import { Utensils, CreditCard, Truck, Star, Quote } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-[#e7ded5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#e65100] mb-2">
            Seamless Dining Experience
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c140e] tracking-tight">
            How NaijaChop Works
          </h2>
          <p className="text-sm text-[#5d4d42] mt-2">
            Enjoy authentic firewood party jollof and sizzling native grills in 3 easy steps.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#ede4d8] text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e65100] text-white flex items-center justify-center mx-auto shadow-sm">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-[#e65100]">Step 01</div>
            <h3 className="text-base font-bold text-[#1c140e]">Pick & Customize</h3>
            <p className="text-xs text-[#5d4d42] leading-relaxed">
              Browse our authentic Nigerian menu or ask our AI chatbot. Select your preferred protein, spice heat, and tasty plantain dodo.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#ede4d8] text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#008751] text-white flex items-center justify-center mx-auto shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-[#008751]">Step 02</div>
            <h3 className="text-base font-bold text-[#1c140e]">Secure Online Pay</h3>
            <p className="text-xs text-[#5d4d42] leading-relaxed">
              Pay via Paystack or Flutterwave using your Debit Card, Instant Bank Transfer, or USSD. Receive instant verified receipt.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#ede4d8] text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1c140e] text-white flex items-center justify-center mx-auto shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-neutral-600">Step 03</div>
            <h3 className="text-base font-bold text-[#1c140e]">Fast Thermal Dispatch</h3>
            <p className="text-xs text-[#5d4d42] leading-relaxed">
              Track your motorcycle rider in real-time. Your meal arrives piping hot and fresh at your door within 35 to 45 minutes.
            </p>
          </div>
        </div>

        {/* Customer Reviews & Social Proof */}
        <div className="mt-16 pt-12 border-t border-[#ede4d8]">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-[#1c140e]">What Nigerians Are Saying</h3>
            <p className="text-xs text-neutral-500">Real feedback from verified foodies across Lagos and Abuja</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-[#ede4d8] bg-[#faf7f2] space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#1c140e] italic leading-relaxed">
                "The party jollof has that authentic firewood party aroma! The grilled peppered chicken was juicy and well-seasoned. Delivered to Lekki in 32 minutes."
              </p>
              <div className="text-xs font-bold text-[#1c140e]">
                Dr. Femi Adeleke <span className="font-normal text-neutral-500">· Lekki Phase 1, Lagos</span>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#ede4d8] bg-[#faf7f2] space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#1c140e] italic leading-relaxed">
                "Their Egusi soup with pounded yam reminds me of my grandmother's cooking. Packed with stockfish and beef. Ordering through the chatbot was remarkably smooth."
              </p>
              <div className="text-xs font-bold text-[#1c140e]">
                Amina Bello <span className="font-normal text-neutral-500">· Wuse 2, Abuja</span>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#ede4d8] bg-[#faf7f2] space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#1c140e] italic leading-relaxed">
                "The beef suya is top-tier Kano style. Generous yaji pepper, fresh onions, and tomatoes. The Paystack payment was instant and the receipt printed cleanly."
              </p>
              <div className="text-xs font-bold text-[#1c140e]">
                Chukwuma Nnamdi <span className="font-normal text-neutral-500">· Victoria Island, Lagos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
