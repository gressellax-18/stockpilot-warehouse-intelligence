import React from 'react';
import { 
  Star, 
  Heart, 
  Eye, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onUpdateCartQty?: (productId: string, delta: number) => void;
  cartQuantity?: number;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onUpdateCartQty,
  cartQuantity = 0,
  onQuickView,
  isWishlisted,
  onToggleWishlist
}) => {
  const isOutOfStock = !product.inStock || product.stockCount === 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.title}
          fallbackCategory={product.category}
          aspectRatio="aspect-square"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              ★ Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => onQuickView(product)}
            className="w-full py-1.5 px-3 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick View & Specs</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
            <span className="text-indigo-600 font-bold uppercase tracking-wider">{product.brand}</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
          >
            {product.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center space-x-1.5 mt-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold text-slate-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-[11px] text-slate-500">({product.reviewsCount} reviews)</span>
          </div>

          {/* Stock Level Indicator */}
          <div className="mb-3">
            {isOutOfStock ? (
              <span className="inline-flex items-center text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                <AlertCircle className="w-3 h-3 mr-1" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                Only {product.stockCount} left in stock
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <Check className="w-3 h-3 mr-1" />
                In Stock ({product.stockCount} units)
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>

          {/* Action button */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : cartQuantity > 0 ? (
              <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-xl p-0.5">
                <button
                  id={`cart-decrease-${product.id}`}
                  onClick={() => onUpdateCartQty && onUpdateCartQty(product.id, -1)}
                  className="w-7 h-7 rounded-lg bg-white text-indigo-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shadow-xs"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-indigo-900">
                  {cartQuantity}
                </span>
                <button
                  id={`cart-increase-${product.id}`}
                  onClick={() => onUpdateCartQty && onUpdateCartQty(product.id, 1)}
                  disabled={cartQuantity >= product.stockCount}
                  className="w-7 h-7 rounded-lg bg-white text-indigo-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shadow-xs disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id={`add-to-cart-btn-${product.id}`}
                onClick={() => onAddToCart(product)}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
