import React from 'react';
import {
  Search,
  Calendar,
  X,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  AlertCircle,
  Shirt,
  Layers,
  Coffee,
  ShoppingBag,
  GlassWater,
  Tag,
  BookOpen,
  Smartphone,
  Image as ImageIcon,
  Smile,
  Home,
  Gift,
  Heart,
  Box,
  Package,
  Palette,
  Wind,
  Scissors,
  Sparkles,
  Crown,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FilterDropdown } from './FilterDropdown';
import { Toggle } from './Toggle';
import { Product, TabType } from '../types';
import {
  STYLE_OPTIONS,
  COLOR_OPTIONS,
  SIZE_OPTIONS,
  STOCK_OPTIONS,
  CUSTOMER_OPTIONS,
} from '../data';

interface TypeRowItem {
  id: string;
  typeName: string;
  createdAt: string;
  createdBy: string;
  iconName?: string;
}

interface StyleRowItem {
  id: string;
  productName: string;
  productStyle: string;
  type: string;
  createdAt: string;
  createdBy: string;
}

interface ColorRowItem {
  id: string;
  colorName: string;
  colorHexCode: string;
  colorPreview: string;
  createdAt: string;
  createdBy: string;
}

interface SizeRowItem {
  id: string;
  sizeName: string;
  createdAt: string;
  createdBy: string;
}

function getTypeIcon(typeName: string, iconName?: string) {
  const normIcon = (iconName || '').toLowerCase().trim();

  if (iconName && (iconName.startsWith('data:image/') || iconName.startsWith('blob:') || iconName.startsWith('http://') || iconName.startsWith('https://'))) {
    return <img src={iconName} alt="" className="h-4.5 w-4.5 object-contain select-none" referrerPolicy="no-referrer" />;
  }

  if (normIcon === 'shirt') return <Shirt className="h-4.5 w-4.5 text-indigo-500" />;
  if (normIcon === 'layers') return <Layers className="h-4.5 w-4.5 text-sky-500" />;
  if (normIcon === 'coffee') return <Coffee className="h-4.5 w-4.5 text-amber-500" />;
  if (normIcon === 'shoppingbag') return <ShoppingBag className="h-4.5 w-4.5 text-rose-500" />;
  if (normIcon === 'glasswater') return <GlassWater className="h-4.5 w-4.5 text-emerald-500" />;
  if (normIcon === 'tag') return <Tag className="h-4.5 w-4.5 text-slate-400" />;
  if (normIcon === 'bookopen') return <BookOpen className="h-4.5 w-4.5 text-orange-500" />;
  if (normIcon === 'smartphone') return <Smartphone className="h-4.5 w-4.5 text-teal-400" />;
  if (normIcon === 'image') return <ImageIcon className="h-4.5 w-4.5 text-pink-500" />;
  if (normIcon === 'smile') return <Smile className="h-4.5 w-4.5 text-yellow-500" />;
  if (normIcon === 'home') return <Home className="h-4.5 w-4.5 text-violet-500" />;
  if (normIcon === 'gift') return <Gift className="h-4.5 w-4.5 text-rose-400" />;
  if (normIcon === 'heart') return <Heart className="h-4.5 w-4.5 text-red-500" />;
  if (normIcon === 'box') return <Box className="h-4.5 w-4.5 text-amber-600" />;
  if (normIcon === 'package') return <Package className="h-4.5 w-4.5 text-stone-500" />;
  if (normIcon === 'palette') return <Palette className="h-4.5 w-4.5 text-purple-500" />;
  if (normIcon === 'wind') return <Wind className="h-4.5 w-4.5 text-cyan-500" />;
  if (normIcon === 'scissors') return <Scissors className="h-4.5 w-4.5 text-slate-500" />;
  if (normIcon === 'sparkles') return <Sparkles className="h-4.5 w-4.5 text-amber-400" />;
  if (normIcon === 'crown') return <Crown className="h-4.5 w-4.5 text-amber-500" />;

  const norm = typeName.toLowerCase();
  if (norm.includes('tee') || norm.includes('shirt')) return <Shirt className="h-4.5 w-4.5 text-indigo-500" />;
  if (norm.includes('fleece') || norm.includes('hoodie')) return <Layers className="h-4.5 w-4.5 text-sky-500" />;
  if (norm.includes('mug')) return <Coffee className="h-4.5 w-4.5 text-amber-500" />;
  if (norm.includes('bag') || norm.includes('tote')) return <ShoppingBag className="h-4.5 w-4.5 text-rose-500" />;
  if (norm.includes('tumbler') || norm.includes('bottle')) return <GlassWater className="h-4.5 w-4.5 text-emerald-500" />;
  return <Tag className="h-4.5 w-4.5 text-slate-400" />;
}

interface ProductTabProps {
  // Tab state
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Data
  paginatedProducts: Product[];
  filteredProducts: Product[];
  filteredTypeItems: TypeRowItem[];
  filteredStyleItems: StyleRowItem[];
  filteredColorItems: ColorRowItem[];
  filteredSizeItems: SizeRowItem[];
  types: TypeRowItem[];
  activeFilteredCount: number;

  // Filter state
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchPlaceholder: string;
  selectedStyle: string;
  setSelectedStyle: (v: string) => void;
  selectedColor: string;
  setSelectedColor: (v: string) => void;
  selectedSize: string;
  setSelectedSize: (v: string) => void;
  selectedStock: string;
  setSelectedStock: (v: string) => void;
  selectedCustomer: string;
  setSelectedCustomer: (v: string) => void;
  createdDateFilter: string;
  setCreatedDateFilter: (v: string) => void;
  selectedStyleTypeFilter: string;
  setSelectedStyleTypeFilter: (v: string) => void;
  isFilterActive: boolean;

  // Pagination
  currentPage: number;
  setCurrentPage: (v: number) => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  totalPages: number;
  isPageSizeOpen: boolean;
  setIsPageSizeOpen: (v: boolean) => void;

  // Refs
  dateInputRef: React.RefObject<HTMLInputElement>;

  // Actions
  handleToggleActive: (id: string, current: boolean) => void;
  handleClearFilters: () => void;
  setIsCreateModalOpen: (v: boolean) => void;
  triggerToast: (text: string, type?: 'success' | 'info') => void;
}

export function ProductTab({
  activeTab,
  setActiveTab,
  paginatedProducts,
  filteredProducts,
  filteredTypeItems,
  filteredStyleItems,
  filteredColorItems,
  filteredSizeItems,
  types,
  activeFilteredCount,
  searchQuery,
  setSearchQuery,
  searchPlaceholder,
  selectedStyle,
  setSelectedStyle,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedStock,
  setSelectedStock,
  selectedCustomer,
  setSelectedCustomer,
  createdDateFilter,
  setCreatedDateFilter,
  selectedStyleTypeFilter,
  setSelectedStyleTypeFilter,
  isFilterActive,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  isPageSizeOpen,
  setIsPageSizeOpen,
  dateInputRef,
  handleToggleActive,
  handleClearFilters,
  setIsCreateModalOpen,
  triggerToast,
}: ProductTabProps) {
  return (
    <>
      {/* Header context: Product details */}
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Product</h1>

        {/* Primary category subtabs */}
        <div className="flex items-center gap-6 mt-4 border-b border-slate-100 overflow-x-auto scrollbar-none" id="product-category-tabs">
          {(['Product', 'Type', 'Style', 'Color', 'Size'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  pb-3 font-semibold text-sm transition-all duration-150 relative cursor-pointer block whitespace-nowrap
                  ${isActive ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-700'}
                `}
              >
                <span>{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderbar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Combined Filters / Action Buttons Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">

        {/* Left aligned Filters block */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">

          {/* Name search input */}
          <div
            className={`relative h-10 transition-all duration-300 ease-in-out ${
              searchQuery ? 'w-64' : 'w-52 focus-within:w-64'
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 truncate"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Product-specific filters */}
          {activeTab === 'Product' && (
            <>
              <FilterDropdown label="Style" options={STYLE_OPTIONS} selected={selectedStyle} onSelect={(val) => { setSelectedStyle(val); setCurrentPage(1); }} showSearch={true} />
              <FilterDropdown label="Color" options={COLOR_OPTIONS} selected={selectedColor} onSelect={(val) => { setSelectedColor(val); setCurrentPage(1); }} showSearch={true} />
              <FilterDropdown label="Size" options={SIZE_OPTIONS} selected={selectedSize} onSelect={(val) => { setSelectedSize(val); setCurrentPage(1); }} showSearch={true} />
              <FilterDropdown label="Stock status" options={STOCK_OPTIONS} selected={selectedStock} onSelect={(val) => { setSelectedStock(val); setCurrentPage(1); }} />

              {/* Created Date picker button */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => {
                    if (dateInputRef.current) {
                      try { dateInputRef.current.showPicker(); } catch { dateInputRef.current.click(); }
                    }
                  }}
                  className={`
                    inline-flex items-center gap-1.5 px-4 h-10 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer whitespace-nowrap
                    ${createdDateFilter !== 'All Dates'
                      ? 'border-brand-200 bg-brand-50/50 text-brand-700 hover:bg-brand-50'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Calendar className={`h-4 w-4 shrink-0 ${createdDateFilter !== 'All Dates' ? 'text-brand-500' : 'text-gray-400'}`} />
                  <span>
                    {createdDateFilter !== 'All Dates'
                      ? new Date(createdDateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Created date'}
                  </span>
                  {createdDateFilter !== 'All Dates' ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCreatedDateFilter('All Dates'); setCurrentPage(1); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setCreatedDateFilter('All Dates'); setCurrentPage(1); } }}
                      className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 -mr-1"
                      title="Clear date"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  )}
                </button>

                <input
                  type="date"
                  ref={dateInputRef}
                  value={createdDateFilter === 'All Dates' ? '' : createdDateFilter}
                  onChange={(e) => { setCreatedDateFilter(e.target.value || 'All Dates'); setCurrentPage(1); }}
                  className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                  style={{ top: '50%', left: '50%' }}
                />
              </div>

              <FilterDropdown label="Customer" options={CUSTOMER_OPTIONS} selected={selectedCustomer} onSelect={(val) => { setSelectedCustomer(val); setCurrentPage(1); }} showSearch={true} />
            </>
          )}

          {activeTab === 'Style' && (
            <FilterDropdown
              label="Type"
              options={['All Types', ...Array.from(new Set(types.map(t => t.typeName)))]}
              selected={selectedStyleTypeFilter}
              onSelect={(val) => { setSelectedStyleTypeFilter(val); setCurrentPage(1); }}
              showSearch={true}
            />
          )}

          {/* Reset trigger helper */}
          {isFilterActive && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 h-10 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2 rounded hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right aligned Operations & Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeTab === 'Product' && (
            <button
              type="button"
              onClick={() => triggerToast('Import feature is under design. Coming soon!', 'info')}
              className="inline-flex items-center justify-center gap-1.5 px-4 h-10 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer btn-secondary-sheen"
            >
              <Upload className="h-4 w-4 text-slate-500" />
              <span>Import</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4.5 h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </button>
        </div>

      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">

          {/* Header row */}
          <thead>
            <tr className="bg-[#F8F9FA] text-slate-500 border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider whitespace-nowrap">
              {activeTab === 'Product' && (
                <>
                  <th className="py-3 px-6 select-none font-sans">Name</th>
                  <th className="py-3 px-6 font-sans">Product style / SKU</th>
                  <th className="py-3 px-6 font-sans text-right">Incoming stock</th>
                  <th className="py-3 px-6 font-sans">Stock qty</th>
                  <th className="py-3 px-6 font-sans text-right">Item weight (oz)</th>
                  <th className="py-3 px-6 font-sans text-right">Packaging weight (lbs)</th>
                  <th className="py-3 px-6 font-sans">Customer</th>
                  <th className="py-3 px-6 font-sans">Created date</th>
                  <th className="py-3 px-6 font-sans">Last updated</th>
                  <th className="py-3 px-6 font-sans">User</th>
                </>
              )}
              {activeTab === 'Type' && (
                <>
                  <th className="py-3 px-6 select-none font-sans w-[15%]">ID</th>
                  <th className="py-3 px-6 font-sans w-[15%]">Icon</th>
                  <th className="py-3 px-6 font-sans w-[25%]">Type name</th>
                  <th className="py-3 px-6 font-sans w-[25%]">Created at</th>
                  <th className="py-3 px-6 font-sans w-[20%]">Created by</th>
                </>
              )}
              {activeTab === 'Style' && (
                <>
                  <th className="py-3 px-6 select-none font-sans">ID</th>
                  <th className="py-3 px-6 font-sans">Product name</th>
                  <th className="py-3 px-6 font-sans">Product style</th>
                  <th className="py-3 px-6 font-sans">Type</th>
                  <th className="py-3 px-6 font-sans">Created at</th>
                  <th className="py-3 px-6 font-sans">Created by</th>
                </>
              )}
              {activeTab === 'Color' && (
                <>
                  <th className="py-3 px-6 select-none font-sans">ID</th>
                  <th className="py-3 px-6 font-sans">Color name</th>
                  <th className="py-3 px-6 font-sans">Color Hex code</th>
                  <th className="py-3 px-6 font-sans">Created at</th>
                  <th className="py-3 px-6 font-sans">Created by</th>
                </>
              )}
              {activeTab === 'Size' && (
                <>
                  <th className="py-3 px-6 select-none font-sans">ID</th>
                  <th className="py-3 px-6 font-sans">Size name</th>
                  <th className="py-3 px-6 font-sans">Created at</th>
                  <th className="py-3 px-6 font-sans">Created by</th>
                </>
              )}
            </tr>
          </thead>

          {/* Body Rows */}
          <tbody className="divide-y divide-slate-100/90 text-[13px] text-slate-600">
            {activeTab === 'Product' && (
              paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-slate-50/70 transition-colors duration-100 ${!product.active ? 'opacity-80 bg-slate-50/20' : ''}`}
                  >
                    <td className="py-4 px-6 font-sans whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <Toggle checked={product.active} onChange={() => handleToggleActive(product.id, product.active)} />
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-slate-800 tracking-tight text-sm ${!product.active ? 'text-slate-500/80' : ''}`}>
                            {product.name}
                          </span>
                          {product.user === 'editor123' && (
                            <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 whitespace-nowrap">Flagged Item</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-sans leading-relaxed whitespace-nowrap">
                      <div className="flex flex-col max-w-[240px]">
                        <span className={`font-medium truncate block transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`} title={product.sku.split('\n')[0]}>
                          {product.sku.split('\n')[0]}
                        </span>
                        <span className="text-xs text-slate-400 font-mono tracking-wider mt-0.5 truncate block" title={product.sku.split('\n')[1]}>
                          {product.sku.split('\n')[1]}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 px-6 font-mono font-medium text-right whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                      {product.incomingStock}
                    </td>
                    <td className="py-4 px-6 font-sans whitespace-nowrap">
                      {product.stockQty.toLowerCase().includes('out of stock') ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">Out of stock</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">{product.stockQty}</span>
                      )}
                    </td>
                    <td className={`py-4 px-6 font-mono font-medium text-right whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                      {product.weight.toFixed(1)}
                    </td>
                    <td className={`py-4 px-6 font-mono font-medium text-right whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                      {(product.packagingWeight ?? 1.2).toFixed(1)}
                    </td>
                    <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>{product.customer}</td>
                    <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>{product.createdAt}</td>
                    <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>{product.lastUpdated}</td>
                    <td className={`py-4 px-6 font-mono text-xs font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>{product.user}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-sm font-sans">
                    <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-300" />
                      <span className="font-semibold text-slate-600">No matching products found</span>
                      <p className="text-xs text-slate-400">Try modifying your search query or reset the drop-down filters above.</p>
                      <button onClick={handleClearFilters} className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer">
                        Clear criteria
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}

            {activeTab === 'Type' && (
              filteredTypeItems.length > 0 ? (
                filteredTypeItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                    <td className="py-4 px-6 font-sans text-slate-700 whitespace-nowrap">
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 border border-slate-100">
                        {getTypeIcon(item.typeName, item.iconName)}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.typeName}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-sans">
                    <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-300" />
                      <span className="font-semibold text-slate-600">No matching types found</span>
                      <p className="text-xs text-slate-400">Try modifying your search query or reset filters.</p>
                      <button onClick={handleClearFilters} className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer">Clear criteria</button>
                    </div>
                  </td>
                </tr>
              )
            )}

            {activeTab === 'Style' && (
              filteredStyleItems.length > 0 ? (
                filteredStyleItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                    <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.productName}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.productStyle}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.type}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-sans">
                    <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-300" />
                      <span className="font-semibold text-slate-600">No matching styles found</span>
                      <p className="text-xs text-slate-400">Try modifying your search query or reset filters.</p>
                      <button onClick={handleClearFilters} className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer">Clear criteria</button>
                    </div>
                  </td>
                </tr>
              )
            )}

            {activeTab === 'Color' && (
              filteredColorItems.length > 0 ? (
                filteredColorItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                    <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.colorName}</td>
                    <td className="py-4 px-6 font-sans whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded shadow-sm border border-black/5 block shrink-0" style={{ backgroundColor: item.colorHexCode }} />
                        <span className="font-mono text-slate-700 text-xs font-medium">{item.colorHexCode}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-sans">
                    <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-300" />
                      <span className="font-semibold text-slate-650">No matching colors found</span>
                      <p className="text-xs text-slate-400">Try modifying your search query or reset filters.</p>
                      <button onClick={handleClearFilters} className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer">Clear criteria</button>
                    </div>
                  </td>
                </tr>
              )
            )}

            {activeTab === 'Size' && (
              filteredSizeItems.length > 0 ? (
                filteredSizeItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                    <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.sizeName}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-sm font-sans">
                    <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-300" />
                      <span className="font-semibold text-slate-600">No matching sizes found</span>
                      <p className="text-xs text-slate-400">Try modifying your search query or reset filters.</p>
                      <button onClick={handleClearFilters} className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer">Clear criteria</button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>

        </table>
      </div>

      {/* Table Footer - Page Controls Pagination */}
      <div className="p-4 bg-[#FBFBFD] border-t border-slate-100 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none">

        {/* Page size controller & total counts */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
              className="inline-flex items-center justify-between gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{pageSize}/page</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isPageSizeOpen && (
              <div className="absolute left-0 bottom-full mb-1.5 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {[5, 10, 15, 20].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPageSize(size);
                      setIsPageSizeOpen(false);
                      setCurrentPage(1);
                      triggerToast(`Page size updated to ${size}`, 'info');
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-sm transition-colors ${size === pageSize ? 'bg-brand-50 text-brand-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    {size}/page
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-500 font-medium text-xs font-sans">
            of total <strong className="text-slate-800">{activeFilteredCount.toLocaleString()}</strong> result{activeFilteredCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Numeric and Back/Forward Controls block */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 mx-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = currentPage === pageNum;

              if (totalPages > 6) {
                if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                  if (pageNum === 2 && currentPage > 3) return <span key="ellipsis-start" className="text-slate-400 text-xs px-1 select-none">...</span>;
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 2) return <span key="ellipsis-end" className="text-slate-400 text-xs px-1 select-none">...</span>;
                  return null;
                }
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${isCurrent ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </>
  );
}
