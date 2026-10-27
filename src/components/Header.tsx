import React, { useState } from 'react';
import { ShoppingBag, Search, User as UserIcon, Shield, Code, MapPin, Menu as MenuIcon, X } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenPhpXampp: () => void;
  onOpenTracker: () => void;
  currentUser: User | null;
  onLogout: () => void;
  selectedCity: string;
  onSelectCityClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenAdmin,
  onOpenPhpXampp,
  onOpenTracker,
  currentUser,
  onLogout,
  selectedCity,
  onSelectCityClick,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e7ded5] shadow-xs">
      {/* Top Banner Notice: Free Delivery Promotion & Location */}
      <div className="bg-[#1c140e] text-[#fbf7f2] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#008751]" />
            <span className="font-medium">Kitchen Live: Fresh Party Jollof & Grills Ready</span>
            <span className="hidden sm:inline text-neutral-400">· Use code <strong className="text-[#f57c00]">FIRSTCHOP</strong> for 15% off</span>
          </div>

          <button
            onClick={onSelectCityClick}
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#f57c00]" />
            <span className="underline decoration-dotted truncate max-w-[170px] sm:max-w-xs">{selectedCity}</span>
            <span className="text-[10px] text-neutral-400">Change</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand — 4-5 Nav Links — Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#1c140e]">
            <span className="text-[#e65100]">Naija</span>
            <span className="text-[#008751]">Chop</span>
            <span className="text-xs bg-[#e8f5e9] text-[#008751] font-semibold px-2 py-0.5 rounded-sm border border-[#c8e6c9]">
              🇳🇬 Naija Taste
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-700">
          <a href="#menu-section" className="hover:text-[#e65100] transition-colors whitespace-nowrap shrink-0">
            Menu
          </a>
          <a href="#specials-section" className="hover:text-[#e65100] transition-colors whitespace-nowrap shrink-0">
            Today's Specials
          </a>
          <a href="#how-it-works" className="hover:text-[#e65100] transition-colors whitespace-nowrap shrink-0">
            How It Works
          </a>
          <button
            onClick={onOpenTracker}
            className="hover:text-[#e65100] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Track Order
          </button>
          <button
            onClick={onOpenPhpXampp}
            className="flex items-center gap-1.5 text-neutral-700 hover:text-[#008751] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Code className="w-4 h-4 text-[#008751]" />
            <span>XAMPP / SQL Code</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          {showSearchInput ? (
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search jollof, egusi, suya..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-2 focus:ring-[#e65100]"
              />
              <button
                onClick={() => {
                  setShowSearchInput(false);
                  setSearchQuery('');
                }}
                className="absolute right-2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-2 text-neutral-600 hover:text-[#e65100] hover:bg-[#faf5ee] rounded-lg transition-colors cursor-pointer"
              title="Search dishes"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* User Account / Auth */}
          {currentUser ? (
            <div className="relative group">
              <button className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-[#e7ded5] bg-[#faf7f2] text-xs font-semibold text-[#1c140e] hover:bg-white cursor-pointer">
                <span className="w-6 h-6 rounded-full bg-[#e65100] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </span>
                <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#e7ded5] rounded-lg shadow-lg py-1.5 hidden group-hover:block z-50">
                <div className="px-3 py-1.5 text-xs text-neutral-500 border-b border-neutral-100">
                  {currentUser.email}
                </div>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={onOpenAdmin}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#e65100] hover:bg-[#faf5ee] cursor-pointer"
                  >
                    Admin Console
                  </button>
                )}
                <button
                  onClick={onOpenTracker}
                  className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-[#faf5ee] cursor-pointer"
                >
                  My Order Status
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-neutral-100 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3 text-xs font-semibold text-neutral-700 hover:text-[#e65100] transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Admin Direct Button */}
          <button
            onClick={onOpenAdmin}
            className="hidden md:flex items-center gap-1 py-1.5 px-2.5 rounded-md text-xs font-medium text-neutral-600 hover:text-[#1c140e] hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Open Admin Operations Console"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-500" />
            <span>Admin</span>
          </button>

          {/* Cart Primary CTA */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 py-2.5 px-4 bg-[#e65100] hover:bg-[#c94500] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Tray</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#e65100] text-[11px] font-extrabold tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-[#1c140e]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e7ded5] bg-white px-4 py-4 space-y-3">
          <a
            href="#menu-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-800 hover:text-[#e65100]"
          >
            Browse Menu
          </a>
          <a
            href="#specials-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-800 hover:text-[#e65100]"
          >
            Today's Specials
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-800 hover:text-[#e65100]"
          >
            How It Works
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracker();
            }}
            className="block w-full text-left py-2 text-sm font-medium text-neutral-800 hover:text-[#e65100]"
          >
            Track Existing Order
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPhpXampp();
            }}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-[#008751]"
          >
            <Code className="w-4 h-4" />
            <span>XAMPP / PHP / SQL Export Files</span>
          </button>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="text-sm font-bold text-[#e65100]"
              >
                Sign In / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-sm font-medium text-red-600"
              >
                Sign Out ({currentUser.name})
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-xs font-semibold text-neutral-500 underline"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
