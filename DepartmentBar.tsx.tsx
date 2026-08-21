import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Printer, 
  ShoppingBag, 
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CompletedTransaction } from '../types';
import { SafeImage } from './SafeImage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedDiscount: number;
  onOrderCompleted: (tx: CompletedTransaction) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedDiscount,
  onOrderCompleted,
  onClearCart
}) => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [zipCode, setZipCode] = useState('97477');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedTransaction | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderTx: CompletedTransaction = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        type: 'order',
        title: `Store Order (${items.reduce((s, i) => s + i.quantity, 0)} Items)`,
        amount: total,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'Completed',
        details: {
          'Customer': fullName,
          'Shipping Address': `${address}, ${city} ${zipCode}`,
          'Payment Method': paymentMethod.toUpperCase(),
          'Delivery Method': 'Express 2-Day Shipping'
        },
        items: [...items]
      };

      onOrderCompleted(orderTx);
      setCompletedOrder(orderTx);
      onClearCart();
      setIsProcessing(false);

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        id="checkout-modal"
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {completedOrder ? (
          /* Order Confirmed Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Order Confirmed & Dispatched
            </span>

            <h2 className="text-2xl font-black text-slate-900 mt-2 mb-1">
              Thank You for Your Order!
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Order confirmation and tracking details sent to <strong className="text-slate-800">{email}</strong>
            </p>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-100 mb-6">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono text-indigo-600">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deliver To:</span>
                <span className="font-medium text-slate-800">{address}, {city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-extrabold text-slate-900">${completedOrder.amount.toFixed(2)}</span>
              </div>

              {/* Items preview list */}
              {completedOrder.items && (
                <div className="border-t border-slate-200 pt-2 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Purchased Items:</span>
                  {completedOrder.items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-slate-700">
                      <span className="truncate max-w-[240px]">{item.quantity}x {item.product.title}</span>
                      <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Fast 256-Bit SSL Checkout</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Complete Your Department Order
            </h2>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Shipping Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>1. Shipping Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">ZIP / Postal</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. Payment Option</span>
                </h3>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { id: 'card', label: 'Credit Card', icon: '💳' },
                    { id: 'upi', label: 'UPI / Digital', icon: '⚡' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base block mb-0.5">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono font-bold text-slate-900 outline-hidden"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Expiry</label>
                        <input
                          type="text"
                          defaultValue="08/29"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-slate-900 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">CVV</label>
                        <input
                          type="password"
                          defaultValue="889"
                          maxLength={4}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-slate-900 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Total & Submit */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Order Amount Total:</span>
                  <div className="text-xl font-black text-indigo-700">${total.toFixed(2)}</div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  id="checkout-submit-btn"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Order...</span>
                    </span>
                  ) : (
                    <>
                      <span>Pay & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
