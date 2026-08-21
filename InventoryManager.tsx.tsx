import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  Check, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  DollarSign, 
  SlidersHorizontal,
  Image as ImageIcon,
  CheckCircle2,
  X
} from 'lucide-react';
import { Product, DepartmentId } from '../types';
import { DEPARTMENTS } from '../data/departments';
import { SafeImage } from './SafeImage';

interface InventoryManagerProps {
  products: Product[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onToggleInStock: (productId: string) => void;
  onAddNewProduct: (newProduct: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onRestockLowItems: () => void;
  onResetToDefaults: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  onUpdateProductStock,
  onUpdateProductPrice,
  onToggleInStock,
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
  onRestockLowItems,
  onResetToDefaults
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'stock-asc' | 'stock-desc' | 'price-desc'>('stock-asc');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for new/editing product
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState<DepartmentId>('mobile');
  const [formCategory, setFormCategory] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState('49');
  const [formOriginalPrice, setFormOriginalPrice] = useState('69');
  const [formStock, setFormStock] = useState('25');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSku, setFormSku] = useState('');

  // Curated Preset Image URLs for quick selection
  const PRESET_IMAGES = [
    { label: 'Smartphone', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', dept: 'mobile' },
    { label: 'Wireless Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', dept: 'electronics' },
    { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80', dept: 'electronics' },
    { label: 'Fashion Trench', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', dept: 'fashion' },
    { label: 'Travel Suitcase', url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80', dept: 'travel' },
    { label: 'Kitchen Blender', url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80', dept: 'home-kitchen' },
    { label: 'Organic Coffee', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80', dept: 'everyday-needs' },
    { label: 'Kids Building Blocks', url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80', dept: 'kids-toys' },
    { label: 'Kids Plush Bear', url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80', dept: 'kids-toys' },
  ];

  // Statistics calculation
  const totalSKUs = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.inStock ? p.stockCount : 0), 0);
  const lowStockCount = products.filter(p => p.inStock && p.stockCount > 0 && p.stockCount <= 5).length;
  const outOfStockCount = products.filter(p => !p.inStock || p.stockCount === 0).length;
  const totalValuation = products.reduce((sum, p) => sum + (p.price * (p.inStock ? p.stockCount : 0)), 0);

  // Filtered & Sorted products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
      product.category.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesDept = selectedDept === 'all' || product.department === selectedDept;

    let matchesStock = true;
    if (stockStatusFilter === 'in-stock') matchesStock = product.inStock && product.stockCount > 5;
    if (stockStatusFilter === 'low-stock') matchesStock = product.inStock && product.stockCount > 0 && product.stockCount <= 5;
    if (stockStatusFilter === 'out-of-stock') matchesStock = !product.inStock || product.stockCount === 0;

    return matchesSearch && matchesDept && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'stock-asc') return a.stockCount - b.stockCount;
    if (sortBy === 'stock-desc') return b.stockCount - a.stockCount;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormDept('mobile');
    setFormCategory('General');
    setFormBrand('BrandCraft');
    setFormPrice('49');
    setFormOriginalPrice('69');
    setFormStock('25');
    setFormImage(PRESET_IMAGES[0].url);
    setFormDescription('High-quality verified item with premium construction and durable materials.');
    setFormSku(`SKU-${Date.now().toString().slice(-6)}`);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormDept(product.department);
    setFormCategory(product.category);
    setFormBrand(product.brand);
    setFormPrice(product.price.toString());
    setFormOriginalPrice(product.originalPrice.toString());
    setFormStock(product.stockCount.toString());
    setFormImage(product.image);
    setFormDescription(product.description);
    setFormSku(product.sku);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice) || 29;
    const origPriceNum = parseFloat(formOriginalPrice) || priceNum;
    const stockNum = parseInt(formStock, 10) || 0;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title: formTitle,
        department: formDept,
        category: formCategory,
        brand: formBrand,
        price: priceNum,
        originalPrice: origPriceNum,
        stockCount: stockNum,
        inStock: stockNum > 0,
        image: formImage || PRESET_IMAGES[0].url,
        description: formDescription,
        sku: formSku,
      };
      onEditProduct(updated);
    } else {
      const newProd: Product = {
        id: `custom-${Date.now()}`,
        title: formTitle,
        department: formDept,
        category: formCategory || 'General',
        brand: formBrand || 'OmniStore',
        price: priceNum,
        originalPrice: origPriceNum,
        rating: 4.8,
        reviewsCount: 12,
        stockCount: stockNum,
        inStock: stockNum > 0,
        image: formImage || PRESET_IMAGES[0].url,
        description: formDescription,
        features: ['Verified Quality', 'Authentic Warranty', 'Fast Dispatch'],
        sku: formSku || `SKU-${Date.now().toString().slice(-6)}`,
        isNew: true
      };
      onAddNewProduct(newProd);
    }
    setIsAddModalOpen(false);
  };

  const exportInventoryCSV = () => {
    const headers = ['SKU', 'Title', 'Department', 'Category', 'Brand', 'Price', 'Original Price', 'Stock Count', 'In Stock', 'Image URL'];
    const rows = products.map(p => [
      `"${p.sku}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.department}"`,
      `"${p.category}"`,
      `"${p.brand}"`,
      p.price,
      p.originalPrice,
      p.stockCount,
      p.inStock ? 'TRUE' : 'FALSE',
      `"${p.image}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omnistore_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 mb-1">
            <Boxes className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Store Stock & Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time stock controls, zero-duplicate catalog integrity, and verified product photos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="inv-restock-low-btn"
            onClick={onRestockLowItems}
            className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Restock all items with <= 5 units back to 25 units"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restock Low ({lowStockCount})</span>
          </button>

          <button
            id="inv-export-csv-btn"
            onClick={exportInventoryCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            id="inv-add-product-btn"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
        
        {/* Total SKUs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total SKUs</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalSKUs}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Unique Items</span>
        </div>

        {/* Total Units */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Stock Units</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{totalStockUnits}</div>
          <span className="text-[10px] text-slate-500">Across 8 Departments</span>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Low Stock (&le; 5)</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{lowStockCount}</div>
          <span className="text-[10px] text-amber-600 font-medium">Needs Attention</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Out of Stock</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{outOfStockCount}</div>
          <span className="text-[10px] text-rose-500">Unavailable to cart</span>
        </div>

        {/* Valuation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Inventory Value</span>
          <div className="text-2xl font-black text-slate-900 mt-1">${totalValuation.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Realized Retail Value</span>
        </div>

      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by title, brand, SKU or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden focus:bg-white focus:border-emerald-500"
          />
        </div>

        {/* Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            id="inv-dept-filter"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Departments ({products.length})</option>
            {DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.shortName}</option>
            ))}
          </select>

          {/* Stock Status */}
          <select
            id="inv-status-filter"
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in-stock">In Stock (&gt; 5)</option>
            <option value="low-stock">Low Stock (&le; 5)</option>
            <option value="out-of-stock">Out of Stock (0)</option>
          </select>

          {/* Sort */}
          <select
            id="inv-sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Item & Photo</th>
                <th className="py-3.5 px-4">Department & SKU</th>
                <th className="py-3.5 px-4">Price ($)</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No products matched your search filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLow = product.inStock && product.stockCount > 0 && product.stockCount <= 5;
                  const isOut = !product.inStock || product.stockCount === 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Photo & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <SafeImage
                              src={product.image}
                              alt={product.title}
                              aspectRatio="aspect-square"
                              fallbackCategory={product.category}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                              {product.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">{product.brand}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department & SKU */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 capitalize mb-0.5">
                          {product.department.replace('-', ' ')}
                        </span>
                        <div className="font-mono text-[10px] text-slate-400">
                          {product.sku}
                        </div>
                      </td>

                      {/* Price (Editable) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => onUpdateProductPrice(product.id, parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900 text-xs focus:bg-white focus:border-indigo-500 outline-hidden"
                          />
                        </div>
                      </td>

                      {/* Stock Level with +/- Stepper */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => onUpdateProductStock(product.id, Math.max(0, product.stockCount - 1))}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={product.stockCount}
                            onChange={(e) => onUpdateProductStock(product.id, Math.max(0, parseInt(e.target.value, 10) || 0))}
                            className="w-14 text-center py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900 text-xs focus:bg-white focus:border-indigo-500 outline-hidden"
                          />
                          <button
                            onClick={() => onUpdateProductStock(product.id, product.stockCount + 1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3 mr-1" />
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low ({product.stockCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 mr-1" />
                            Healthy ({product.stockCount})
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Toggle Active */}
                          <button
                            onClick={() => onToggleInStock(product.id)}
                            className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              product.inStock
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title={product.inStock ? 'Mark as Out of Stock' : 'Mark as Available'}
                          >
                            {product.inStock ? 'Available' : 'Disabled'}
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                            title="Edit Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 cursor-pointer transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingProduct ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Configure product details, stock allocation, and photo URLs for the department section.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Ultra Pro 5G Smartphone"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden focus:bg-white focus:border-emerald-500"
                />
              </div>

              {/* Department & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value as DepartmentId)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Accessories, Cookware, LEGO"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              {/* Brand & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. AeroTech, Nike, Apple"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Stock Keeping Unit (SKU)
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. MOB-AERO-01"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              {/* Price, Original Price & Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Original ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              {/* Image URL & Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Image URL (High-Res Unsplash or Direct URL) *
                </label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 outline-hidden mb-2"
                />

                {/* Preset Chips */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">Presets:</span>
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap border cursor-pointer ${
                        formImage === preset.url
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-hidden"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-transform active:scale-95"
                >
                  {editingProduct ? 'Update Product' : 'Save to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
