import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  PackagePlus, 
  FileText, 
  ChevronDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PurchaseOrder, PurchaseOrderItem } from '../types';
import { VENDOR_OPTIONS, CARRIER_OPTIONS, CUSTOMER_OPTIONS, STYLE_OPTIONS, COLOR_OPTIONS, SIZE_OPTIONS } from '../data';

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (order: Omit<PurchaseOrder, 'id' | 'createdAt'>) => void;
}

export function CreatePurchaseOrderModal({ isOpen, onClose, onCreate }: CreatePurchaseOrderModalProps) {
  // Common Employee ID state
  const [employeeId, setEmployeeId] = useState('');
  const [tempEmpId, setTempEmpId] = useState('');

  // PO general states
  const [vendor, setVendor] = useState(VENDOR_OPTIONS[0]);
  const [poNumber, setPoNumber] = useState(() => `WRO-${Math.floor(100000 + Math.random() * 900000)}`);
  const [shippingCarrier, setShippingCarrier] = useState(CARRIER_OPTIONS[0]);
  const [trackingNumber, setTrackingNumber] = useState(() => `92632${Math.floor(100000000000 + Math.random() * 900000000000)}`);
  const [customer, setCustomer] = useState(CUSTOMER_OPTIONS[1] || 'Alexandra San');

  // Customer search inside dropdown states
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  // Items list state
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    { productInfo: '102 / WHITE / S', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 },
    { productInfo: '102 / BLACK / M', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 },
    { productInfo: '102 / BLACK / L', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 },
    { productInfo: '102 / BLACK / 2XL', sku: 'AJBT1B05M', qty: 2, receivedQty: 2, incomingQty: 2 },
    { productInfo: '102 / BLACK / 3XL', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 },
    { productInfo: '102 / BLACK / 4XL', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 }
  ]);

  // Secondary nested modal for Adding variants list (Search & Multi-add)
  const [isAddVariantsOpen, setIsAddVariantsOpen] = useState(false);
  const [selStyle, setSelStyle] = useState<string>('');
  const [selColor, setSelColor] = useState<string>('');
  const [selSize, setSelSize] = useState<string>('');

  // Search state for each dropdown inside the nested modal
  const [styleSearch, setStyleSearch] = useState('');
  const [colorSearch, setColorSearch] = useState('');
  const [sizeSearch, setSizeSearch] = useState('');

  // Dropdown open states inside the nested modal
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  // Staged products table list inside the nested modal
  const [stagedProducts, setStagedProducts] = useState<{ style: string; color: string; size: string }[]>([]);

  // Automatically sync/generate random Box ID & Employee Code for convenience when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPoNumber(`WRO-${Math.floor(100000 + Math.random() * 900000)}`);
      setTrackingNumber(`92632${Math.floor(100000000000 + Math.random() * 900000000000)}`);
    }
  }, [isOpen]);

  // Filter out 'All...' from options for selection
  const stylesList = STYLE_OPTIONS.filter(s => s !== 'All Styles');
  const colorsList = COLOR_OPTIONS.filter(c => c !== 'All Colors');
  const sizesList = SIZE_OPTIONS.filter(z => z !== 'All Sizes');

  const handleQtyChange = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setItems(prev => prev.map((item, i) => i === index ? { ...item, qty: newQty, receivedQty: newQty, incomingQty: newQty } : item));
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddStagedProduct = (style: string, color: string, size: string) => {
    if (!style || !color || !size) return;
    const exists = stagedProducts.some(p => p.style === style && p.color === color && p.size === size);
    if (!exists) {
      setStagedProducts(prev => [...prev, { style, color, size }]);
    }
    // Automatically clear selections so they are ready for the next product
    setSelStyle('');
    setSelColor('');
    setSelSize('');
  };

  const selectStyle = (val: string) => {
    setSelStyle(val);
    setIsStyleDropdownOpen(false);
    setStyleSearch('');
    if (val && selColor && selSize) {
      handleAddStagedProduct(val, selColor, selSize);
    }
  };

  const selectColor = (val: string) => {
    setSelColor(val);
    setIsColorDropdownOpen(false);
    setColorSearch('');
    if (selStyle && val && selSize) {
      handleAddStagedProduct(selStyle, val, selSize);
    }
  };

  const selectSize = (val: string) => {
    setSelSize(val);
    setIsSizeDropdownOpen(false);
    setSizeSearch('');
    if (selStyle && selColor && val) {
      handleAddStagedProduct(selStyle, selColor, val);
    }
  };

  const handleAddStagedProductsToPO = () => {
    if (stagedProducts.length === 0) {
      return;
    }

    const newItems: PurchaseOrderItem[] = stagedProducts.map(p => ({
      productInfo: `${p.style} / ${p.color} / ${p.size}`,
      sku: 'AJBT1B00M',
      qty: 2,
      receivedQty: 2,
      incomingQty: 2
    }));

    setItems(prev => {
      const merged = [...prev];
      newItems.forEach(nItem => {
        const existingIdx = merged.findIndex(item => item.productInfo === nItem.productInfo);
        if (existingIdx !== -1) {
          // Already exists - maybe leave it
        } else {
          merged.push(nItem);
        }
      });
      return merged;
    });

    // Reset combinations for next open
    setSelStyle('');
    setSelColor('');
    setSelSize('');
    setStagedProducts([]);
    setIsAddVariantsOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

    const itemsWithQty = items.map(i => ({
      ...i,
      receivedQty: 0,
      incomingQty: i.qty
    }));

    onCreate({
      poNumber,
      orderStatus: 'Pending',
      totalQty,
      receivedQty: 0,
      incomingQty: totalQty,
      tracking: trackingNumber,
      ageDays: 1,
      vendor,
      shippingCarrier,
      customer,
      items: itemsWithQty,
      createdBy: employeeId || 'System'
    });

    // Reset items
    setItems([
      { productInfo: '102 / WHITE / S', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 },
      { productInfo: '102 / BLACK / M', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 },
      { productInfo: '102 / BLACK / L', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 }
    ]);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 z-50"
            >
              {/* Header */}
              <div className="px-6 py-4.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Create WRO</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full hover:bg-slate-100 p-1.5 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content Scrollable */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
                
                {/* Left Side: General Info & Employee Section */}
                <div className="w-full lg:w-[40%] shrink-0 space-y-4">
                  
                  {/* Common Employee ID Card block */}
                  {employeeId ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-[11px] text-emerald-600 font-semibold font-sans mb-1">
                          Have a good day!
                        </p>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">Hiep Tran</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Inventory Specialist</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEmployeeId('');
                          setTempEmpId('');
                        }}
                        className="px-3 h-8 border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 rounded-lg text-xs font-bold transition duration-150 shadow-sm cursor-pointer inline-flex items-center justify-center shrink-0"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col justify-center space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Employee ID <span className="text-slate-400 font-normal ml-0.5">*</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={tempEmpId}
                            onChange={(e) => setTempEmpId(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && tempEmpId.trim()) {
                                setEmployeeId(tempEmpId);
                              }
                            }}
                            placeholder="Enter Employee ID"
                            className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (tempEmpId.trim()) {
                              setEmployeeId(tempEmpId);
                            }
                          }}
                          disabled={!tempEmpId.trim()}
                          className="px-4 h-10 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition duration-150 cursor-pointer shadow-xs shrink-0"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}

                  {/* General Info Box */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-xs tracking-wider uppercase select-none pb-2 border-b border-slate-100">
                      <FileText className="h-4 w-4 text-brand-500" />
                      <span>General Info</span>
                    </div>

                    {/* Customer Selection with Search Dropdown on top */}
                    <div className="space-y-1.5 relative z-20">
                      <label className="block text-sm font-medium text-slate-600 font-sans">
                        Customer <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                          className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-left flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{customer}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                        </button>

                        <AnimatePresence>
                          {isCustomerDropdownOpen && (
                            <>
                              {/* Backdrop layer to close dropdown */}
                              <div 
                                className="fixed inset-0 z-40 bg-transparent" 
                                onClick={() => {
                                  setIsCustomerDropdownOpen(false);
                                  setCustomerSearch('');
                                }} 
                              />
                              
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden text-xs max-h-62 flex flex-col"
                              >
                                {/* Customer Search input field */}
                                <div className="p-2 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Search customer..."
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                    className="w-full h-8 px-2.5 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  {customerSearch && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCustomerSearch('');
                                      }}
                                      className="text-[10px] text-slate-400 hover:text-slate-600 px-1 font-bold cursor-pointer"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>

                                {/* Custom customer options options */}
                                <div className="overflow-y-auto max-h-40 divide-y divide-slate-50">
                                  {CUSTOMER_OPTIONS.filter(co => co !== 'All Customers')
                                    .filter(co => co.toLowerCase().includes(customerSearch.toLowerCase()))
                                    .map((co) => (
                                      <button
                                        key={co}
                                        type="button"
                                        onClick={() => {
                                          setCustomer(co);
                                          setIsCustomerDropdownOpen(false);
                                          setCustomerSearch('');
                                        }}
                                        className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition-colors text-xs font-semibold ${co === customer ? 'text-brand-600 bg-brand-50/40 font-bold' : 'text-slate-700'}`}
                                      >
                                        {co}
                                      </button>
                                    ))}
                                  {CUSTOMER_OPTIONS.filter(co => co !== 'All Customers')
                                    .filter(co => co.toLowerCase().includes(customerSearch.toLowerCase())).length === 0 && (
                                      <div className="py-4 text-center text-slate-400 bg-white select-none">
                                        No customer found
                                      </div>
                                    )}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* WRO Number */}
                    <div className="space-y-1.5 relative z-10">
                      <label className="block text-sm font-medium text-slate-600 font-sans">
                        WRO number <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        placeholder="e.g. WRO-1782623"
                        className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-800 font-semibold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        required
                      />
                    </div>

                    {/* Shipping Carrier */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-600 font-sans">
                        Shipping carrier <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={shippingCarrier}
                          onChange={(e) => setShippingCarrier(e.target.value)}
                          className="w-full h-10 pl-3 px-3.5 pr-10 border border-slate-200 bg-white rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer"
                          required
                        >
                          {CARRIER_OPTIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Tracking Number */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-600 font-sans">
                        Tracking number <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. 926326236..."
                        className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-850 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        required
                      />
                    </div>

                  </div>
                </div>

                {/* Right Side: Product Details List */}
                <div className="w-full lg:w-[60%] flex flex-col gap-4">
                  
                  {/* Outer content container card */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/40 flex flex-col min-h-[300px]">
                    <div className="overflow-x-auto overflow-y-auto max-h-[420px] flex-1">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-rose-50 tracking-wide select-none">
                            <th className="py-2.5 px-4 font-sans">Product info</th>
                            <th className="py-2.5 px-4 font-sans">SKU</th>
                            <th className="py-2.5 px-4 font-sans text-left w-36">Quantity</th>
                            <th className="py-2.5 px-4 w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {items.length > 0 ? (
                            items.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 font-bold text-slate-800">
                                  {item.productInfo}
                                </td>
                                <td className="py-3 px-4 text-slate-500 font-mono font-medium">
                                  {item.sku}
                                </td>
                                <td className="py-3 px-4 pl-4">
                                  {/* Quantity controller widget left aligned */}
                                  <div className="flex items-center justify-between border border-slate-200 rounded-lg h-8 overflow-hidden bg-white w-28 shadow-sm">
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(idx, item.qty - 1)}
                                      className="w-8 h-full hover:bg-slate-50 text-slate-500 font-bold active:scale-90 transition-all cursor-pointer flex items-center justify-center shrink-0 border-r border-slate-100/80"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <input
                                      type="text"
                                      value={item.qty}
                                      onChange={(e) => {
                                        const cleanVal = e.target.value.replace(/\D/g, '');
                                        if (cleanVal) handleQtyChange(idx, parseInt(cleanVal, 10));
                                      }}
                                      className="w-12 text-center text-sm font-semibold text-slate-800 border-0 outline-none focus:outline-none focus:ring-0 p-0"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(idx, item.qty + 1)}
                                      className="w-8 h-full hover:bg-slate-50 text-slate-500 font-bold active:scale-90 transition-all cursor-pointer flex items-center justify-center shrink-0 border-l border-slate-100/80"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(idx)}
                                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                                    title="Delete product variant"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                             <tr>
                              <td colSpan={4} className="py-16 text-center text-slate-400 bg-white">
                                <div className="max-w-[240px] mx-auto flex flex-col items-center gap-2">
                                  <AlertCircle className="h-7 w-7 text-slate-300" />
                                  <span className="font-semibold text-slate-600">No products added</span>
                                  <p className="text-[11px] text-slate-400">
                                    Click the "+ Add product" button below to select variants.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add action button positioned outside the table, strictly left-aligned */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelStyle('');
                        setSelColor('');
                        setSelSize('');
                        setStagedProducts([]);
                        setIsAddVariantsOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2 border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-slate-700 hover:text-brand-600 font-semibold rounded-lg text-xs transition duration-150 cursor-pointer shadow-sm shadow-slate-100/50"
                    >
                      <PackagePlus className="h-4 w-4" />
                      <span>Add product</span>
                    </button>
                    {items.length > 0 && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-550 select-none">
                        <span>Total quantity to create:</span>
                        <span className="font-mono bg-brand-50 text-brand-600 font-bold px-2 py-0.5 rounded border border-brand-100 text-sm">
                          {items.reduce((sum, i) => sum + i.qty, 0)}
                        </span>
                      </div>
                    )}
                  </div>

                </div>

              </form>

              {/* Master Operations footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5.5 h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold cursor-pointer outline-none focus:outline-none focus:ring-0 btn-secondary-sheen"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={items.length === 0 || !employeeId.trim()}
                  onClick={(e) => handleFormSubmit(e)}
                  className="px-6.5 h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer outline-none focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none transition-all"
                >
                  Create
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECONDARY MODAL: SEARCHABLE SELECT PRODUCT DIALOG MATCHING IMAGE EXACTLY */}
      <AnimatePresence>
        {isAddVariantsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            {/* Dark backing overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddVariantsOpen(false);
                setIsStyleDropdownOpen(false);
                setIsColorDropdownOpen(false);
                setIsSizeDropdownOpen(false);
              }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />

            {/* Modal Card Nested */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 z-50 flex flex-col font-sans"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-base tracking-tight select-none">Select product</span>
                <button
                  type="button"
                  onClick={() => setIsAddVariantsOpen(false)}
                  className="rounded-full hover:bg-slate-100 p-1.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Main Content Body */}
              <div className="p-5 space-y-4 text-xs font-sans">
                
                {/* 3 Inline Dropdowns Row */}
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Dropdown 1: Select Style */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsStyleDropdownOpen(!isStyleDropdownOpen);
                        setIsColorDropdownOpen(false);
                        setIsSizeDropdownOpen(false);
                      }}
                      className={`w-full h-10 px-3 border rounded-lg text-sm text-slate-700 font-medium text-left flex items-center justify-between cursor-pointer transition ${
                        isStyleDropdownOpen ? 'border-brand-500 ring-1 ring-brand-500 bg-white' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className="truncate">{selStyle || 'Select style'}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>

                    <AnimatePresence>
                      {isStyleDropdownOpen && (
                        <>
                          {/* Backdrop to close list */}
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsStyleDropdownOpen(false);
                              setStyleSearch('');
                            }} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-2 border-b border-slate-100 bg-slate-50 shrink-0">
                              <input
                                type="text"
                                placeholder="Search style..."
                                value={styleSearch}
                                onChange={(e) => setStyleSearch(e.target.value)}
                                className="w-full h-8 px-2.5 border border-slate-200 rounded text-xs text-slate-705 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                                autoFocus
                              />
                            </div>
                            <div className="overflow-y-auto max-h-40 divide-y divide-slate-50">
                              {stylesList
                                .filter(s => s.toLowerCase().includes(styleSearch.toLowerCase()))
                                .map(s => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => selectStyle(s)}
                                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors text-xs font-semibold ${
                                      s === selStyle ? 'text-brand-600 bg-brand-50/40 font-bold' : 'text-slate-700'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Dropdown 2: Select Color */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsColorDropdownOpen(!isColorDropdownOpen);
                        setIsStyleDropdownOpen(false);
                        setIsSizeDropdownOpen(false);
                      }}
                      className={`w-full h-10 px-3 border rounded-lg text-sm text-slate-705 font-medium text-left flex items-center justify-between cursor-pointer transition ${
                        isColorDropdownOpen ? 'border-brand-500 ring-1 ring-brand-500 bg-white' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className="truncate">{selColor || 'Select color'}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>

                    <AnimatePresence>
                      {isColorDropdownOpen && (
                        <>
                          {/* Backdrop to close list */}
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsColorDropdownOpen(false);
                              setColorSearch('');
                            }} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-2 border-b border-slate-100 bg-slate-50 shrink-0">
                              <input
                                type="text"
                                placeholder="Search color..."
                                value={colorSearch}
                                onChange={(e) => setColorSearch(e.target.value)}
                                className="w-full h-8 px-2.5 border border-slate-200 rounded text-xs text-slate-705 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                                autoFocus
                              />
                            </div>
                            <div className="overflow-y-auto max-h-40 divide-y divide-slate-50">
                              {colorsList
                                .filter(c => c.toLowerCase().includes(colorSearch.toLowerCase()))
                                .map(c => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => selectColor(c)}
                                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors text-xs font-semibold ${
                                      c === selColor ? 'text-brand-600 bg-brand-50/40 font-bold' : 'text-slate-700'
                                    }`}
                                  >
                                    {c}
                                  </button>
                                ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Dropdown 3: Select Size */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSizeDropdownOpen(!isSizeDropdownOpen);
                        setIsStyleDropdownOpen(false);
                        setIsColorDropdownOpen(false);
                      }}
                      className={`w-full h-10 px-3 border rounded-lg text-sm text-slate-707 font-medium text-left flex items-center justify-between cursor-pointer transition ${
                        isSizeDropdownOpen ? 'border-brand-500 ring-1 ring-brand-500 bg-white' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className="truncate">{selSize || 'Select size'}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>

                    <AnimatePresence>
                      {isSizeDropdownOpen && (
                        <>
                          {/* Backdrop to close list */}
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsSizeDropdownOpen(false);
                              setSizeSearch('');
                            }} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-2 border-b border-slate-100 bg-slate-50 shrink-0">
                              <input
                                type="text"
                                placeholder="Search size..."
                                value={sizeSearch}
                                onChange={(e) => setSizeSearch(e.target.value)}
                                className="w-full h-8 px-2.5 border border-slate-200 rounded text-xs text-slate-755 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                                autoFocus
                              />
                            </div>
                            <div className="overflow-y-auto max-h-40 divide-y divide-slate-50">
                              {sizesList
                                .filter(sz => sz.toLowerCase().includes(sizeSearch.toLowerCase()))
                                .map(sz => (
                                  <button
                                    key={sz}
                                    type="button"
                                    onClick={() => selectSize(sz)}
                                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors text-xs font-semibold ${
                                      sz === selSize ? 'text-brand-600 bg-brand-50/40 font-bold' : 'text-slate-700'
                                    }`}
                                  >
                                    {sz}
                                  </button>
                                ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                </div>



                {/* Visual table as requested */}
                <div className="border border-slate-100 rounded-lg overflow-hidden bg-white max-h-56 overflow-y-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs table-fixed">
                    <thead className="bg-[#fcfdfd] text-slate-500 font-semibold border-b border-slate-100 select-none uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold text-slate-400 w-[38%]">Style</th>
                        <th className="py-2.5 px-4 font-semibold text-slate-400 w-[30%]">Color</th>
                        <th className="py-2.5 px-4 font-semibold text-slate-400 w-[20%]">Size</th>
                        <th className="py-2.5 pr-4 pl-0 font-semibold text-slate-400 text-right w-[12%]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 select-none">
                      {stagedProducts.map((p, pIdx) => (
                        <tr key={`${p.style}-${p.color}-${p.size}-${pIdx}`} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 text-slate-800 font-semibold font-sans text-xs truncate w-[38%]">{p.style}</td>
                          <td className="py-3 px-4 text-slate-500 font-normal uppercase text-xs truncate w-[30%]">{p.color}</td>
                          <td className="py-3 px-4 text-slate-800 font-semibold uppercase text-xs truncate w-[20%]">{p.size}</td>
                          <td className="py-3 pr-4 pl-0 text-right w-[12%]">
                            <button
                              type="button"
                              onClick={() => setStagedProducts(prev => prev.filter((_, i) => i !== pIdx))}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer inline-flex items-center"
                              title="Delete combination"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {stagedProducts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-10 text-center text-slate-400 bg-white">
                            No options currently built. Select or click '+ Add to list' above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer buttons row */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddVariantsOpen(false)}
                    className="px-5.5 h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold cursor-pointer outline-none focus:outline-none focus:ring-0 btn-secondary-sheen"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={stagedProducts.length === 0}
                    onClick={handleAddStagedProductsToPO}
                    className="px-6.5 h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer outline-none focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none transition-all"
                  >
                    Add
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
