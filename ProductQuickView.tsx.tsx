import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Share2,
  Package
} from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const isOutOfStock = !product.inStock || product.stockCount === 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="quick-view-modal"
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row"
      >
        {/* Close button */}
        <button
          id="close-quickview-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100">
          <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200/80">
            <SafeImage
              src={product.image}
              alt={product.title}
              aspectRatio="aspect-square"
              fallbackCategory={product.category}
            />
          </div>

          <div className="mt-4 flex items-center justify-between w-full max-w-xs text-xs text-slate-500">
            <span className="font-mono bg-slate-200/80 px-2 py-0.5 rounded">SKU: {product.sku}</span>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Product'}</span>
            </button>
          </div>
        </div>

        {/* Right: Info & Specs */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Department and Brand */}
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>{product.brand}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{product.category}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">
              {product.title}
            </h2>

            {/* Ratings & Reviews */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold text-slate-900 ml-1">{product.rating}</span>
              </div>
              <span className="text-slate-400 text-sm">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline space-x-3 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-black text-slate-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>
              )}
              {product.discountPercent && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* Features list */}
            {product.features && product.features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Key Specifications:
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-100">
            {/* Stock status */}
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-slate-700">Availability:</span>
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">Currently Out of Stock</span>
              ) : (
                <span className="text-emerald-600 font-bold">
                  In Stock ({product.stockCount} available)
                </span>
              )}
            </div>

            {/* Add to cart row */}
            <div className="flex items-center space-x-3">
              {!isOutOfStock && (
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer shadow-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stockCount, qty + 1))}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer shadow-xs"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                id="quickview-add-cart-btn"
                disabled={isOutOfStock}
                onClick={() => {
                  onAddToCart(product, qty);
                  onClose();
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : `Add ${qty} to Cart • $${product.price * qty}`}</span>
              </button>

              <button
                id="quickview-wishlist-btn"
                onClick={() => onToggleWishlist(product)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted 
                    ? 'border-rose-300 bg-rose-50 text-rose-600' 
                    : 'border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Micro guarantees */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-3.5 h-3.5 text-indigo-600 mb-0.5" />
                <span>Fast 2-Day Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600 mb-0.5" />
                <span>30-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 mb-0.5" />
                <span>100% Genuine Item</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
