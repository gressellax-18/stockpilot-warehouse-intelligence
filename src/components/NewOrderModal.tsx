import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { X, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, ShoppingCart, Zap, Smartphone, Mail, Store } from 'lucide-react';
import { CustomerType, ShippingMethod, OrderChannel } from '../types';

export const NewOrderModal: React.FC = () => {
  const {
    products,
    warehouses,
    inventory,
    placeOrder,
    isNewOrderModalOpen,
    setIsNewOrderModalOpen,
    setCurrentView,
  } = useWarehouse();

  const [customerName, setCustomerName] = useState('Tata Advanced Systems (Aerospace Div)');
  const [customerType, setCustomerType] = useState<CustomerType>('VIP');
  const [channel, setChannel] = useState<OrderChannel>('Amazon');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 12890');
  const [customerEmail, setCustomerEmail] = useState('procurement@tataadvanced.in');
  const [selectedSku, setSelectedSku] = useState('SKU-501');
  const [quantity, setQuantity] = useState<number>(12);
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('SAME_DAY');
  const [destinationCity, setDestinationCity] = useState('Hyderabad Tech Zone, Telangana');

  if (!isNewOrderModalOpen) return null;

  const selectedProduct = products.find((p) => p.sku === selectedSku) || products[0];

  // Check inventory availability across hubs for selected SKU
  const skuInventories = inventory.filter((inv) => inv.sku === selectedSku);
  const totalAvailableAcrossHubs = skuInventories.reduce((acc, curr) => acc + curr.available, 0);

  // Calculate projected priority preview
  let projectedScore = 30;
  if (customerType === 'VIP') projectedScore += 35;
  else if (customerType === 'ENTERPRISE') projectedScore += 25;
  if (shippingMethod === 'SAME_DAY') projectedScore += 25;
  else if (shippingMethod === 'EXPRESS') projectedScore += 15;
  if (quantity > 5) projectedScore += 10;
  projectedScore = Math.min(100, projectedScore);

  const handleSoapPreset = (sku: string, qty: number, cust: string, ch: OrderChannel, vip: boolean) => {
    setSelectedSku(sku);
    setQuantity(qty);
    setCustomerName(cust);
    setChannel(ch);
    setCustomerType(vip ? 'VIP' : 'REGULAR');
    setShippingMethod(vip ? 'SAME_DAY' : 'EXPRESS');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    placeOrder({
      customerName,
      customerType,
      channel,
      customerPhone,
      customerEmail,
      sku: selectedSku,
      quantity: Number(quantity),
      destinationCity,
      shippingMethod,
      preferredWarehouseId: warehouseId || undefined,
    });

    setIsNewOrderModalOpen(false);
    setCurrentView('orders');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5EEE5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E5EEE5] flex items-center justify-between bg-[#F7F5EF]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#12372A]">Place Real Order & Store in Database</h2>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#12372A] text-white">
                Live State Persistence
              </span>
            </div>
            <p className="text-xs text-[#202923]/70">
              Triggers live priority engine, real inventory deduction, automated picking queue, and carrier dispatch.
            </p>
          </div>
          <button
            onClick={() => setIsNewOrderModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-[#12372A]/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Soap Order Presets */}
        <div className="bg-[#E5EEE5]/40 px-6 py-2.5 border-b border-[#E5EEE5] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="font-bold text-[#12372A] flex items-center gap-1 whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-[#1E8E63]" /> Quick Soap Presets:
          </span>
          <button
            type="button"
            onClick={() => handleSoapPreset('SKU-501', 15, 'Taj Luxury Hotels & Spa', 'Enterprise EDI', true)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#12372A]/15 font-semibold text-[#12372A] hover:bg-[#12372A] hover:text-white transition whitespace-nowrap shadow-2xs"
          >
            🧼 Luxury Bathing Soap (Taj Hotels - VIP)
          </button>
          <button
            type="button"
            onClick={() => handleSoapPreset('SKU-502', 8, 'Apollo Wellness Clinics', 'Blinkit', false)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#12372A]/15 font-semibold text-[#12372A] hover:bg-[#12372A] hover:text-white transition whitespace-nowrap shadow-2xs"
          >
            🌿 Neem Antibacterial Soap (Blinkit)
          </button>
          <button
            type="button"
            onClick={() => handleSoapPreset('SKU-503', 25, 'Radisson Blu Suites', 'Amazon', true)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#12372A]/15 font-semibold text-[#12372A] hover:bg-[#12372A] hover:text-white transition whitespace-nowrap shadow-2xs"
          >
            👑 Shea Butter (Radisson - VIP Out-of-Stock Test)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Customer info & App / Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Customer Name</label>
              <input
                type="text"
                id="input-customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-medium"
                placeholder="e.g. Tata Advanced Systems / ISRO"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Ordering App / Channel</label>
              <select
                id="select-order-channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value as OrderChannel)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-bold text-[#12372A] bg-white"
              >
                <option value="Amazon">🛒 Amazon Marketplace</option>
                <option value="Flipkart">🛍️ Flipkart Quick</option>
                <option value="Blinkit">⚡ Blinkit (10-Min Delivery)</option>
                <option value="Zepto">🚀 Zepto Quick Commerce</option>
                <option value="Swiggy Instamart">🛵 Swiggy Instamart</option>
                <option value="Direct Web Store">🌐 Brand Direct Web Store</option>
                <option value="Enterprise EDI">💼 Enterprise EDI / SAP B2B</option>
                <option value="Myntra">👗 Myntra Express</option>
                <option value="Nykaa">💄 Nykaa Beauty & Personal Care</option>
              </select>
            </div>
          </div>

          {/* Customer Contact Details & Account Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#12372A] flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-[#1E8E63]" /> Phone Number
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-mono"
                placeholder="+91 98450 12890"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#12372A] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#1E8E63]" /> Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none"
                placeholder="procurement@client.in"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Customer Tier</label>
              <select
                id="select-customer-type"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-bold text-[#12372A]"
              >
                <option value="VIP">👑 VIP Account (High Priority)</option>
                <option value="ENTERPRISE">🏢 Enterprise Contract</option>
                <option value="REGULAR">📦 Regular Commercial</option>
              </select>
            </div>
          </div>

          {/* Product & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-[#12372A]">Product SKU (Select Soaps or Industrial)</label>
                <span className="text-[10px] font-mono font-bold text-[#1E8E63]">
                  {totalAvailableAcrossHubs} in stock across hubs
                </span>
              </div>
              <select
                id="select-order-sku"
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-medium bg-white"
              >
                <optgroup label="🧼 Personal Care & Soaps">
                  {products.filter(p => p.category === 'Personal Care & Soaps').map((prod) => (
                    <option key={prod.sku} value={prod.sku}>
                      {prod.sku} — {prod.name} (₹{prod.unitPrice.toLocaleString()})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📦 Warehouse Hardware & Electronics">
                  {products.filter(p => p.category !== 'Personal Care & Soaps').map((prod) => (
                    <option key={prod.sku} value={prod.sku}>
                      {prod.sku} — {prod.name} (₹{prod.unitPrice.toLocaleString()})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-[#12372A]">Quantity Required</label>
                {customerType === 'VIP' && quantity > totalAvailableAcrossHubs && (
                  <span className="text-[10px] font-bold text-[#F26B5B] flex items-center gap-0.5">
                    <ShieldAlert className="w-3 h-3" /> VIP Out-of-Stock Alert ({quantity - totalAvailableAcrossHubs} deficit)
                  </span>
                )}
              </div>
              <input
                type="number"
                id="input-order-quantity"
                min="1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-mono font-bold"
              />
            </div>
          </div>

          {/* Shipping & Delivery Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Shipping Urgency & SLA</label>
              <select
                id="select-shipping-method"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-medium"
              >
                <option value="SAME_DAY">⚡ Same Day Express (&lt; 4h SLA Target)</option>
                <option value="EXPRESS">✈️ Next-Day Air Express (&lt; 12h SLA)</option>
                <option value="STANDARD">🚚 Standard Ground Freight (36h Window)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#12372A]">Destination Delivery City / Address</label>
              <input
                type="text"
                id="input-delivery-city"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none"
                placeholder="e.g. Hyderabad Tech Zone, Telangana"
              />
            </div>
          </div>

          {/* Warehouse Override Selection */}
          <div className="space-y-1">
            <label className="font-bold text-[#12372A]">Fulfillment Warehouse Source</label>
            <select
              id="select-fulfillment-warehouse"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#12372A]/20 focus:ring-2 focus:ring-[#1E8E63] focus:outline-none font-medium"
            >
              <option value="">🤖 Smart Auto-Allocation (AI Recommends Best Stocked & Nearest Hub)</option>
              {warehouses.map((wh) => {
                const stockInWh = inventory.find((i) => i.warehouseId === wh.id && i.sku === selectedSku)?.available || 0;
                return (
                  <option key={wh.id} value={wh.id}>
                    {wh.city} ({wh.name}) — Stock: {stockInWh} units | {wh.capacityUtilization}% Load
                  </option>
                );
              })}
            </select>
          </div>

          {/* Live Decision Simulation Box */}
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#12372A]/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[#12372A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1E8E63]" />
                <span>Decision Intelligence Live Preview</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                  projectedScore >= 80
                    ? 'bg-[#F26B5B] text-white'
                    : projectedScore >= 60
                    ? 'bg-[#F3B562] text-[#12372A]'
                    : 'bg-[#E5EEE5] text-[#12372A]'
                }`}
              >
                Score: {projectedScore} / 100 ({projectedScore >= 80 ? 'CRITICAL' : projectedScore >= 60 ? 'HIGH' : 'NORMAL'})
              </span>
            </div>
            <div className="text-[11px] text-[#202923]/70 flex flex-wrap gap-2">
              <span>✓ Total Order Value: <strong>₹{(selectedProduct.unitPrice * quantity).toLocaleString()}</strong></span>
              <span>• Channel: <strong>{channel}</strong></span>
              <span>• Weight: <strong>{(selectedProduct.weightKg * quantity).toFixed(1)} kg</strong></span>
              <span>• SLA Target: <strong>{shippingMethod === 'SAME_DAY' ? '4 Hours' : shippingMethod === 'EXPRESS' ? '12 Hours' : '36 Hours'}</strong></span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3 border-t border-[#E5EEE5]">
            <button
              type="button"
              onClick={() => setIsNewOrderModalOpen(false)}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-place-order"
              className="py-2.5 px-6 rounded-xl bg-[#12372A] hover:bg-[#12372A]/90 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4 text-[#A7D46F]" />
              <span>Create, Store in DB & Route Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

