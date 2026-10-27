import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#1c140e] text-[#fbf7f2] border-t border-[#3e2e22]">
      {/* Newsletter Section */}
      <div className="border-b border-[#2e2117] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Join the NaijaChop Foodie Club</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Receive exclusive Sunday feast discount codes, secret menu alerts, and free delivery vouchers.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="px-4 py-2.5 text-xs rounded-lg bg-[#2e2117] text-white border border-[#4a3627] placeholder:text-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-[#e65100] w-full sm:w-72"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e65100] hover:bg-[#c94500] text-white text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="text-xl font-extrabold tracking-tight">
            <span className="text-[#e65100]">Naija</span>
            <span className="text-[#008751]">Chop</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Nigeria's premier culinary delivery destination. Serving authentic firewood party jollof, rich native swallows, coal-charred beef suya, and ice-cold Nigerian drinks.
          </p>
          <div className="text-neutral-400 pt-1">
            <strong>Operating Hours: </strong><br />
            Monday – Sunday: 9:00 AM – 11:00 PM (Daily)
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <div className="font-bold uppercase tracking-wider text-[#ffb74d] text-[11px]">
            Explore Menu
          </div>
          <ul className="space-y-1.5 text-neutral-400">
            <li><a href="#menu-section" className="hover:text-white transition-colors">Party Jollof & Fried Rice</a></li>
            <li><a href="#menu-section" className="hover:text-white transition-colors">Egusi, Afang & Efo Riro</a></li>
            <li><a href="#menu-section" className="hover:text-white transition-colors">Northern Beef Suya & Grills</a></li>
            <li><a href="#menu-section" className="hover:text-white transition-colors">Lagos Small Chops & Dodo</a></li>
            <li><a href="#menu-section" className="hover:text-white transition-colors">Chilled Zobo & Chapman</a></li>
          </ul>
        </div>

        {/* Delivery Hubs */}
        <div className="space-y-2">
          <div className="font-bold uppercase tracking-wider text-[#ffb74d] text-[11px]">
            Delivery Hubs
          </div>
          <ul className="space-y-1.5 text-neutral-400">
            <li>Lagos Island: VI, Ikoyi, Lekki Phase 1, Ajah</li>
            <li>Lagos Mainland: Ikeja, Yaba, Surulere, Gbagada</li>
            <li>Abuja FCT: Wuse 2, Maitama, Jabi, Garki</li>
            <li>Rivers State: Port Harcourt GRA & Stadium</li>
            <li>Oyo State: Ibadan (Bodija, Ring Road)</li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div className="space-y-3">
          <div className="font-bold uppercase tracking-wider text-[#ffb74d] text-[11px]">
            Dispatch & Support
          </div>
          <div className="space-y-2 text-neutral-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#e65100] shrink-0 mt-0.5" />
              <span>14 Adeola Odeku Street, Victoria Island, Lagos</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#008751] shrink-0" />
              <span>+234 800 NAIJACHOP (0800 6245 22467)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0277bd] shrink-0" />
              <span>orders@naijachop.ng</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="inline-block px-2.5 py-1 rounded bg-[#2e2117] text-[10px] text-neutral-300 border border-[#4a3627]">
              🛡️ Paystack & Flutterwave 256-bit SSL Protected
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-[#2e2117] text-[11px] text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © 2026 NaijaChop Foods Limited. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security & Refunds</span>
        </div>
      </div>
    </footer>
  );
};
