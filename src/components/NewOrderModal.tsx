import React, { useState, useEffect } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
  Mail,
  MapPin,
  Clock,
  User,
  Zap,
  Tag,
  Boxes,
  Truck,
  AlertTriangle,
  Flame,
  Search,
  Check,
  Building2,
  Navigation,
  Compass,
  ArrowRight,
  Gem,
  Plus,
  Minus,
} from 'lucide-react';
import { CustomerType, ShippingMethod, OrderChannel } from '../types';
import { USER_PROFILES, CustomerProfile, SKU_IMAGE_MAP, getProductImage } from '../utils/productImages';

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

  // Selected User Profile (Preset or Custom)
  const [activeProfileIndex, setActiveProfileIndex] = useState<number>(0);
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'BOY' | 'GIRL'>('ALL');

  // Customer Form State
  const initialUser = USER_PROFILES[0];
  const [customerName, setCustomerName] = useState(initialUser.name);
  const [customerAvatar, setCustomerAvatar] = useState(initialUser.avatarUrl);
  const [customerGender, setCustomerGender] = useState<'BOY' | 'GIRL'>(initialUser.gender);
  const [customerType, setCustomerType] = useState<CustomerType>(initialUser.customerType);
  const [channel, setChannel] = useState<OrderChannel>(initialUser.channel as OrderChannel);
  const [customerPhone, setCustomerPhone] = useState(initialUser.phone);
  const [customerEmail, setCustomerEmail] = useState(initialUser.email);
  const [area, setArea] = useState(initialUser.area);
  const [landmark, setLandmark] = useState(initialUser.landmark);
  const [destinationCity, setDestinationCity] = useState(`${initialUser.city}, ${initialUser.state}`);
  const [pincode, setPincode] = useState(initialUser.pincode);
  const [gpsCoords, setGpsCoords] = useState(initialUser.gpsCoords);

  // Order Details
  const [selectedSku, setSelectedSku] = useState('SKU-421');
  const [quantity, setQuantity] = useState<number>(2);
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('SAME_DAY');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryBox, setActiveCategoryBox] = useState<string>('ALL');

  // Live Timing String
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTimeStr(d.toLocaleString('en-IN', options) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isNewOrderModalOpen) return null;

  // Handle User Preset Switching
  const handleSelectUserProfile = (profile: CustomerProfile, idx: number) => {
    setActiveProfileIndex(idx);
    setCustomerName(profile.name);
    setCustomerAvatar(profile.avatarUrl);
    setCustomerGender(profile.gender);
    setCustomerType(profile.customerType);
    setChannel(profile.channel as OrderChannel);
    setCustomerPhone(profile.phone);
    setCustomerEmail(profile.email);
    setArea(profile.area);
    setLandmark(profile.landmark);
    setDestinationCity(`${profile.city}, ${profile.state}`);
    setPincode(profile.pincode);
    setGpsCoords(profile.gpsCoords);
    if (profile.recommendedSku) {
      setSelectedSku(profile.recommendedSku);
      setQuantity(profile.defaultQty || 1);
    }
  };

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

  // Categorized Box Collections
  const electricalProducts = [
    { sku: 'SKU-421', name: 'High-Precision Laser LiDAR Sensor', category: 'Electrical & Tech', price: 14500, tag: '⚡ Laser Tech' },
    { sku: 'SKU-872', name: '48V 100Ah Industrial Lithium Battery Pack', category: 'Electrical & Tech', price: 38000, tag: '🔋 HazMat Battery' },
    { sku: 'SKU-104', name: 'Edge AI Microcontroller Board', category: 'Electrical & Tech', price: 4200, tag: '🧠 AI Embedded' },
    { sku: 'SKU-309', name: 'FLIR Thermal Imaging Diagnostic Camera', category: 'Electrical & Tech', price: 52000, tag: '🌡️ Optics' },
    { sku: 'SKU-552', name: '100G Fiber Transceiver Module', category: 'Electrical & Tech', price: 8900, tag: '🌐 Networking' },
    { sku: 'SKU-901', name: 'Brushless Servo Motor 750W', category: 'Electrical & Tech', price: 18500, tag: '⚙️ Automation' },
    { sku: 'SKU-667', name: 'Industrial Barcode Handheld Scanner', category: 'Electrical & Tech', price: 16500, tag: '📟 Scanner' },
  ];

  const girlsDressesProducts = [
    { sku: 'SKU-701', name: 'Pure Kanjivaram Gold Zari Crimson Silk Saree', category: 'Girls Dresses & Sarees', price: 24500, tag: '👑 Pure Silk' },
    { sku: 'SKU-702', name: 'Varanasi Handwoven Banarasi Emerald Silk Saree', category: 'Girls Dresses & Sarees', price: 18900, tag: '✨ Handloom' },
    { sku: 'SKU-703', name: 'Chanderi Handloom Festive Silk Saree', category: 'Girls Dresses & Sarees', price: 8750, tag: '🌸 Festive' },
    { sku: 'SKU-704', name: 'Embroidered Georgette Anarkali Designer Dress', category: 'Girls Dresses & Sarees', price: 12400, tag: '👗 Anarkali' },
    { sku: 'SKU-705', name: 'Mulberry Silk Tiered Indo-Western Maxi Dress', category: 'Girls Dresses & Sarees', price: 9600, tag: '💃 Maxi' },
    { sku: 'SKU-706', name: 'Bridal Velvet & Raw Silk Embroidered Lehenga Set', category: 'Girls Dresses & Sarees', price: 48000, tag: '👰 Bridal' },
    { sku: 'SKU-707', name: 'Hand-Block Printed Pure Cotton Kurta & Palazzo Set', category: 'Girls Dresses & Sarees', price: 3450, tag: '🌿 Cotton' },
    { sku: 'SKU-708', name: 'Sequin Embellished Chiffon Evening Cocktail Gown', category: 'Girls Dresses & Sarees', price: 16200, tag: '✨ Cocktail' },
    { sku: 'SKU-709', name: 'Royal Satin Floral Wrap Summer Dress', category: 'Girls Dresses & Sarees', price: 8400, tag: '🌺 Summer' },
  ];

  const menDressesProducts = [
    { sku: 'SKU-750', name: 'Royal Embroidered Raw Silk Mens Sherwani', category: 'Men Dresses & Menswear', price: 28500, tag: '👑 Royal Sherwani' },
    { sku: 'SKU-751', name: 'Italian Tailored Linen Formal Tuxedo Suit', category: 'Men Dresses & Menswear', price: 32000, tag: '👔 Tuxedo Suit' },
    { sku: 'SKU-752', name: 'Handspun Khadi Pure Cotton Mens Kurta Set', category: 'Men Dresses & Menswear', price: 3900, tag: '🌾 Khadi Kurta' },
    { sku: 'SKU-753', name: 'Egyptian Giza Cotton Slim-Fit Formal Shirt', category: 'Men Dresses & Menswear', price: 4200, tag: '👔 Formal Shirt' },
  ];

  const shoesProducts = [
    { sku: 'SKU-720', name: 'Handcrafted Italian Oxford Leather Formal Shoes', category: 'Shoes & Footwear', price: 14800, tag: '👞 Oxford' },
    { sku: 'SKU-721', name: 'Nike Air Zoom Alphafly Pro Athletic Running Shoes', category: 'Shoes & Footwear', price: 19500, tag: '👟 Pro Marathon' },
    { sku: 'SKU-722', name: 'Handcrafted Royal Gold Embroidered Mojari Juttis', category: 'Shoes & Footwear', price: 4200, tag: '✨ Gold Mojari' },
    { sku: 'SKU-723', name: 'Cobalt Suede Pointed-Toe Luxury Stiletto Heels', category: 'Shoes & Footwear', price: 18400, tag: '👠 Stiletto' },
  ];

  const walletsBagsProducts = [
    { sku: 'SKU-730', name: 'RFID-Blocking Top-Grain Leather Bi-Fold Wallet', category: 'Wallets & Bags', price: 4850, tag: '💼 RFID Bi-Fold' },
    { sku: 'SKU-731', name: 'Saffiano Italian Calfskin Luxury Tote Handbag', category: 'Wallets & Bags', price: 34500, tag: '👜 Italian Calfskin' },
    { sku: 'SKU-732', name: 'Vintage Full-Grain Leather Weekender Travel Duffle', category: 'Wallets & Bags', price: 12900, tag: '🧳 Weekender' },
  ];

  const jewelryEarringsProducts = [
    { sku: 'SKU-740', name: 'Kundan Polki Chandelier Drop Earrings', category: 'Jewelry & Earrings', price: 19800, tag: '💎 Kundan Drop' },
    { sku: 'SKU-741', name: 'Solitaire Diamond Stud Earrings (18K White Gold)', category: 'Jewelry & Earrings', price: 45000, tag: '✨ 18K Solitaire' },
    { sku: 'SKU-742', name: 'Traditional 22K Gold Temple Jhumka Earrings', category: 'Jewelry & Earrings', price: 26500, tag: '👑 Temple Jhumka' },
    { sku: 'SKU-743', name: 'Handcrafted Zircon Royal Bangle Set', category: 'Jewelry & Earrings', price: 8900, tag: '💍 Royal Bangles' },
    { sku: 'SKU-744', name: 'Freshwater Pearl Layered Choker Necklace', category: 'Jewelry & Earrings', price: 14200, tag: '📿 Pearl Choker' },
  ];

  const organicSoapsProducts = [
    { sku: 'SKU-501', name: 'Organic Neem & Turmeric Artisan Soaps (Pack of 12)', category: 'Personal Care & Soaps', price: 780, tag: '🌿 Neem & Turmeric' },
    { sku: 'SKU-502', name: 'Lavender Aromatherapy Luxury Bath Soap (Pack of 6)', category: 'Personal Care & Soaps', price: 540, tag: '💜 Lavender' },
    { sku: 'SKU-503', name: 'Activated Charcoal Detox Soap Bar (Pack of 8)', category: 'Personal Care & Soaps', price: 620, tag: '🖤 Charcoal' },
    { sku: 'SKU-504', name: 'Sandalwood & Saffron Royal Herbal Soap (Pack of 4)', category: 'Personal Care & Soaps', price: 890, tag: '👑 Sandalwood' },
  ];

  const defectiveQuarantineProducts = [
    {
      sku: 'SKU-701',
      name: 'Flagged Damaged Kanjivaram Saree (Weft Snag / Water Stain)',
      category: 'Quarantined Damaged',
      price: 24500,
      tag: '🚫 Defect: Zari Snag',
      defectReason: 'Snag in gold zari border during optical QA scan in Kolkata Vault Q-01.',
      status: 'QUARANTINED',
    },
    {
      sku: 'SKU-730',
      name: 'Flagged Scuffed RFID Leather Wallet (Presentation Box Crush)',
      category: 'Quarantined Damaged',
      price: 4850,
      tag: '🚫 Defect: Box Crushed',
      defectReason: 'Outer presentation box dented; isolated in Delhi Bin Q-03.',
      status: 'QUARANTINED',
    },
    {
      sku: 'SKU-421',
      name: 'Flagged Broken Optical Lens LiDAR Sensor (ESD Shock)',
      category: 'Quarantined Damaged',
      price: 14500,
      tag: '🚫 Defect: Lens Crack',
      defectReason: 'Optical front glass hairline fracture; isolated in Hyderabad ESD Safe Q-04.',
      status: 'QUARANTINED',
    },
    {
      sku: 'SKU-720',
      name: 'Flagged Scuffed Heel Italian Oxford Shoes',
      category: 'Quarantined Damaged',
      price: 14800,
      tag: '🚫 Defect: Abraded Heel',
      defectReason: 'Minor transit scuff on right leather welt; isolated in Pune Bin Q-06.',
      status: 'QUARANTINED',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const fullDestinationAddress = `${area ? area + ', ' : ''}${landmark ? 'Near ' + landmark + ', ' : ''}${destinationCity}${pincode ? ' - ' + pincode : ''}`;

    placeOrder({
      customerName,
      customerType,
      channel,
      customerPhone,
      customerEmail,
      sku: selectedSku,
      quantity: Number(quantity),
      destinationCity: fullDestinationAddress,
      shippingMethod,
      preferredWarehouseId: warehouseId || undefined,
    });

    setIsNewOrderModalOpen(false);
    setCurrentView('orders');
  };

  const filteredUsers = USER_PROFILES.filter((u) => {
    if (genderFilter === 'BOY') return u.gender === 'BOY';
    if (genderFilter === 'GIRL') return u.gender === 'GIRL';
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-[#E5EEE5] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* ======================= MODAL HEADER ======================= */}
        <div className="p-4 sm:p-5 border-b border-[#E5EEE5] flex items-center justify-between bg-[#F7F5EF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#12372A] text-white flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#12372A]">
                Create New Order & Live Ingestion Hub
              </h2>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#1E8E63] text-white">
                Live State Sync
              </span>
            </div>
            <p className="text-xs text-[#202923]/70 mt-0.5">
              Select buyer profile (Boys/Men & Girls/Women), precise delivery coordinates & time, and products categorized into dedicated sector boxes.
            </p>
          </div>
          <button
            onClick={() => setIsNewOrderModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-[#12372A]/10 shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ======================= MODAL SCROLLABLE BODY ======================= */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">

          {/* ------------------------------------------------------------- */}
          {/* 1. BUYER PERSONAS & PROFILE PHOTOS (BOYS & GIRLS) */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#12372A]/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#12372A]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#1E8E63]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#12372A]">
                  1. Select Customer / Buyer Profile (Boys & Girls Portraits)
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-gray-500 font-medium">Filter Portraits:</span>
                <button
                  type="button"
                  onClick={() => setGenderFilter('ALL')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition ${
                    genderFilter === 'ALL' ? 'bg-[#12372A] text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Users ({USER_PROFILES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('BOY')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition flex items-center gap-1 ${
                    genderFilter === 'BOY' ? 'bg-sky-700 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👦 Boys / Men ({USER_PROFILES.filter(u => u.gender === 'BOY').length})
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('GIRL')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition flex items-center gap-1 ${
                    genderFilter === 'GIRL' ? 'bg-rose-700 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👧 Girls / Women ({USER_PROFILES.filter(u => u.gender === 'GIRL').length})
                </button>
              </div>
            </div>

            {/* Buyer Avatar Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filteredUsers.map((profile, idx) => {
                const isSelected = customerName === profile.name;
                return (
                  <button
                    key={profile.name}
                    type="button"
                    onClick={() => handleSelectUserProfile(profile, idx)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition relative overflow-hidden ${
                      isSelected
                        ? 'bg-white border-[#1E8E63] shadow-md ring-2 ring-[#1E8E63]/20'
                        : 'bg-white/80 border-[#E5EEE5] hover:bg-white hover:border-[#12372A]/30'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-2xs"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 text-[9px] px-1 py-0.2 rounded-full font-bold shadow-2xs ${
                          profile.gender === 'BOY' ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-pink-100 text-pink-800 border border-pink-300'
                        }`}
                      >
                        {profile.gender === 'BOY' ? '👦 Boy' : '👧 Girl'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#12372A] truncate text-[11px] block">{profile.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 truncate block">
                        📍 {profile.city} · {profile.channel}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#1E8E63] mt-0.5 block">
                        {profile.customerType === 'VIP' ? '👑 VIP Tier' : profile.customerType === 'ENTERPRISE' ? '🏢 Enterprise' : '📦 Regular'}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#1E8E63] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active User Detailed Info Card */}
            <div className="bg-white p-3 rounded-xl border border-[#12372A]/10 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#12372A] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#1E8E63]" /> Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A] flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-[#1E8E63]" /> Mobile / WhatsApp
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#1E8E63]" /> Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">Customer Tier</label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-bold text-[#12372A] bg-white"
                >
                  <option value="VIP">👑 VIP Account (High Priority)</option>
                  <option value="ENTERPRISE">🏢 Enterprise Contract</option>
                  <option value="REGULAR">📦 Regular Commercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 2. TIMING & PRECISE LOCATION AREA / COORDINATES */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#12372A]/10 space-y-3">
            <div className="flex items-center justify-between border-b border-[#12372A]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1E8E63]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#12372A]">
                  2. Order Placement Timing & Location Coordinates
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold bg-[#E5EEE5] text-[#12372A] px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-[#1E8E63] animate-pulse" />
                <span>{currentTimeStr || 'Live Timing Active'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-[#12372A] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#1E8E63]" /> Delivery Area, Street & Tech Park
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20"
                  placeholder="e.g. Cyber Towers, HITEC City, Madhapur"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A] flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-[#1E8E63]" /> Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20"
                  placeholder="e.g. Opposite Mindspace West Gate"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">City & State</label>
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-bold text-[#12372A]"
                  placeholder="e.g. Hyderabad, Telangana"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">PIN Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-mono"
                  placeholder="500081"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#1E8E63]" /> GPS Coordinates
                </label>
                <input
                  type="text"
                  value={gpsCoords}
                  onChange={(e) => setGpsCoords(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-mono text-[11px]"
                  placeholder="17.4474° N, 78.3762° E"
                />
              </div>
            </div>

            {/* Ordering Channel & Shipping Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#12372A]/10">
              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">Ordering App / Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as OrderChannel)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-bold text-[#12372A] bg-white"
                >
                  <option value="Blinkit">⚡ Blinkit (10-Min Instant Delivery)</option>
                  <option value="Amazon">🛒 Amazon Marketplace & Prime</option>
                  <option value="Swiggy Instamart">🛵 Swiggy Instamart</option>
                  <option value="Zepto">🚀 Zepto Quick Commerce</option>
                  <option value="Flipkart">🛍️ Flipkart Quick & Plus</option>
                  <option value="Direct Web Store">🌐 Brand Direct Web Store</option>
                  <option value="Enterprise EDI">💼 Enterprise EDI / SAP B2B</option>
                  <option value="Myntra">👗 Myntra Express Fashion</option>
                  <option value="Nykaa">💄 Nykaa Beauty & Personal Care</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">Shipping Urgency & SLA</label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-medium bg-white"
                >
                  <option value="SAME_DAY">⚡ Same Day Express (&lt; 4h SLA Target)</option>
                  <option value="EXPRESS">✈️ Next-Day Air Express (&lt; 12h SLA)</option>
                  <option value="STANDARD">🚚 Standard Ground Freight (36h Window)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 3. PRODUCT CATALOG IN SEPARATED DISTINCT BOXES / SECTORS */}
          {/* ------------------------------------------------------------- */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#1E8E63]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#12372A]">
                  3. Select Products from Separated Category Boxes
                </h3>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                Click any product below to instantly configure order line items.
              </div>
            </div>

            {/* Quick Box Filter Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                { id: 'ALL', label: '📦 All Boxes' },
                { id: 'ELECTRICAL', label: '⚡ Electrical Devices' },
                { id: 'GIRLS_DRESSES', label: '👗 Girls Dresses & Sarees' },
                { id: 'MEN_DRESSES', label: '👔 Men Dresses' },
                { id: 'SHOES', label: '👞 Shoes & Footwear' },
                { id: 'WALLETS_BAGS', label: '💼 Wallets & Bags' },
                { id: 'JEWELRY', label: '💎 Jewelry & Earrings' },
                { id: 'SOAPS', label: '🧼 Organic Soaps' },
                { id: 'DEFECTIVE', label: '🚫 Negative Products Sector', alert: true },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategoryBox(tab.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition border ${
                    activeCategoryBox === tab.id
                      ? tab.alert
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-[#12372A] text-white border-[#12372A]'
                      : tab.alert
                      ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ================= BOX 1: ELECTRICAL DEVICES ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'ELECTRICAL') && (
              <div className="bg-slate-50/70 p-4 rounded-2xl border-2 border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black">
                      ⚡
                    </span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-sky-950">
                      Electrical & High-Tech Devices Sector
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                    {electricalProducts.length} Tech Devices Available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {electricalProducts.map((p) => {
                    const isSelected = selectedSku === p.sku;
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <button
                        key={p.sku}
                        type="button"
                        onClick={() => setSelectedSku(p.sku)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-400'
                            : 'bg-white border-gray-200 hover:border-sky-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                            {p.tag}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold block">{p.sku}</span>
                          <span className="font-bold text-[#12372A] text-[11px] line-clamp-2 leading-tight block mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs font-black text-sky-700 font-mono">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= BOX 2: GIRLS DRESSES & SAREES ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'GIRLS_DRESSES') && (
              <div className="bg-pink-50/50 p-4 rounded-2xl border-2 border-pink-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-pink-600 text-white flex items-center justify-center text-xs font-black">
                      👗
                    </span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-pink-950">
                      Girls / Women Dresses & Sarees Sector
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-300">
                    {girlsDressesProducts.length} Couture Silks & Dresses
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {girlsDressesProducts.map((p) => {
                    const isSelected = selectedSku === p.sku;
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <button
                        key={p.sku}
                        type="button"
                        onClick={() => setSelectedSku(p.sku)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-white border-pink-500 shadow-md ring-2 ring-pink-400'
                            : 'bg-white border-gray-200 hover:border-pink-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                            {p.tag}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold block">{p.sku}</span>
                          <span className="font-bold text-[#12372A] text-[11px] line-clamp-2 leading-tight block mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs font-black text-pink-700 font-mono">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= BOX 3: MEN DRESSES & MENSWEAR ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'MEN_DRESSES') && (
              <div className="bg-amber-50/40 p-4 rounded-2xl border-2 border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-700 text-white flex items-center justify-center text-xs font-black">
                      👔
                    </span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">
                      Men Dresses & Royal Menswear Sector
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {menDressesProducts.length} Formal Suits & Sherwanis
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {menDressesProducts.map((p) => {
                    const isSelected = selectedSku === p.sku;
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <button
                        key={p.sku}
                        type="button"
                        onClick={() => setSelectedSku(p.sku)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-white border-amber-600 shadow-md ring-2 ring-amber-400'
                            : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                            {p.tag}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold block">{p.sku}</span>
                          <span className="font-bold text-[#12372A] text-[11px] line-clamp-2 leading-tight block mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs font-black text-amber-800 font-mono">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= BOX 4: SHOES & FOOTWEAR ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'SHOES') && (
              <div className="bg-emerald-50/40 p-4 rounded-2xl border-2 border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-black">
                      👞
                    </span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                      Shoes & Luxury Footwear Sector
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {shoesProducts.length} Footwear Models
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {shoesProducts.map((p) => {
                    const isSelected = selectedSku === p.sku;
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <button
                        key={p.sku}
                        type="button"
                        onClick={() => setSelectedSku(p.sku)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                            : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                            {p.tag}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold block">{p.sku}</span>
                          <span className="font-bold text-[#12372A] text-[11px] line-clamp-2 leading-tight block mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs font-black text-emerald-800 font-mono">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= BOX 5: WALLETS & LEATHER GOODS ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'WALLETS_BAGS') && (
              <div className="bg-orange-50/40 p-4 rounded-2xl border-2 border-orange-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-700 text-white flex items-center justify-center text-xs font-black">
                      💼
                    </span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-orange-950">
                      Wallets, Bags & Leather Goods Sector
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                    {walletsBagsProducts.length} Leather Items
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {walletsBagsProducts.map((p) => {
                    const isSelected = selectedSku === p.sku;
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <button
                        key={p.sku}
                        type="button"
                        onClick={() => setSelectedSku(p.sku)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-white border-orange-600 shadow-md ring-2 ring-orange-400'
                            : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                            {p.tag}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold block">{p.sku}</span>
                          <span className="font-bold text-[#12372A] text-[11px] line-clamp-2 leading-tight block mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs font-black text-orange-800 font-mono">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= BOX 6: JEWELRY & EARRINGS ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'JEWELRY') && (
              <div className="bg-purple-50/40 p-4 rounded-2xl border-2 border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center text-xs font-black">
                      💎
                    </span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-purple-950">
                      Jewelry, Earrings & Royal Accessories Sector
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                    {jewelryEarringsProducts.length} Handcrafted Ornaments
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {jewelryEarringsProducts.map((p) => {
                    const isSelected = selectedSku === p.sku;
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <button
                        key={p.sku}
                        type="button"
                        onClick={() => setSelectedSku(p.sku)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-400'
                            : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                            {p.tag}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold block">{p.sku}</span>
                          <span className="font-bold text-[#12372A] text-[11px] line-clamp-2 leading-tight block mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs font-black text-purple-800 font-mono">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= BOX 7: ORGANIC SOAPS ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'SOAPS') && (
              <div className="bg-teal-50/40 p-4 rounded-2xl border-2 border-teal-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-black">
                      🧼
                    </span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-teal-950">
                      Personal Care & Organic Herbal Soaps Sector
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                    {organicSoapsProducts.length} Artisan Soap Formulations
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {organicSoapsProducts.map((p) => {
                    const isSelected = selectedSku === p.sku;
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <button
                        key={p.sku}
                        type="button"
                        onClick={() => setSelectedSku(p.sku)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-400'
                            : 'bg-white border-gray-200 hover:border-teal-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                            {p.tag}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 font-bold block">{p.sku}</span>
                          <span className="font-bold text-[#12372A] text-[11px] line-clamp-2 leading-tight block mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs font-black text-teal-800 font-mono">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= BOX 8: DEFECTIVE / NEGATIVE PRODUCTS QUARANTINE SECTOR ================= */}
            {(activeCategoryBox === 'ALL' || activeCategoryBox === 'DEFECTIVE') && (
              <div className="bg-rose-50/60 p-4 rounded-2xl border-2 border-rose-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-black animate-pulse">
                      🚫
                    </span>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-rose-950">
                        Defective / Damaged & Negative Product Quarantine Sector
                      </h4>
                      <p className="text-[10px] text-rose-700">
                        Isolated items flagged during QA scan. Ineligible for direct customer dispatch without autonomous replacement swap.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-rose-300">
                    4 Items in Quarantine
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {defectiveQuarantineProducts.map((p) => {
                    const img = SKU_IMAGE_MAP[p.sku] || getProductImage(p.sku);
                    return (
                      <div
                        key={p.name}
                        className="bg-white p-3 rounded-xl border border-rose-300 shadow-2xs flex items-start gap-3 relative"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-rose-200">
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover grayscale-50"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute inset-0 bg-rose-950/20 flex items-center justify-center text-white text-xs font-black">
                            QUARANTINE
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-rose-800">{p.sku}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                              {p.tag}
                            </span>
                          </div>
                          <h5 className="font-bold text-[#12372A] text-xs truncate mt-0.5">{p.name}</h5>
                          <p className="text-[10px] text-rose-700 leading-snug mt-1 bg-rose-50 p-1.5 rounded-md border border-rose-100">
                            <strong>⚠️ Cause:</strong> {p.defectReason}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSku(p.sku);
                                setShippingMethod('SAME_DAY');
                              }}
                              className="px-2 py-1 rounded bg-[#12372A] text-white text-[10px] font-bold hover:bg-[#1E8E63] transition flex items-center gap-1"
                            >
                              ⚡ Order Healthy Replacement Unit
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 4. SELECTED PRODUCT SUMMARY & REAL-TIME QUANTITY STEPPER */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#12372A]/15 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={SKU_IMAGE_MAP[selectedSku] || getProductImage(selectedSku)}
                  alt={selectedProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#12372A]/20 shadow-sm flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#12372A] text-white">
                      {selectedProduct.sku}
                    </span>
                    <span className="text-[10px] font-bold text-[#1E8E63]">
                      ✓ {totalAvailableAcrossHubs} Units Available Across 6 Hubs
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-[#12372A] mt-0.5">{selectedProduct.name}</h4>
                  <span className="text-xs font-mono text-gray-600">
                    Unit Price: <strong>₹{selectedProduct.unitPrice.toLocaleString()}</strong> · Weight: <strong>{selectedProduct.weightKg} kg/unit</strong>
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#12372A]/15 self-start sm:self-center">
                <span className="text-xs font-bold text-gray-600 px-1">Quantity:</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center font-mono font-black text-sm p-1 rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-[#12372A] hover:bg-[#1E8E63] text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Warehouse Allocation Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#12372A]/10 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#12372A]">Fulfillment Warehouse Source</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#12372A]/20 font-medium bg-white"
                >
                  <option value="">🤖 Smart Auto-Allocation (AI Routes to Nearest Hub with Highest Stock)</option>
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

              {/* Priority & Financial Preview */}
              <div className="bg-white p-2.5 rounded-xl border border-[#12372A]/10 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Order Subtotal:</span>
                  <strong className="font-mono font-black text-sm text-[#12372A]">
                    ₹{(selectedProduct.unitPrice * quantity).toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500 font-medium">Predicted Priority:</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                      projectedScore >= 80 ? 'bg-rose-100 text-rose-900' : projectedScore >= 60 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {projectedScore}/100 ({projectedScore >= 80 ? 'CRITICAL VIP' : projectedScore >= 60 ? 'HIGH' : 'NORMAL'})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================= MODAL ACTIONS ======================= */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5EEE5]">
            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1E8E63]" />
              <span>
                Buyer: <strong>{customerName}</strong> · Area: <strong>{area || destinationCity}</strong> · Amount: <strong>₹{(selectedProduct.unitPrice * quantity).toLocaleString()}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="w-1/2 sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-submit-place-order"
                className="w-1/2 sm:w-auto py-2.5 px-6 rounded-xl bg-[#12372A] hover:bg-[#1E8E63] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <CheckCircle2 className="w-4 h-4 text-[#A7D46F]" />
                <span>Place Order & Ingest Live (₹{(selectedProduct.unitPrice * quantity).toLocaleString()})</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
