import React from 'react';
import { ArrowRight, Clock, Award, ShieldCheck, Flame } from 'lucide-react';
import { HERO_IMAGE } from '../data/sampleFoods';

interface HeroProps {
  onOrderNow: () => void;
  onExploreSpecials: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onExploreSpecials }) => {
  return (
    <section className="relative bg-[#faf7f2] border-b border-[#e7ded5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Split Hero Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fff3e0] border border-[#ffe0b2] text-[#c94500] rounded-full text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#e65100]" />
              <span>Authentic Lagos Firewood Flavors</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c140e] leading-[1.15]" style={{ textWrap: 'balance' }}>
              Taste the Soul of Nigeria, Delivered Hot & Fresh.
            </h1>

            <p className="text-base sm:text-lg text-[#5d4d42] leading-relaxed max-w-xl">
              From smoky party jollof with peppered chicken to rich egusi soup with pounded yam and sizzling beef suya. Handcrafted by master Nigerian chefs, delivered directly to your home or office.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOrderNow}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#e65100] hover:bg-[#c94500] text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSpecials}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#f5ede2] text-[#1c140e] text-sm font-semibold rounded-lg border border-[#d6c7b8] transition-colors cursor-pointer"
              >
                <span>Today's Specials</span>
              </button>
            </div>

            {/* Quick Delivery Badges */}
            <div className="flex items-center gap-6 pt-4 text-xs text-neutral-600 border-t border-[#ede4d8]">
              <div>
                <span className="font-bold text-[#1c140e]">Coverage: </span>
                <span>Lagos · Abuja · Port Harcourt · Ibadan</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-[#1c140e]">Avg Time: </span>
                <span>35-45 mins</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-16/10 lg:aspect-4/3 group">
              <img
                src={HERO_IMAGE}
                alt="Authentic Nigerian Feast with Party Jollof, Egusi Soup, and Beef Suya"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#ffe0b2] font-semibold">Chef's Signature</p>
                    <p className="text-base sm:text-lg font-bold">Party Jollof Feast & Grills</p>
                  </div>
                  <span className="bg-[#e65100] text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                    From ₦4,500
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Metric Adjacency Strip */}
        <div className="mt-12 pt-8 border-t border-[#e7ded5] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#fff3e0] text-[#e65100]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1c140e]">35 Min Fast Dispatch</div>
              <div className="text-xs text-[#736357]">Hot thermal bag delivery</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#e8f5e9] text-[#008751]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1c140e]">100% Authentic Recipes</div>
              <div className="text-xs text-[#736357]">Native spices & locust beans</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#e3f2fd] text-[#0277bd]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1c140e]">Paystack Verified</div>
              <div className="text-xs text-[#736357]">Card, USSD & Instant Transfer</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#fce4ec] text-[#c2185b]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1c140e]">Instant Receipts</div>
              <div className="text-xs text-[#736357]">Printable & verified tracking</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
