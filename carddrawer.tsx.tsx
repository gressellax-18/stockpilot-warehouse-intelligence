import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { CartItem } from '../types';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  appliedDiscount: number;
  onApplyCoupon: (code: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  onApplyCoupon
}) => {
  const [couponInput, setCouponInput] = useState(discountCode || '');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const isFreeShipping = subtotal >= 50;
  const shipping = isFreeShipping || subtotal === 0 ? 0 : 4.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);
  const freeShipProgress = Math.min(100, (subtotal / 50) * 100);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.toUpperCase() === 'SAVE10') {
      onApplyCoupon('SAVE10');
      setCouponError('');
    } else if (couponInput.toUpperCase() === 'SUPER20' && subtotal >= 100) {
      onApplyCoupon('SUPER20');
      setCouponError('');
    } else {
      setCouponError('Invalid code. Try "SAVE10" for 10% off');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        id="cart-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Shopping Cart</h2>
              <p className="text-[11px] text-slate-500">{items.reduce((s, i) => s + i.quantity, 0)} items selected</p>
            </div>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-semibold">
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isFreeShipping ? '🎉 Free Standard Delivery Unlocked!' : `Add $${(50 - subtotal).toFixed(2)} more for Free Shipping`}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{Math.round(freeShipProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${freeShipProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Your cart is currently empty</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Browse our 8 departments, select items with verified photos, and add them to your cart.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-indigo-700 cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex space-x-3 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <SafeImage
                    src={item.product.image}
                    alt={item.product.title}
                    aspectRatio="aspect-square"
                    fallbackCategory={item.product.category}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.title}</h4>
                  <div className="text-[11px] text-slate-500 font-semibold mb-1">
                    ${item.product.price} each
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                      <button
                        onClick={() => onUpdateQty(item.product.id, -1)}
                        className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer shadow-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, 1)}
                        disabled={item.quantity >= item.product.stockCount}
                        className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer shadow-xs disabled:opacity-40"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            
            {/* Promo coupon input */}
            <form onSubmit={handleCouponSubmit} className="space-y-1">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (try SAVE10)"
                    className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs uppercase font-bold text-slate-900 outline-hidden focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {appliedDiscount > 0 && (
                <p className="text-[10px] text-emerald-600 font-bold flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Promo code active ({appliedDiscount}% discount applied)
                </p>
              )}
              {couponError && (
                <p className="text-[10px] text-rose-600 font-semibold">{couponError}</p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="text-xs space-y-1.5 border-t border-slate-200/80 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Standard Shipping:</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Due:</span>
                <span className="text-indigo-600 font-serif">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/30 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
