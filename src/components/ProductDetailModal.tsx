import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  X,
  Boxes,
  Building2,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Zap,
  Package,
  Layers,
  ArrowRight,
  AlertTriangle,
  PlusCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { getProductGallery, getProductImage } from '../utils/productImages';

interface ProductDetailModalProps {
  sku: string | null;
  onClose: () => void;
  onSelectReorder?: (sku: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  sku,
  onClose,
  onSelectReorder,
}) => {
  const { products, inventory, warehouses, createNewOrder, setIsNewOrderModalOpen, setCurrentView } = useWarehouse();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState(false);

  if (!sku) return null;

  const product = products.find((p) => p.sku === sku) || {
    sku,
    name: sku.startsWith('SKU-MOB')
      ? 'Ultra-Flagship Smart Device'
      : sku.startsWith('SKU-72')
      ? 'Luxury Handcrafted Footwear Collection'
      : sku.startsWith('SKU-70')
      ? 'Heritage Handloom Silk Saree'
      : 'Specialty Inventory Component',
    category: sku.startsWith('SKU-MOB')
      ? 'Mobiles & Tablets'
      : sku.startsWith('SKU-72')
      ? 'Shoes & Footwear'
      : sku.startsWith('SKU-70')
      ? 'Fashion & Sarees'
      : 'General Inventory',
    unitPrice: 18500,
    weightKg: 1.2,
    minThreshold: 15,
    reorderPoint: 30,
    leadTimeDays: 3,
    supplier: 'National Tier-1 Apex Fulfillment',
    imageUrl: getProductImage(sku),
  };

  const gallery = getProductGallery(sku);
  const currentImage = gallery[activeImageIndex] || gallery[0];

  // Multi-warehouse stock breakdown
  const hubStocks = inventory.filter((i) => i.sku === sku);
  const totalOnHand = hubStocks.reduce((sum, i) => sum + i.onHand, 0);
  const totalReserved = hubStocks.reduce((sum, i) => sum + i.reserved, 0);
  const totalAvailable = hubStocks.reduce((sum, i) => sum + i.available, 0);
  const totalDamaged = hubStocks.reduce((sum, i) => sum + i.damaged, 0);

  const handleSimulateInstantOrder = () => {
    createNewOrder({
      customerName: 'Pooja Iyer (VIP Haute Couture)',
      customerType: 'VIP',
      customerPhone: '+91 98201 88472',
      customerEmail: 'pooja.iyer@iyercouture.com',
      destinationCity: 'Mumbai',
      destinationState: 'Maharashtra',
      channel: 'Tata Neu',
      deliveryAddress: 'Pali Hill, Bandra West, Mumbai 400050',
      priorityLevel: 'CRITICAL',
      deliverySpeed: 'EXPRESS_SAME_DAY',
      slaHours: 4,
      items: [
        {
          sku: product.sku,
          productName: product.name,
          quantity: 1,
          unitPrice: product.unitPrice,
        },
      ],
      requiresGiftWrap: true,
      customNote: 'Handle with utmost white-glove care. High-value customer inspection.',
    });
    setOrderCreatedSuccess(true);
    setTimeout(() => {
      setOrderCreatedSuccess(false);
      onClose();
      setCurrentView('orders');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        id="product-detail-modal"
        className="bg-white rounded-3xl border border-[#12372A]/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative"
      >
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E5EEE5] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#12372A] text-white font-mono font-bold text-xs">
              {product.sku}
            </span>
            <div>
              <h3 className="font-bold text-[#12372A] text-base sm:text-lg leading-tight">{product.name}</h3>
              <span className="text-xs text-[#202923]/60 font-medium">Department: {product.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F7F5EF] hover:bg-[#E5EEE5] text-[#12372A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Visual & Gallery Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Interactive Multi-Angle Gallery */}
            <div className="md:col-span-7 space-y-3">
              {/* Primary Large Image Frame */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-900 border border-[#12372A]/15 shadow-md group">
                <img
                  src={currentImage.url}
                  alt={currentImage.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Angle Overlay Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#A7D46F]" />
                  {currentImage.label}
                </div>

                {/* Navigation Arrows */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#12372A] shadow-md transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#12372A] shadow-md transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[11px]">
                  {activeImageIndex + 1} / {gallery.length} Angles
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-[#12372A] scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Technical Specifications & Stock Snapshot */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#12372A]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-mono text-[#202923]/60">Unit Price</span>
                  <span className="text-xl font-bold font-mono text-[#12372A]">
                    ₹{product.unitPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#12372A]/10">
                  <div>
                    <span className="text-[#202923]/60 block text-[10px] uppercase font-mono">Weight</span>
                    <span className="font-bold text-[#12372A]">{product.weightKg} kg / unit</span>
                  </div>
                  <div>
                    <span className="text-[#202923]/60 block text-[10px] uppercase font-mono">Lead Time</span>
                    <span className="font-bold text-[#12372A]">{product.leadTimeDays} Days Refill</span>
                  </div>
                  <div>
                    <span className="text-[#202923]/60 block text-[10px] uppercase font-mono">Min Threshold</span>
                    <span className="font-bold text-[#12372A]">{product.minThreshold} units</span>
                  </div>
                  <div>
                    <span className="text-[#202923]/60 block text-[10px] uppercase font-mono">Reorder Point</span>
                    <span className="font-bold text-[#12372A]">{product.reorderPoint} units</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#12372A]/10 text-xs">
                  <span className="text-[#202923]/60 block text-[10px] uppercase font-mono">Verified Supplier</span>
                  <span className="font-bold text-[#12372A]">{product.supplier}</span>
                </div>
              </div>

              {/* National Inventory Status */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5EEE5] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase font-mono text-[#12372A]">National Stock Summary</h4>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#E5EEE5] text-[#1E8E63]">
                    {totalAvailable} Available
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#F7F5EF] p-2 rounded-xl">
                    <span className="text-[10px] text-[#202923]/60 block font-mono">On Hand</span>
                    <span className="font-bold text-[#12372A] font-mono text-sm">{totalOnHand}</span>
                  </div>
                  <div className="bg-[#F7F5EF] p-2 rounded-xl">
                    <span className="text-[10px] text-[#202923]/60 block font-mono">Reserved</span>
                    <span className="font-bold text-[#F3B562] font-mono text-sm">{totalReserved}</span>
                  </div>
                  <div className="bg-[#F7F5EF] p-2 rounded-xl">
                    <span className="text-[10px] text-[#202923]/60 block font-mono">Damaged</span>
                    <span className="font-bold text-[#F26B5B] font-mono text-sm">{totalDamaged}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSimulateInstantOrder}
                  disabled={orderCreatedSuccess}
                  className="w-full py-3 px-4 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-[#A7D46F] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  {orderCreatedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Order Created! Routing to Floor...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Simulate 1-Click Priority Dispatch
                    </>
                  )}
                </button>

                {onSelectReorder && (
                  <button
                    onClick={() => {
                      onClose();
                      onSelectReorder(product.sku);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#F7F5EF] hover:bg-[#E5EEE5] text-[#12372A] font-bold text-xs flex items-center justify-center gap-2 border border-[#12372A]/10 transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#1E8E63]" />
                    Trigger Stock Replenishment PO
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Regional Hubs Allocation Breakdown */}
          <div className="bg-[#F7F5EF]/60 p-5 rounded-2xl border border-[#E5EEE5] space-y-3">
            <h4 className="font-bold text-xs uppercase font-mono text-[#12372A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E8E63]" />
              Real-Time Distribution Across 6 National Hubs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {warehouses.map((wh) => {
                const stock = hubStocks.find((s) => s.warehouseId === wh.id);
                const avail = stock ? stock.available : 0;
                const bin = stock ? stock.binLocation : 'Zone A-01';

                return (
                  <div
                    key={wh.id}
                    className="bg-white p-3 rounded-xl border border-[#E5EEE5] flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-[#12372A]">{wh.city}</div>
                      <div className="text-[10px] text-[#202923]/60 font-mono">Bin: {bin}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                          avail > 5
                            ? 'bg-[#E5EEE5] text-[#1E8E63]'
                            : avail > 0
                            ? 'bg-[#F3B562]/20 text-[#12372A]'
                            : 'bg-[#F26B5B]/15 text-[#F26B5B]'
                        }`}
                      >
                        {avail} in stock
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
