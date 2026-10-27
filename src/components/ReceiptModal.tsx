import React from 'react';
import { X, Printer, Download, CheckCircle, ExternalLink, MapPin, Truck } from 'lucide-react';
import { Order } from '../types';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderRef: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose, onTrackOrder }) => {
  if (!order) return null;

  const receiptNumber = `NC-RCP-2026-${order.orderRef.replace('NC-', '')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(order, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NaijaChop_Receipt_${order.orderRef}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e7ded5] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-[#faf7f2] border-b border-[#e7ded5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#008751]" />
            <span className="text-xs font-bold text-[#1c140e]">Payment Verified · Official Tax Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-white border border-[#d6c7b8] hover:bg-[#faf7f2] text-xs font-semibold text-[#1c140e] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="py-1.5 px-3 bg-white border border-[#d6c7b8] hover:bg-[#faf7f2] text-xs font-semibold text-[#1c140e] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-black rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-[#1c140e]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-[#1c140e] pb-6 gap-4">
            <div>
              <div className="text-2xl font-black tracking-tight text-[#e65100]">
                🇳🇬 NaijaChop Foods Ltd.
              </div>
              <p className="text-xs text-[#736357] mt-1 leading-relaxed">
                14 Adeola Odeku Street, Victoria Island, Lagos, Nigeria<br />
                RC: 1849204 · Tel: +234 800 NAIJACHOP · orders@naijachop.ng
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-2.5 py-1 rounded-sm bg-[#e8f5e9] text-[#008751] font-bold text-xs uppercase border border-[#c8e6c9]">
                ✓ Payment Confirmed
              </span>
              <div className="text-xs text-[#736357] mt-2">
                Receipt No: <strong className="font-mono text-[#1c140e]">{receiptNumber}</strong>
              </div>
              <div className="text-xs text-[#736357]">
                Order Ref: <strong className="font-mono text-[#1c140e]">{order.orderRef}</strong>
              </div>
              <div className="text-xs text-[#736357]">
                Date: {order.createdAt || 'October 27, 2026'}
              </div>
            </div>
          </div>

          {/* Customer & Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-[#faf7f2] border border-[#ede4d8] text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#736357]">
                Billed To (Customer)
              </div>
              <div className="text-sm font-bold text-[#1c140e] mt-1">{order.customerName}</div>
              <div className="text-[#5d4d42]">{order.phone}</div>
              <div className="text-[#5d4d42]">{order.email}</div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#736357]">
                Delivery Destination
              </div>
              <div className="text-sm font-bold text-[#1c140e] mt-1">{order.deliveryAddress}</div>
              <div className="text-[#5d4d42]">
                {order.city}, {order.state}
              </div>
              {order.deliveryNotes && (
                <div className="text-[11px] text-neutral-500 italic mt-0.5">
                  Note: {order.deliveryNotes}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-xs border-collapse my-6">
            <thead>
              <tr className="border-b border-[#ede4d8] text-[#736357] uppercase text-[10px]">
                <th className="py-2 text-left font-bold">Meal & Customization</th>
                <th className="py-2 text-center font-bold">Qty</th>
                <th className="py-2 text-right font-bold">Unit Price</th>
                <th className="py-2 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2eee8]">
              {order.items.map((item, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-2.5">
                    <div className="font-bold text-[#1c140e]">{item.foodItem.name}</div>
                    {item.selectedProtein && (
                      <div className="text-[11px] text-[#736357]">
                        Protein: {item.selectedProtein.name}
                      </div>
                    )}
                    {item.selectedExtras.length > 0 && (
                      <div className="text-[11px] text-[#736357]">
                        Sides: {item.selectedExtras.map((e) => e.name).join(', ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-[10px] text-neutral-400 italic">{item.notes}</div>
                    )}
                  </td>
                  <td className="py-2.5 text-center font-medium tabular-nums">{item.quantity}</td>
                  <td className="py-2.5 text-right tabular-nums">₦{item.unitPrice.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold tabular-nums">
                    ₦{item.totalPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Price Summary Calculation */}
          <div className="w-full sm:w-64 ml-auto space-y-1.5 pt-4 border-t border-[#ede4d8] text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Dishes Subtotal:</span>
              <span className="tabular-nums font-semibold">₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee:</span>
              <span className="tabular-nums font-semibold">₦{order.deliveryFee.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#008751] font-semibold">
                <span>Discount ({order.discountCode || 'PROMO'}):</span>
                <span className="tabular-nums">-₦{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-[#1c140e] pt-2 border-t-2 border-[#1c140e]">
              <span>Total Paid:</span>
              <span className="text-[#e65100] tabular-nums">₦{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment & Verification Audit Trail */}
          <div className="mt-8 pt-4 border-t border-dashed border-[#d6c7b8] text-[11px] text-[#736357] space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <strong>Payment Channel: </strong>
                <span className="uppercase">{order.paymentMethod} (Verified 256-bit Online)</span>
              </div>
              <div>
                <strong>Gateway Tx Ref: </strong>
                <span className="font-mono">{order.transactionRef || 'pstk_test_demo'}</span>
              </div>
            </div>
            <div>
              <strong>Dispatch Window: </strong>
              <span>Estimated delivery {order.estimatedDeliveryMinutes || 35} minutes from order acceptance.</span>
            </div>
            <div className="pt-2 text-center text-xs font-semibold text-[#008751]">
              E sé gán! Daalụ! Nagode! Thank you for choosing NaijaChop!
            </div>
          </div>
        </div>

        {/* Footer Actions (No Print) */}
        <div className="no-print p-4 bg-[#faf7f2] border-t border-[#e7ded5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onTrackOrder(order.orderRef)}
            className="w-full sm:w-auto py-2.5 px-4 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Progress Live</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 bg-white border border-[#d6c7b8] hover:bg-neutral-100 text-xs font-semibold text-neutral-700 rounded-lg cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
