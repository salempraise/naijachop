import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, Shield, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        setErrorMessage('All registration fields are required.');
        return;
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: 'customer',
        savedAddresses: ['14 Adeola Odeku Street, Victoria Island, Lagos'],
      };

      setSuccessMessage('Account registered successfully! Welcome to NaijaChop.');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 700);
    } else {
      // Login
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both your email and password.');
        return;
      }

      // Check if Admin
      if (email.trim().toLowerCase() === 'admin@naijachop.ng') {
        const adminUser: User = {
          id: 'admin_1',
          name: 'Naija Operations Lead',
          email: 'admin@naijachop.ng',
          phone: '+234 800 NAIJACHOP',
          role: 'admin',
        };
        onLoginSuccess(adminUser);
        onClose();
        return;
      }

      // Customer
      const loggedUser: User = {
        id: `usr_demo`,
        name: name.trim() || 'Chidinma Adebayo',
        email: email.trim(),
        phone: phone.trim() || '+234 803 456 7890',
        role: 'customer',
        savedAddresses: ['14 Adeola Odeku Street, Victoria Island, Lagos'],
      };
      onLoginSuccess(loggedUser);
      onClose();
    }
  };

  const handleFillDemoCustomer = () => {
    setEmail('customer@naijachop.ng');
    setPassword('CustomerPass123!');
    setName('Chidinma Adebayo');
    setPhone('0803 456 7890');
    setMode('login');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@naijachop.ng');
    setPassword('NaijaAdmin2026!');
    setName('Operations Lead');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e7ded5] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="p-5 border-b border-[#e7ded5] bg-[#faf7f2] flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#1c140e]">
              {mode === 'login' ? 'Customer Sign In' : 'Create NaijaChop Account'}
            </h2>
            <p className="text-[11px] text-[#736357]">
              {mode === 'login' ? 'Access your orders & saved addresses' : 'Join thousands of Nigerian food lovers'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#ede4d8] bg-white">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'login'
                ? 'border-[#e65100] text-[#e65100]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'register'
                ? 'border-[#e65100] text-[#e65100]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-xs text-[#008751] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Fashola"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="0803 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#d6c7b8] bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#e65100]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#e65100] hover:bg-[#c94500] text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-98 cursor-pointer"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Create Account'}
          </button>

          {/* Quick Demo Fills */}
          <div className="pt-3 border-t border-[#ede4d8] text-center space-y-2">
            <span className="text-[11px] text-neutral-400">Quick Test Credentials:</span>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={handleFillDemoCustomer}
                className="py-1 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md text-[11px] font-semibold cursor-pointer"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="py-1 px-2.5 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#008751] rounded-md text-[11px] font-semibold cursor-pointer"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
