import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronDown, 
  Search, 
  Eye, 
  EyeOff, 
  Calendar 
} from 'lucide-react';
import { AdditionItem } from '../types';
import { VENDOR_OPTIONS, CUSTOMER_OPTIONS } from '../data';

interface CreateInventoryAdditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: AdditionItem) => void;
  onDelete?: (id: string) => void;
  additions: AdditionItem[];
}

export function CreateInventoryAdditionModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  onDelete,
  additions 
}: CreateInventoryAdditionModalProps) {
  // Common Employee ID state
  const [employeeId, setEmployeeId] = useState('');
  const [tempEmpId, setTempEmpId] = useState('');
  const [showEmployeeId, setShowEmployeeId] = useState(false);

  // --- Form Fields ---
  const [customer, setCustomer] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [po, setPo] = useState('');
  const [isPoDropdownOpen, setIsPoDropdownOpen] = useState(false);
  const [product, setProduct] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [locationType, setLocationType] = useState('Rack');
  const [locationVal, setLocationVal] = useState('');
  const [boxId, setBoxId] = useState('');
  const [qty, setQty] = useState(0);

  // Dropdown options lists
  const locationTypes = ['Rack', 'Floor', 'Bin', 'Grid', 'Container'];
  const customersList = CUSTOMER_OPTIONS.filter(c => c !== 'All Customers');
  const sampleProducts = [
    '5000 / BLACK / 3XL',
    '18000 / BLACK / 3XL',
    '1717 / MOSS / 3XL',
    '1717 / BERRY / S',
    '158 / WHITE / M',
    '18000 / BLACK / 4XL',
    '2400 / Charcoal / XL'
  ];
  const samplePos = ['WRO-1782623', 'WRO-1782624', 'WRO-1782625', 'WRO-1782626', 'WRO-1782627', 'WRO-1782628', 'WRO-1782629', 'WRO-1782630'];

  // Session added items for the split pane (Import history on the right)
  const [importHistory, setImportHistory] = useState<AdditionItem[]>([]);

  // Automatically sync/generate random Box ID & Employee Code for convenience when modal opens
  useEffect(() => {
    if (isOpen) {
      setBoxId(String(Math.floor(10000 + Math.random() * 90000)));
      setImportHistory([]);
    }
  }, [isOpen]);

  const handleReset = () => {
    setCustomer('');
    setPo('');
    setProduct('');
    setLocationType('Rack');
    setLocationVal('');
    setBoxId(String(Math.floor(10000 + Math.random() * 90000)));
    setQty(0);
  };

  const handleAdd = () => {
    const currentDateStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const poNumber = po || '1782631';
    const finalBoxId = boxId || String(Math.floor(10000 + Math.random() * 90000));
    const finalProduct = product || '18000 / BLACK / 3XL';
    const finalQty = qty || 12;
    const tracking = '92632' + Math.floor(100000000000 + Math.random() * 900000000000);
    const location = locationVal ? `${locationType} - ${locationVal}` : 'R3V45-S-CD2';

    const generatedId = `add${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAdditionItem: AdditionItem = {
      id: generatedId,
      poNumber,
      boxId: finalBoxId,
      product: finalProduct,
      qty: finalQty,
      tracking,
      location,
      receivingDate: currentDateStr,
      user: employeeId || 'System'
    };

    // 1. Submit to parent state so the main table adds it immediately
    onAdd(newAdditionItem);

    // 2. Add to session history as a successful confirmation
    setImportHistory(prev => [newAdditionItem, ...prev]);
  };

  const handleRemoveHistoryItem = (historyId: string) => {
    setImportHistory(prev => prev.filter(item => item.id !== historyId));
    if (onDelete) {
      onDelete(historyId);
    }
  };

  const isAddDisabled = !employeeId.trim() || !po.trim() || !product.trim() || qty <= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Large split-view modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-100 z-50 text-slate-800"
          >
            {/* Header */}
            <div className="px-6 py-4.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Inventory Addition</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full hover:bg-slate-100 p-1.5 text-slate-450 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Split Grid */}
            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row min-h-0 bg-white">
              
              {/* Left Column: Input Panel */}
              <div className="w-full lg:w-1/2 p-6 border-r border-slate-100 overflow-y-auto">
                
                {/* Simplified Input Form */}
                <div className="space-y-4.5 text-sm">
                  
                  {/* Common Employee ID Card block */}
                  {employeeId ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4.5 h-[106px] flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-[11px] text-emerald-600 font-semibold font-sans mb-1.5">
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
                        className="px-3.5 h-8 border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 rounded-lg text-xs font-bold transition duration-150 shadow-sm cursor-pointer inline-flex items-center justify-center shrink-0"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4.5 h-[106px] flex flex-col justify-center space-y-2">
                       <div className="flex justify-between items-center">
                        <label className="block text-sm font-bold text-slate-700">
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
                            className="w-full h-10 pl-3.5 pr-3 border border-slate-200 bg-white rounded-lg text-sm text-slate-800 font-semibold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
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
                          className="px-4.5 h-10 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition duration-150 cursor-pointer shadow-sm shrink-0"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    
                    {/* Customer Selection Dropdown */}
                    <div className="space-y-1.5 relative">
                      <label className="block text-sm font-semibold text-slate-700">
                        Customer
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                          className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer"
                        >
                          <span>{customer || 'Select customer'}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        <AnimatePresence>
                          {isCustomerDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsCustomerDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-slate-50"
                              >
                                {customersList.map((cust) => (
                                  <button
                                    key={cust}
                                    type="button"
                                    onClick={() => {
                                      setCustomer(cust);
                                      setIsCustomerDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
                                  >
                                    {cust}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* WRO# Dropdown */}
                    <div className="space-y-1.5 relative">
                      <label className="block text-sm font-semibold text-slate-700">
                        WRO number <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsPoDropdownOpen(!isPoDropdownOpen)}
                          className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer"
                        >
                          <span>{po || 'Please enter a keyword'}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        <AnimatePresence>
                          {isPoDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsPoDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-slate-50"
                              >
                                {samplePos.map((num) => (
                                  <button
                                    key={num}
                                    type="button"
                                    onClick={() => {
                                      setPo(num);
                                      setIsPoDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
                                  >
                                    {num}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Product Selection */}
                    <div className="space-y-1.5 relative">
                      <label className="block text-sm font-semibold text-slate-700">
                        Product <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                          className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{product || 'Select Product'}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        <AnimatePresence>
                          {isProductDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsProductDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-slate-50"
                              >
                                {sampleProducts.map((p) => (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => {
                                      setProduct(p);
                                      setIsProductDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 transition truncate"
                                  >
                                    {p}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Location selector row */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-700">
                        Location <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <select
                            value={locationType}
                            onChange={(e) => setLocationType(e.target.value)}
                            className="w-full h-10 pl-3 px-3.5 pr-10 border border-slate-200 bg-white rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer"
                          >
                            {locationTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={locationVal}
                            onChange={(e) => setLocationVal(e.target.value)}
                            placeholder="Select"
                            className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Box ID & Quantity Layout */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Box ID */}
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 truncate">
                          Box ID <span className="text-slate-400 font-normal ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={boxId}
                          onChange={(e) => setBoxId(e.target.value)}
                          className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-855 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          required
                        />
                      </div>

                      {/* Quantity Counter */}
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 truncate">
                          Quantity <span className="text-slate-400 font-normal ml-0.5">*</span>
                        </label>
                        <div className="flex items-center justify-between border border-slate-200 rounded-lg h-10 overflow-hidden bg-white shadow-sm">
                          <button
                            type="button"
                            onClick={() => setQty(prev => Math.max(0, prev - 1))}
                            className="w-10 h-10 hover:bg-slate-50 text-slate-550 font-bold transition flex items-center justify-center border-r border-slate-100 shrink-0"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <input
                            type="text"
                            value={qty}
                            onChange={(e) => {
                              const cleanVal = e.target.value.replace(/\D/g, '');
                              setQty(cleanVal ? parseInt(cleanVal, 10) : 0);
                            }}
                            className="w-full text-center text-sm font-semibold text-slate-800 border-0 outline-none focus:outline-none focus:ring-0 p-0"
                          />
                          <button
                            type="button"
                            onClick={() => setQty(prev => prev + 1)}
                            className="w-10 h-10 hover:bg-slate-50 text-slate-550 font-bold transition flex items-center justify-center border-l border-slate-100 shrink-0"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Left side actions row */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 h-10 border border-slate-200 bg-white text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 hover:text-slate-900 transition duration-150 cursor-pointer shadow-sm"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    disabled={isAddDisabled}
                    onClick={handleAdd}
                    className="px-8 h-10 text-white font-bold rounded-lg text-sm transition duration-150 cursor-pointer btn-primary-gradient disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none shadow-md"
                  >
                    Add
                  </button>
                </div>

              </div>

              {/* Right Column: Import History Pane (Exactly 50% split) */}
              <div className="w-full lg:w-1/2 p-6 flex flex-col min-h-[450px] overflow-hidden bg-white relative">
                
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Header Title: Exactly as in the user screenshot */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 select-none shrink-0">
                    Import history
                  </h3>

                  {importHistory.length > 0 ? (
                    <div className="border border-slate-200/85 rounded-xl overflow-hidden overflow-x-auto overflow-y-auto bg-white flex-1 min-h-[300px] max-h-[420px] relative shadow-xs">
                      <table className="w-full text-left border-collapse text-xs table-fixed min-w-[500px]">
                        <thead className="sticky top-0 bg-[#F8F9FA] z-10 border-b border-slate-100 select-none">
                          <tr className="text-slate-500 text-xs font-semibold whitespace-nowrap">
                            <th className="py-3 px-4 font-sans w-[30%]">Tracking Number</th>
                            <th className="py-3 px-4 font-sans w-[26%]">Location</th>
                            <th className="py-3 px-4 font-sans w-[22%]">BoxID</th>
                            <th className="py-3 px-4 font-sans w-[10%] text-right pr-4">Qty</th>
                            <th className="py-3 px-4 font-sans w-[12%] text-right pr-4 sticky right-0 bg-[#F8F9FA]"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-slate-750">
                          {importHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150 group">
                              <td className="py-3 px-4 text-slate-700 font-sans font-semibold truncate" title={item.tracking}>
                                {item.tracking}
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-sans font-normal truncate" title={item.location}>
                                {item.location}
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-sans font-normal truncate" title={item.boxId}>
                                {item.boxId}
                              </td>
                              <td className="py-3 px-4 text-right pr-4 text-slate-500 font-sans font-normal">
                                {item.qty}
                              </td>
                              <td className="py-3 px-4 text-right pr-4 sticky right-0 bg-white group-hover:bg-slate-50/50 transition duration-150">
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveHistoryItem(item.id)}
                                    className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition duration-150 cursor-pointer inline-flex items-center justify-center"
                                    title="Delete record"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border border-slate-200/85 rounded-xl overflow-hidden bg-white flex-1 min-h-[300px] flex flex-col relative shadow-xs">
                      <table className="w-full text-left border-collapse text-xs table-fixed">
                        <thead className="bg-[#F8F9FA] border-b border-slate-100 select-none">
                          <tr className="text-slate-500 text-xs font-semibold whitespace-nowrap">
                            <th className="py-3 px-4 font-sans w-[30%]">Tracking Number</th>
                            <th className="py-3 px-4 font-sans w-[26%]">Location</th>
                            <th className="py-3 px-4 font-sans w-[22%]">BoxID</th>
                            <th className="py-3 px-4 font-sans w-[10%] text-right pr-4">Qty</th>
                            <th className="py-3 px-4 font-sans w-[12%] text-right pr-4"></th>
                          </tr>
                        </thead>
                      </table>
                      <div className="flex-1 flex items-center justify-center text-slate-450 font-sans tracking-wide text-xs font-semibold py-12 select-none">
                        No Data
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
