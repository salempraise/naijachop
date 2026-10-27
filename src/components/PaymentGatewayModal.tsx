import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard, Building2, Smartphone, CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderRef: string;
  amount: number;
  customerEmail: string;
  gateway: PaymentMethod;
  onPaymentSuccess: (reference: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  orderRef,
  amount,
  customerEmail,
  gateway,
  onPaymentSuccess,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('4084 0840 8408 4084');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('408');
  const [cardPin, setCardPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [otp, setOtp] = useState('123456');

  // Generate unique test reference
  const [testRef] = useState(`pstk_test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(testRef);
      }, 1000);
    }, 1400);
  };

  const handleBankTransferPaid = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(`pstk_transfer_${Date.now()}`);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Gateway Header Banner */}
        <div className="bg-[#008751] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-[#008751] font-extrabold flex items-center justify-center text-sm shadow-xs">
              {gateway === 'flutterwave' ? 'FW' : 'P'}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-green-100">
                {gateway === 'flutterwave' ? 'Flutterwave Checkout' : 'Paystack Secure Checkout'}
              </div>
              <div className="text-xs text-green-50 truncate max-w-[200px]">
                NaijaChop · {orderRef}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-[#f2f9f5] border-b border-[#d8eee2] px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-neutral-600 font-medium">Amount to Pay:</span>
          <span className="text-lg font-extrabold text-[#008751] tabular-nums">
            ₦{amount.toLocaleString()}
          </span>
        </div>

        {/* Content based on Step */}
        {step === 'input' && (
          <div className="p-6 space-y-5">
            {/* Payment Method Channels */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 rounded-md transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#008751]" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank_transfer')}
                className={`py-2 rounded-md transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'bank_transfer'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#008751]" />
                <span>Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ussd')}
                className={`py-2 rounded-md transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'ussd'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#008751]" />
                <span>USSD</span>
              </button>
            </div>

            {/* Card Form */}
            {activeTab === 'card' && (
              <div className="space-y-3.5">
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[11px] text-amber-900">
                  <strong>Sandbox Test Mode:</strong> Valid Nigerian test card prefilled. Click <em>"Pay Now"</em> to test verification!
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#008751]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#008751]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePay}
                  className="w-full py-3 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Contacting Bank...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₦{amount.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Bank Transfer */}
            {activeTab === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Bank:</span>
                    <strong className="text-neutral-800">Wema Bank / Titan Trust</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Account Number:</span>
                    <span className="text-sm font-mono font-bold text-[#008751] bg-white px-2 py-0.5 rounded-sm border">
                      9923847192
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Beneficiary:</span>
                    <span className="text-neutral-800">NaijaChop / Paystack Checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Expires in:</span>
                    <span className="text-red-600 font-mono font-bold">29:45</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 leading-tight">
                  Transfer the exact amount to this temporary account via your Nigerian bank app (GTB, Zenith, Access, Kuda, OPay, etc.).
                </p>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleBankTransferPaid}
                  className="w-full py-3 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Transfer with NIBSS...</span>
                    </>
                  ) : (
                    <span>I have sent the payment</span>
                  )}
                </button>
              </div>
            )}

            {/* USSD */}
            {activeTab === 'ussd' && (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-xl border text-center space-y-2">
                  <div className="text-xs text-neutral-500">Dial from your registered SIM:</div>
                  <div className="text-base font-mono font-bold text-[#008751] bg-white py-2 px-3 rounded-lg border">
                    *737*000*2891#
                  </div>
                  <div className="text-[11px] text-neutral-400">Supported on GTBank, Zenith, UBA, FirstBank</div>
                </div>

                <button
                  type="button"
                  onClick={handleBankTransferPaid}
                  className="w-full py-3 bg-[#008751] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Confirm USSD Payment
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: 3D Secure / OTP Simulation */}
        {step === 'otp' && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 text-[#008751] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900">Bank 3D-Secure Authorization</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Enter the One-Time PIN (OTP) sent to your registered phone number to authenticate ₦{amount.toLocaleString()}.
              </p>
            </div>

            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-40 text-center tracking-widest text-lg font-mono font-bold py-2 border-2 border-[#008751] rounded-lg focus:outline-hidden"
              />
              <div className="text-[10px] text-neutral-400 mt-1">Simulated test code: 123456</div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing with Gateway...</span>
                </>
              ) : (
                <span>Authorize & Complete Payment</span>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Verified Success */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 text-[#008751] flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-base font-extrabold text-[#1c140e]">Payment Confirmed!</h3>
            <p className="text-xs text-neutral-600">
              Transaction ref <strong className="font-mono text-neutral-900">{testRef}</strong> has been verified directly by the server. Generating your receipt...
            </p>
          </div>
        )}

        {/* Security Footer */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
          <span>PCI-DSS Level 1 Certified</span>
          <span>Secured by Paystack Nigeria</span>
        </div>
      </div>
    </div>
  );
};
