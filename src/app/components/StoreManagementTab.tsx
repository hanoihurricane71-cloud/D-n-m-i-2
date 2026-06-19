import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Edit, X, ChevronDown, Check, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreRowItem } from '../types';
import { Toggle } from './Toggle';

interface StoreManagementTabProps {
  stores: StoreRowItem[];
  onCreateStore: (store: Omit<StoreRowItem, 'id' | 'createdAt'>) => void;
  onUpdateStore: (id: string, store: Omit<StoreRowItem, 'id' | 'createdAt'>) => void;
  onDeleteStore: (id: string) => void;
  triggerToast: (msg: string, type: 'success' | 'info') => void;
}

export const StoreManagementTab: React.FC<StoreManagementTabProps> = ({
  stores,
  onCreateStore,
  onUpdateStore,
  onDeleteStore,
  triggerToast
}) => {
  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  // Detail Modal view state
  const [selectedStoreDetails, setSelectedStoreDetails] = useState<StoreRowItem | null>(null);

  // Form Field States
  const [integration, setIntegration] = useState<'OrderDesk' | 'SwiftPOD API'>('SwiftPOD API');
  const [storeName, setStoreName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [returnAddress, setReturnAddress] = useState('');

  // Dropdown status within popup
  const [isIntegrationDropdownOpen, setIsIntegrationDropdownOpen] = useState(false);

  // Validation error states
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Warehouse selection and creation states
  interface WarehouseItem {
    id: string;
    name: string;
    address: string;
  }

  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(() => {
    const saved = localStorage.getItem('swiftpod_warehouses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'wh-1', name: 'Carson Logistics Center', address: '456 Return Way, Carson, CA 90746' },
      { id: 'wh-2', name: 'San Jose Terminal Warehouse', address: '2070 S 7th St. Ste E, San Jose, CA 95112' },
      { id: 'wh-3', name: 'New York Central Hub', address: '100 Enterprise Way, Suite 400, New York, NY 10001' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('swiftpod_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  const [isWarehouseDropdownOpen, setIsWarehouseDropdownOpen] = useState(false);
  const [isNewWarehouseModalOpen, setIsNewWarehouseModalOpen] = useState(false);
  
  // High-fidelity warehouse address fields
  const [whFirstName, setWhFirstName] = useState('');
  const [whLastName, setWhLastName] = useState('');
  const [whCompany, setWhCompany] = useState('');
  const [whEmail, setWhEmail] = useState('');
  const [whPhone, setWhPhone] = useState('');
  const [whCountry, setWhCountry] = useState('United States');
  const [whAddress1, setWhAddress1] = useState('');
  const [whAddress2, setWhAddress2] = useState('');
  const [whCity, setWhCity] = useState('');
  const [whZip, setWhZip] = useState('');

  const integrationDropdownRef = useRef<HTMLDivElement>(null);
  const warehouseDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (integrationDropdownRef.current && !integrationDropdownRef.current.contains(e.target as Node)) {
        setIsIntegrationDropdownOpen(false);
      }
      if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(e.target as Node)) {
        setIsWarehouseDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open modal for Creating
  const handleOpenCreateModal = () => {
    setEditingStoreId(null);
    setIntegration('SwiftPOD API');
    setStoreName('');
    setStoreCode('');
    setReturnAddress('');
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (store: StoreRowItem) => {
    setEditingStoreId(store.id);
    setIntegration(store.integration);
    setStoreName(store.storeName);
    setStoreCode(store.storeCode);
    setReturnAddress(store.returnAddress);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // Toggle Store Active state
  const handleToggleStoreActive = (store: StoreRowItem) => {
    const nextActive = !store.active;
    onUpdateStore(store.id, {
      ...store,
      active: nextActive
    });
    triggerToast(`Store "${store.storeName}" is now ${nextActive ? 'active' : 'inactive'}.`, 'success');
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    const errors: { [key: string]: string } = {};

    if (!storeName.trim()) errors.storeName = 'Store Name is required';
    if (!storeCode.trim()) errors.storeCode = 'Store Code is required';
    if (!returnAddress.trim()) errors.returnAddress = 'Warehouse choice is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      triggerToast('Please fill in all required fields.', 'info');
      return;
    }

    const empName = 'Hiep Tran';

    const storePayload = {
      active: editingStoreId ? (stores.find(s => s.id === editingStoreId)?.active ?? true) : true,
      integration,
      storeName: storeName.trim(),
      storeCode: storeCode.trim().toUpperCase().replace(/\s+/g, '_'),
      returnAddress: returnAddress.trim(),
      createdBy: editingStoreId ? (stores.find(s => s.id === editingStoreId)?.createdBy ?? empName) : empName
    };

    if (editingStoreId) {
      onUpdateStore(editingStoreId, storePayload);
      triggerToast(`Store "${storeName}" updated successfully by ${empName}!`, 'success');
    } else {
      onCreateStore(storePayload);
      triggerToast(`Store "${storeName}" created successfully by ${empName}!`, 'success');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50/40 rounded-2xl select-none">
      
      {/* HEADER SECTION WITH TITLE & ACTION ONLY */}
      <div className="px-6 pt-6 pb-2 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-2xl shrink-0">
        <h1 className="text-2xl font-bold font-sans text-slate-900 leading-tight">
          Store management
        </h1>

        {/* CREATE STORE ACTION BUTTON */}
        <button
          onClick={handleOpenCreateModal}
          className="px-4 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>Create Store</span>
        </button>
      </div>

      {/* MINIMALIST TABLE BOX */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {stores.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-white animate-in fade-in duration-200">
            <Building className="h-10 w-10 text-slate-300 mb-2.5 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-700">No stores connected</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
              Configure and map your online stores with ease. Touch "Create Store" to launch.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-500 border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider whitespace-nowrap font-sans">
                    <th className="py-3 px-6 select-none font-sans">Store Name</th>
                    <th className="py-3 px-6 font-sans">Store Code</th>
                    <th className="py-3 px-6 font-sans">Integration</th>
                    <th className="py-3 px-6 font-sans">Created By</th>
                    <th className="py-3 px-6 font-sans text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/90 text-[13px] text-slate-600">
                  {stores.map((store) => (
                    <tr 
                      key={store.id} 
                      className={`hover:bg-slate-50/70 transition-colors duration-100 ${!store.active ? 'opacity-80 bg-slate-50/20' : ''}`}
                    >
                      {/* Name with Toggle */}
                      <td className="py-4 px-6 font-sans whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <Toggle checked={store.active} onChange={() => handleToggleStoreActive(store)} />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedStoreDetails(store)}
                              className={`font-semibold tracking-tight text-sm text-left hover:underline bg-transparent border-none p-0 cursor-pointer ${
                                store.active ? 'text-brand-600 hover:text-brand-700 font-sans' : 'text-slate-500/80 hover:text-slate-600 font-sans'
                              }`}
                            >
                              {store.storeName}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className={`py-4 px-6 font-mono font-medium whitespace-nowrap transition-colors ${store.active ? 'text-slate-700' : 'text-slate-500'}`}>
                        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded">
                          {store.storeCode}
                        </span>
                      </td>

                      {/* Integration Type */}
                      <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${store.active ? 'text-slate-700' : 'text-slate-500'}`}>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          store.integration === 'SwiftPOD API'
                            ? 'bg-brand-50 border-brand-100 text-brand-700 font-sans'
                            : 'bg-amber-50 border-amber-100 text-amber-700 font-sans'
                        }`}>
                          {store.integration}
                        </span>
                      </td>

                      {/* Created By */}
                      <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${store.active ? 'text-slate-700' : 'text-slate-500'}`}>
                        {store.createdBy || 'Unknown'}
                      </td>

                      {/* Action trigger group */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleOpenEditModal(store)}
                            className="p-1.5 hover:bg-slate-200/70 rounded text-slate-450 hover:text-slate-700 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* STORE DETAILS PORTAL MODAL */}
      <AnimatePresence>
        {selectedStoreDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStoreDetails(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal content dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-slate-100 z-10"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 select-none">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight font-sans">
                    Store Details
                  </h2>
                </div>
                
                <button
                  type="button"
                  onClick={() => setSelectedStoreDetails(null)}
                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[80vh] text-sm">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base font-sans">{selectedStoreDetails.storeName}</h3>
                    <p className="text-xs text-slate-400 font-mono tracking-wide mt-1">Code: {selectedStoreDetails.storeCode}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    selectedStoreDetails.active
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-850'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {selectedStoreDetails.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide font-sans">Integration</h4>
                    <span className="font-semibold text-slate-700 block mt-1 font-sans">{selectedStoreDetails.integration}</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide font-sans">Created By</h4>
                    <span className="font-semibold text-slate-700 block mt-1 font-sans">{selectedStoreDetails.createdBy || 'Unknown'}</span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide font-sans font-sans">Warehouse</h4>
                    <p className="text-slate-600 mt-1 font-medium leading-relaxed font-sans">{selectedStoreDetails.returnAddress || '—'}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide font-sans font-sans">Created At</h4>
                    <p className="text-slate-600 mt-1 font-medium leading-relaxed font-sans">{selectedStoreDetails.createdAt || '—'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedStoreDetails(null)}
                    className="px-4 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold hover:text-slate-900 transition cursor-pointer font-sans"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE & EDIT STORE PORTAL MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal content dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-visible flex flex-col border border-slate-100 z-10"
            >
              {/* Modal Banner Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 select-none">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight font-sans">
                    {editingStoreId ? 'Edit Store' : 'Create Store'}
                  </h2>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content body */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1 overflow-visible">

                {/* Integration Dropdown DropSelect */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block font-sans">
                    Integration *
                  </label>
                  <div className="relative" ref={integrationDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsIntegrationDropdownOpen(!isIntegrationDropdownOpen)}
                      className="h-10 px-3.5 w-full border border-slate-200 bg-white hover:bg-slate-50/50 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer flex items-center justify-between gap-1 select-none font-sans"
                    >
                      <span className="text-slate-800 font-bold">{integration}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    </button>

                    <AnimatePresence>
                      {isIntegrationDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.1 }}
                          className="absolute left-0 w-full bg-white rounded-lg shadow-lg border border-slate-100 z-50 py-1"
                        >
                          {['OrderDesk', 'SwiftPOD API'].map((opt) => {
                            const isSelected = integration === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setIntegration(opt as 'OrderDesk' | 'SwiftPOD API');
                                  setIsIntegrationDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                  isSelected 
                                    ? 'bg-brand-50 text-brand-700 font-bold font-sans' 
                                    : 'text-slate-700 hover:bg-slate-50 font-sans'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <Check className="h-3.5 w-3.5 text-brand-700 shrink-0" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Store Name & Store Code Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {/* Store Name field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block font-sans font-sans">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Olivia Rhye Store"
                      value={storeName}
                      onChange={(e) => {
                        setStoreName(e.target.value);
                        if (e.target.value.trim() && validationErrors.storeName) {
                          setValidationErrors(prev => ({ ...prev, storeName: '' }));
                        }
                      }}
                      className={`h-10 px-3.5 w-full border rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition font-sans ${
                        validationErrors.storeName ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.storeName && (
                      <p className="text-[10px] text-rose-500 font-medium pl-0.5 mt-0.5 font-sans justify-start flex">{validationErrors.storeName}</p>
                    )}
                  </div>

                  {/* Store Code field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block font-sans font-sans">
                      Store Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OLIVIA_RHYE_01"
                      value={storeCode}
                      onChange={(e) => {
                        setStoreCode(e.target.value);
                        if (e.target.value.trim() && validationErrors.storeCode) {
                          setValidationErrors(prev => ({ ...prev, storeCode: '' }));
                        }
                      }}
                      className={`h-10 px-3.5 w-full border rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition font-mono ${
                        validationErrors.storeCode ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.storeCode && (
                      <p className="text-[10px] text-rose-500 font-medium pl-0.5 mt-0.5 font-sans justify-start flex">{validationErrors.storeCode}</p>
                    )}
                  </div>
                </div>

                {/* Return Address / Warehouse choice (Dropdown picker) */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block font-sans font-sans">
                    Warehouse *
                  </label>
                  <div className="relative" ref={warehouseDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsWarehouseDropdownOpen(!isWarehouseDropdownOpen)}
                      className="h-10 px-3.5 w-full border border-slate-200 bg-white hover:bg-slate-50/50 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer flex items-center justify-between gap-1 select-none font-sans"
                    >
                      {returnAddress ? (
                        <div className="text-left">
                          <span className="text-slate-800 font-bold block truncate">
                            {warehouses.find(wh => wh.address === returnAddress)?.name || 'Custom Warehouse'}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate leading-none mt-0.5 font-normal">
                            {returnAddress}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal">Select a warehouse...</span>
                      )}
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    </button>

                    <AnimatePresence>
                      {isWarehouseDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.1 }}
                          className="absolute left-0 w-full bg-white rounded-lg shadow-lg border border-slate-200 z-[70] py-1 mt-1 max-h-60 overflow-y-auto font-sans"
                        >
                          {warehouses.map((wh) => {
                            const isSelected = returnAddress === wh.address;
                            return (
                              <button
                                key={wh.id}
                                type="button"
                                onClick={() => {
                                  setReturnAddress(wh.address);
                                  setIsWarehouseDropdownOpen(false);
                                  if (validationErrors.returnAddress) {
                                    setValidationErrors(prev => ({ ...prev, returnAddress: '' }));
                                  }
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between cursor-pointer hover:bg-slate-50 ${
                                  isSelected ? 'bg-slate-50/60 font-semibold' : ''
                                }`}
                              >
                                <div className="pr-2 truncate">
                                  <span className={`block font-bold truncate ${isSelected ? 'text-brand-650' : 'text-slate-700'}`}>
                                    {wh.name}
                                  </span>
                                  <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                                    {wh.address}
                                  </span>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-brand-600 shrink-0 select-none" />}
                              </button>
                            );
                          })}

                          {/* Create new warehouse option at the end */}
                          <div className="border-t border-slate-100 p-1.5 bg-slate-50/70 sticky bottom-0">
                            <button
                              type="button"
                              onClick={() => {
                                setIsWarehouseDropdownOpen(false);
                                setIsNewWarehouseModalOpen(true);
                              }}
                              className="w-full text-center py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg transition"
                            >
                              + Create new warehouse
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {validationErrors.returnAddress && (
                    <p className="text-[10px] text-rose-500 font-medium pl-0.5 mt-0.5 font-sans justify-start flex">{validationErrors.returnAddress}</p>
                  )}
                </div>

                {/* Action CTA Group Footer buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:text-slate-800 transition cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5.5 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold hover:shadow-sm active:scale-95 transition cursor-pointer font-sans"
                  >
                    {editingStoreId ? 'Save Changes' : 'Create Store'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW WAREHOUSE SUB-MODAL */}
      <AnimatePresence>
        {isNewWarehouseModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewWarehouseModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 border border-slate-150 z-[110] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans text-left">
                  Create New Warehouse
                </h3>
                <button
                  type="button"
                  onClick={() => setIsNewWarehouseModalOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Six row high-fidelity form layout */}
              <div className="space-y-3 font-sans text-xs text-left">
                {/* Row 1: First name * & Last name * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      First name *
                    </label>
                    <input
                      type="text"
                      value={whFirstName}
                      onChange={(e) => setWhFirstName(e.target.value)}
                      placeholder="Lana"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Last name *
                    </label>
                    <input
                      type="text"
                      value={whLastName}
                      onChange={(e) => setWhLastName(e.target.value)}
                      placeholder="Steiner"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                {/* Row 2: Company & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Company
                    </label>
                    <input
                      type="text"
                      value={whCompany}
                      onChange={(e) => setWhCompany(e.target.value)}
                      placeholder="Lana Steiner"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={whEmail}
                      onChange={(e) => setWhEmail(e.target.value)}
                      placeholder="lanasteiner@example.com"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                {/* Row 3: Phone & Country * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={whPhone}
                      onChange={(e) => setWhPhone(e.target.value)}
                      placeholder="555-019-2834"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={whCountry}
                      onChange={(e) => setWhCountry(e.target.value)}
                      placeholder="United States"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                {/* Row 4: Address Line 1 */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={whAddress1}
                    onChange={(e) => setWhAddress1(e.target.value)}
                    placeholder="Warehouse B Regional Store"
                    className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>

                {/* Row 5: Address Line 2 (Optional) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={whAddress2}
                    onChange={(e) => setWhAddress2(e.target.value)}
                    placeholder="Suite 100 or Bldg B"
                    className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>

                {/* Row 6: City * & ZIP / Postcode * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      City *
                    </label>
                    <input
                      type="text"
                      value={whCity}
                      onChange={(e) => setWhCity(e.target.value)}
                      placeholder="San Jose"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      ZIP / Postcode *
                    </label>
                    <input
                      type="text"
                      value={whZip}
                      onChange={(e) => setWhZip(e.target.value)}
                      placeholder="95112"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 text-xs font-semibold animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setIsNewWarehouseModalOpen(false)}
                  className="px-4.5 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition duration-150 cursor-pointer shadow-sm font-sans"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!whFirstName.trim() || !whLastName.trim() || !whCountry.trim() || !whAddress1.trim() || !whCity.trim() || !whZip.trim()) {
                      triggerToast('First name, Last name, Country, Address Line 1, City, and ZIP/Postcode are required.', 'info');
                      return;
                    }
                    const finalName = whCompany.trim() || `${whFirstName.trim()} ${whLastName.trim()}`;
                    const finalAddress = `${whAddress1.trim()}${whAddress2.trim() ? ', ' + whAddress2.trim() : ''}, ${whCity.trim()}, ${whCountry.trim()} ${whZip.trim()}`;
                    const newWh = {
                      id: `wh-${Date.now()}`,
                      name: finalName,
                      address: finalAddress
                    };
                    setWarehouses(prev => [...prev, newWh]);
                    setReturnAddress(newWh.address);
                    
                    // Reset fields
                    setWhFirstName('');
                    setWhLastName('');
                    setWhCompany('');
                    setWhEmail('');
                    setWhPhone('');
                    setWhCountry('United States');
                    setWhAddress1('');
                    setWhAddress2('');
                    setWhCity('');
                    setWhZip('');
                    
                    setIsNewWarehouseModalOpen(false);
                    triggerToast(`Warehouse "${newWh.name}" created successfully!`, 'success');
                  }}
                  className="px-5.5 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold hover:shadow-sm active:scale-95 transition cursor-pointer font-sans"
                >
                  Save Warehouse
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
